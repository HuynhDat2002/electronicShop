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
      currency: string;
    },
    public readonly sku_default: boolean,
    public readonly sku_sort: number,
    public readonly sku_status:
      | "draft"
      | "published"
      | "deleted"
      | "unPublished",
    public readonly sku_sold: number
  ) {}
}
