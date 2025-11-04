import { IInventoryRepository } from "@/interfaces/inventory.interface";
import { INVENTORY } from "@/models/inventory.model";
import * as errorResponse from "@/utils/error";
import { inventoryModel as db } from "@/db/models/mongodb";
import { omitData } from "@/utils";

export class InventoryRepository implements IInventoryRepository {
  async create(data: typeof INVENTORY.CreateInput): Promise<INVENTORY> {
    // Kiểm tra SKU tồn tại (tránh trùng inventory)
    const checkExist = await db.findOne({ inven_sku_id: data.inven_sku_id });
    if (checkExist)
      throw new errorResponse.ValidationError(
        "Inventory for this SKU already exists"
      );

    const result = await db.create(data);
    await result.save();

    return omitData<INVENTORY>(["_id", "__v", "inven_sku"], result.toObject());
  }

  update(data: typeof INVENTORY.UpdateInput): Promise<INVENTORY> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<INVENTORY> {
    const inven = await db.findOneAndDelete({ inven_id: id });
    if (!inven)
      throw new errorResponse.ValidationError(
        "Cannot delete this inventory for some reason"
      );
    return omitData<INVENTORY>(["_id", "__v"], inven.toObject());
  }

  find(limit: number, offset: number): Promise<INVENTORY[]> {
    throw new Error("Method not implemented.");
  }

  findOne(id: string): Promise<INVENTORY> {
    throw new Error("Method not implemented.");
  }

  async deleteAll(): Promise<any> {
    const deleted = await db.deleteMany();
    console.log("Deleted all inventories", deleted);
    return deleted;
  }
}