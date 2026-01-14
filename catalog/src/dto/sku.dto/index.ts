import * as rule from 'class-validator';
import * as skuType from '@/types/sku.type';

export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: 'SPU ID không được để trống' })
  sku_spu_id: string;

  @rule.IsString()
  @rule.IsNotEmpty({ message: 'Tên SKU không được để trống' })
  sku_name: string;

  @rule.IsObject()
  sku_price: {
    original: number;
    sale?: number;
    cost?: number;
    currency?: string;
  };

  @rule.IsOptional()
  @rule.IsArray()
  sku_variants: {
    variant_name: string;
    variant_slug: string;
    option_value: string;
    option_label: string;
  }[];

  @rule.IsOptional()
  @rule.IsBoolean()
  sku_default: boolean;

  @rule.IsOptional()
  @rule.IsIn(['draft', 'published', 'deleted', 'unPublished'])
  sku_status: 'draft' | 'published' | 'deleted' | 'unPublished';

  @rule.IsOptional()
  @rule.IsObject()
  sku_image?: {
    image_id?: string;
    image_url: string;
    image_name: string;
  };
}

export class UpdateRequest {
  @rule.IsOptional()
  @rule.IsString()
  sku_name: string;

  @rule.IsOptional()
  @rule.IsObject()
  sku_price: {
    original?: number;
    sale?: number;
    cost?: number;
    currency?: string;
  };

  @rule.IsOptional()
  @rule.IsArray()
  sku_variants: {
    variant_name: string;
    variant_slug: string;
    option_value: string;
    option_label: string;
  }[];

  @rule.IsOptional()
  @rule.IsBoolean()
  sku_default: boolean;

  @rule.IsOptional()
  @rule.IsIn(['draft', 'published', 'deleted', 'unPublished'])
  sku_status: 'draft' | 'published' | 'deleted' | 'unPublished';

  @rule.IsOptional()
  @rule.IsObject()
  sku_image: {
    image_id?: string;
    image_url: string;
    image_name: string;
  };
}
