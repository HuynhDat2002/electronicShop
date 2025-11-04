import * as rule from 'class-validator';
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "Inventory ID không được để trống" })
  reser_inventory_id: string;

  @rule.IsString()
  @rule.IsNotEmpty({ message: "Order ID không được để trống" })
  reser_order_id: string;

  @rule.IsInt()
  @rule.Min(1, { message: "Số lượng phải >= 1" })
  reser_quantity: number;

  @rule.IsOptional()
  @rule.IsIn(["pending", "confirmed", "cancelled"])
  reser_status: "pending" | "confirmed" | "cancelled";

  @rule.IsOptional()
  @rule.IsDate()
  reservedAt: Date;

  @rule.IsOptional()
  @rule.IsDate()
  expiredAt: Date;
}

export class UpdateRequest {
  @rule.IsOptional()
  @rule.IsInt()
  @rule.Min(1)
  reser_quantity?: number;

  @rule.IsOptional()
  @rule.IsIn(["pending", "confirmed", "cancelled"])
  reser_status?: "pending" | "confirmed" | "cancelled";

  @rule.IsOptional()
  @rule.IsDate()
  expiredAt?: Date;
}
