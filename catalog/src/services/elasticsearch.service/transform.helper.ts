import { inventoryModel } from '@/db/models/mongodb/inventory.model';

/**
 * Transform MongoDB SPU data to Elasticsearch format
 */
export class ElasticsearchTransformer {
  /**
   * Transform SPU with all related data to ES format
   */
  static async transformSpuForElasticsearch(spu: any): Promise<any> {
    // Populate SKUs and Variants if not already populated
    if (!spu.populated('spu_skus')) {
      await spu.populate('spu_skus');
    }
    if (!spu.populated('spu_variants')) {
      await spu.populate('spu_variants');
    }
    if (!spu.populated('spu_default_sku')) {
      await spu.populate('spu_default_sku');
    }

    const skus = spu.spu_skus || [];
    const variants = spu.spu_variants;
    const defaultSku = spu.spu_default_sku || skus.find((s: any) => s.sku_default) || skus[0];

    // Get inventory for default SKU
    let defaultSkuInventory = null;
    if (defaultSku) {
      defaultSkuInventory = await inventoryModel
        .findOne({ inven_sku_id: defaultSku.sku_id })
        .lean();
    }

    // Calculate price range from all SKUs
    const priceRange = this.calculatePriceRange(skus);

    // Transform variants for filtering
    const { variantFields, variantsDetail } = await this.transformVariants(variants, skus);

    // Transform attributes
    const attributes = this.transformAttributes(spu.spu_attributes || []);

    // Get default SKU data
    const defaultSkuData = defaultSku
      ? await this.transformDefaultSku(defaultSku, defaultSkuInventory)
      : null;

    // Calculate availability
    const isAvailable = skus.some((sku: any) => sku.sku_status === 'published');

    // Check if product is new (created in last 30 days)
    const isNew = spu.createdAt
      ? new Date().getTime() - new Date(spu.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
      : false;

    return {
      // Basic info
      spu_id: spu.spu_id,
      spu_name: spu.spu_name,
      spu_slug: spu.spu_slug,
      spu_description: spu.spu_description || '',
      spu_status: spu.spu_status,

      // Thumbnail (object)
      spu_thumb: {
        image_id: spu.spu_thumb?.image_id || '',
        image_url: spu.spu_thumb?.image_url || '',
      },

      // Default SKU (object)
      default_sku: defaultSkuData || null,

      // Price range (object)
      price_range: priceRange,

      // Flattened variants for simple filtering
      ...variantFields,

      // Detailed variants for rich filtering (nested array)
      variants_detail: variantsDetail,

      // Attributes (nested array)
      attributes: attributes,

      // Search & Filter fields
      category_id: '', // TODO: Add category when implemented
      brand: '', // TODO: Extract from attributes if exists
      rating_average: spu.spu_ratingAverage || 0,
      review_count: 0, // TODO: Add when review system is implemented
      sold_count: spu.spu_total_sold || 0,

      // Flags
      is_available: isAvailable,
      is_featured: false, // TODO: Add field to SPU model if needed
      is_new: isNew,

      // Metadata
      created_at: spu.createdAt || new Date(),
      updated_at: spu.updatedAt || new Date(),
    };
  }

  /**
   * Transform default SKU data
   */
  private static async transformDefaultSku(sku: any, inventory: any) {
    const originalPrice = sku.sku_price?.original || 0;
    const salePrice = sku.sku_price?.sale || 0;
    const finalPrice = salePrice > 0 ? salePrice : originalPrice;
    const discountPercent =
      salePrice > 0 && originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    // Determine stock status
    let stockStatus = 'outOfStock';
    const availableQty = inventory?.inven_available || 0;

    if (availableQty > 0) {
      stockStatus = availableQty < 10 ? 'lowStock' : 'inStock';
    }

    return {
      sku_id: sku.sku_id,
      sku_name: sku.sku_name,
      sku_slug: sku.sku_slug,
      price: {
        original: originalPrice,
        sale: finalPrice,
        currency: sku.sku_price?.currency || 'VND',
      },
      discount_percent: discountPercent,
      image: {
        image_id: sku.sku_image?.image_id || '',
        image_url: sku.sku_image?.image_url || '',
      },
      stock_status: stockStatus,
      available_quantity: availableQty,
    };
  }

  /**
   * Calculate price range from all SKUs
   */
  private static calculatePriceRange(skus: any[]) {
    if (!skus || skus.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = skus
      .filter((sku: any) => sku.sku_status === 'published')
      .map((sku: any) => {
        const sale = sku.sku_price?.sale || 0;
        const original = sku.sku_price?.original || 0;
        return sale > 0 ? sale : original;
      })
      .filter((price: number) => price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  /**
   * Transform variants for filtering
   */
  private static async transformVariants(variants: any, skus: any[]) {
    if (!variants || !variants.variant_list || variants.variant_list.length === 0) {
      return {
        variantFields: {},
        variantsDetail: [],
      };
    }

    const variantFields: any = {};
    const variantsDetail: any[] = [];

    // Get all SKUs with their inventory status
    const skusWithInventory = await Promise.all(
      skus.map(async (sku: any) => {
        const inventory = await inventoryModel.findOne({ inven_sku_id: sku.sku_id }).lean();
        const invenAvailable = inventory?.inven_available ?? 0;
        return {
          ...sku,
          available: invenAvailable > 0 && sku.sku_status === 'published',
          inventory,
        };
      })
    );

    for (const variant of variants.variant_list) {
      const variantSlug = variant.variant_slug;
      const variantName = variant.variant_name;
      const options = variant.variant_options || [];

      // Collect available options
      const availableOptions: string[] = [];
      const optionsDetail: any[] = [];

      for (const option of options) {
        const optionValue = option.option_value;
        const optionLabel = option.option_label;

        // Find SKUs with this variant option
        const skusWithOption = skusWithInventory.filter((sku: any) => {
          return sku.sku_variants?.some(
            (v: any) => v.variant_slug === variantSlug && v.option_value === optionValue
          );
        });

        // Check if any SKU with this option is available
        const isAvailable = skusWithOption.some((sku: any) => sku.available);

        // Calculate min price for this option
        const pricesForOption = skusWithOption
          .filter((sku: any) => sku.sku_status === 'published')
          .map((sku: any) => {
            const sale = sku.sku_price?.sale || 0;
            const original = sku.sku_price?.original || 0;
            return sale > 0 ? sale : original;
          })
          .filter((price: number) => price > 0);

        const minPrice = pricesForOption.length > 0 ? Math.min(...pricesForOption) : 0;

        if (isAvailable) {
          availableOptions.push(optionValue);
        }

        optionsDetail.push({
          option_value: optionValue,
          option_label: optionLabel,
          available: isAvailable,
          min_price: minPrice,
          sku_count: skusWithOption.length,
        });
      }

      // Add to flattened variant fields (variant_colors, variant_storages, etc.)
      const fieldName = `variant_${variantSlug}s`; // e.g., "variant_colors", "variant_storages"
      variantFields[fieldName] = availableOptions;

      // Add to variants_detail (nested with metadata)
      variantsDetail.push({
        variant_name: variantName,
        variant_slug: variantSlug,
        options: optionsDetail,
      });
    }

    return {
      variantFields,
      variantsDetail,
    };
  }

  /**
   * Transform attributes
   */
  private static transformAttributes(attributes: any[]) {
    if (!attributes || attributes.length === 0) {
      return [];
    }

    return attributes.map((attr: any) => ({
      attribute_name: attr.attribute_name || '',
      attribute_value: attr.attribute_value || '',
      attribute_label: attr.attribute_label || attr.attribute_value || '',
    }));
  }
}
