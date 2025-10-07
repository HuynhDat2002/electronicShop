export class VARIATION {
  constructor(
    public readonly variation_id: string,   // VD: variation_1737975_3
    public readonly variation_sku_id: string, // ObjectId -> string (ref SKU)
    public readonly variation_name: string,   // VD: "Màu sắc", "Kích thước"
    public readonly variation_slug: string,   // slug unique
    public readonly variation_type: "color" | "size" | "text" | "number",
    public readonly variation_options: {
      value: string;
      label: string;
      code?: string;       // chỉ dùng cho type = 'color'
      image_url?: string;  // ảnh đại diện option
      sortOrder: number;
    }[],
    public readonly variation_category: string, // ObjectId -> string (ref Category)
    public readonly variation_status: "active" | "inactive"
  ) {}
}
