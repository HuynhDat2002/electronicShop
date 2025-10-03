export class RESERVATION {
  constructor(
    public readonly reser_id: string, 
    public readonly reser_inventory_id: string,
    public readonly reser_order_id: string,
    public readonly reser_quantity: number,
    public readonly reservedAt: Date,
    public readonly expiredAt: Date | null,
    public readonly reser_status: "pending" | "confirmed" | "cancelled"
  ) {}
}
