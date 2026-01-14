import { Schema, Types } from "mongoose";

export class INVENTORY {
  constructor(
    public readonly inven_id: string,
    public readonly inven_sku_id: string,
    public readonly inven_stock: number,
    public readonly inven_available: number,
    public readonly inven_status: 'inStock' | 'outOfStock' | 'discontinued',
    public readonly inven_reserved:Array<Types.ObjectId>,
    public readonly inven_location: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly _id?: Schema.Types.ObjectId,
    public readonly inven_sku?: Schema.Types.ObjectId,
  ) {}

   static CreateInput: Omit<INVENTORY, 'inven_id' | 'inven_sku'|"updatedAt" | 'createdAt' | '_id' >;
  static UpdateInput: Partial<Omit<INVENTORY, 'inven_id'|'inven_sku_id' | 'createdAt' | '_id'|"updatedAt" |"inven_sku" >> & {
    id:string
  };
}
