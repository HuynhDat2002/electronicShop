import * as rule from 'class-validator';
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "SKU ID không được để trống" })
  inven_sku_id: string;

  @rule.IsInt()
  @rule.Min(0, { message: "Số lượng tồn kho phải >= 0" })
  inven_stock: number;
  
  @rule.IsOptional()
  @rule.IsString()
  inven_location: string;

  @rule.IsInt()
  @rule.Min(0, { message: "Số lượng khả dụng phải >= 0" })
  inven_available: number;

  @rule.IsOptional()
  @rule.IsArray()
  inven_reserved: Array<string>;

  @rule.IsOptional()
  @rule.IsIn(["inStock", "outOfStock", "discontinued"])
  inven_status: "inStock" | "outOfStock" | "discontinued";
}

export class UpdateRequest {
  @rule.IsOptional()
  @rule.IsInt()
  @rule.Min(0)
  inven_stock?: number;

  @rule.IsOptional()
  @rule.IsString()
  inven_location?: string;

  @rule.IsOptional()
  @rule.IsInt()
  @rule.Min(0)
  inven_available?: number;

  @rule.IsOptional()
  @rule.IsArray()
  inven_reserved?: Array<string>;

  @rule.IsOptional()
  @rule.IsIn(["inStock", "outOfStock", "discontinued"])
  inven_status?: "inStock" | "outOfStock" | "discontinued";
}