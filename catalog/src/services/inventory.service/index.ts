import { IInventoryRepository } from "@/interfaces/inventory.interface";
import { INVENTORY } from "@/models/inventory.model";
import { errorResponse, AppEventListener } from "@/utils";

export class InventoryService {
  private _repository: IInventoryRepository;

  constructor(repository: IInventoryRepository) {
    this._repository = repository;
  }

  async create(input: typeof INVENTORY.CreateInput) {
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError("Cannot create new inventory");

    // AppEventListener.instance.notify({
    //   event: "createSpu",
    //   data,
    // });

    return data;
  }

  async update(
    input: {
      id: string;
    } & typeof INVENTORY.UpdateInput
  ) {
    const data = await this._repository.update(input);
    if (!data) throw new errorResponse.ValidationError("Cannot update inventory");

    AppEventListener.instance.notify({
      event: "createSpu",
      data,
    });

    return data;
  }

  async delete(id: string) {
    const data = await this._repository.delete(id);
    if (!data) throw new errorResponse.ValidationError("Cannot delete inventory");

    AppEventListener.instance.notify({
      event: "createSpu",
      data: { id },
    });

    return data;
  }

  async find(limit: number, offset: number) {
    const data = await this._repository.find(limit, offset);
    if (!data) throw new errorResponse.NotFound("No inventory found");

    return data;
  }

  async findOne(id: string) {
    const inven = await this._repository.findOne(id);
    if (!inven) throw new errorResponse.NotFound("Inventory not found");
    return inven;
  }

  async deleteAll() {
    const deleted = await this._repository.deleteAll();
    if (!deleted) throw new errorResponse.ValidationError("Cannot delete all inventory");

    AppEventListener.instance.notify({
      event: "createSpu",
    });

    return deleted;
  }
}