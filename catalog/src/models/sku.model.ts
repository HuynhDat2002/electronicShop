import { Types } from 'mongoose';

export class SKU {
  constructor(
    public readonly sku_id: string,
    public readonly sku_spu_id: string, // ObjectId (ref SPU)
    public readonly sku_name: string,
    public readonly sku_slug: string,
    public readonly sku_price: {
      original: number;
      sale?: number;
      cost?: number;
      currency?: string;
    },
    public readonly sku_inventories: Array<Types.ObjectId>,
    public readonly sku_variants: {
      variant_name: string;
      variant_slug: string;
      option_value: string;
      option_label: string;
    }[],

    public readonly sku_status: 'draft' | 'published' | 'deleted' | 'unPublished',
    public readonly sku_sold: number,
    public readonly sku_default?: boolean,
    public readonly _id?: Types.ObjectId,
    public readonly sku_spu?: Types.ObjectId,
    public sku_image?: {
      image_id?: string;
      image_url: string;
      image_name: string;
    }
  ) {}

  static CreateInput: Omit<
    SKU,
    'sku_id' | 'sku_slug' | 'sku_sold' | '_id' | 'sku_spu' | 'sku_inventories'
  >;
  static UpdateInput: Partial<Omit<SKU, 'sku_id' | 'sku_slug' | 'sku_spu_id'>> & { id: string };
}
