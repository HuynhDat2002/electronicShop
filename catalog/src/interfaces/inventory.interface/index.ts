import { INVENTORY } from "@/models/inventory.model";

export interface IInventoryRepository {
  create(data: typeof INVENTORY.CreateInput): Promise<INVENTORY>;
  update(data: typeof INVENTORY.UpdateInput): Promise<INVENTORY>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<INVENTORY[]>;
  findOne(id: string): Promise<INVENTORY>;
  deleteAll(): Promise<any>;
}