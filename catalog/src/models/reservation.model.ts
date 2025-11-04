import { Schema } from "mongoose";

export class RESERVATION {
  constructor(
    public readonly reser_id: string,
    public readonly reser_inventory_id: string,
    public readonly reser_order_id: string,
    public readonly reser_quantity: number,
    public readonly reser_status: "pending" | "confirmed" | "cancelled",
    public readonly reservedAt: Date,
    public readonly expiredAt: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly _id?: Schema.Types.ObjectId,
    public readonly reser_inventory?: Schema.Types.ObjectId, // ref: Inventory"cancelled"
  ) {}

   // Input khi tạo mới (loại bỏ các trường tự sinh)
  static CreateInput: Omit<
    RESERVATION,
    "reser_id" | "_id" | "createdAt" | "updatedAt" | "reser_inventory"
  >;

  // Input khi update (chỉ update các trường cho phép)
  static UpdateInput: Partial<
    Omit<
      RESERVATION,
      "reser_id" | "reser_inventory_id" | "createdAt" | "updatedAt" | "_id" | "reser_inventory"
    >
  > & { id: string };
}
