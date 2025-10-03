export class INVENTORY {
  constructor(
    public readonly inven_id: string,
    public readonly inven_sku_id: string,
    public readonly inven_stock: number,
    public readonly inven_available: number
  ) {}
}
