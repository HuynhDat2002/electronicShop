import { inventoryDto } from "@/dto";
import { errorResponse, OK, CREATED, RequestValidator } from "@/utils";
import { Request, Response, NextFunction } from "express";
import { InventoryService } from "@/services/inventory.service";
import { InventoryRepository } from "@/repositories/inventory.repository";

export const inventoryService = new InventoryService(new InventoryRepository());

export class InventoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(inventoryDto.CreateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await inventoryService.create(input);

    new CREATED({
      message: "Create new inventory successfully",
      metadata: data,
    }).send(res);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(inventoryDto.UpdateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const id = req.params.id;
    const data = await inventoryService.update({ id, ...input });

    new OK({
      message: "Update inventory successfully",
      metadata: data,
    }).send(res);
  }

  async find(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    const data = await inventoryService.find(Number(limit), Number(offset));

    new OK({
      message: "Get inventories successfully",
      metadata: data,
    }).send(res);
  }

  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const data = await inventoryService.findOne(id);

    new OK({
      message: "Get inventory successfully",
      metadata: data,
    }).send(res);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const data = await inventoryService.delete(id);

    new OK({
      message: "Delete inventory successfully",
      metadata: data,
    }).send(res);
  }

  async deleteAll(req: Request, res: Response) {
    const data = await inventoryService.deleteAll();
    new OK({
      message: "Delete all inventories successfully",
      metadata: data,
    }).send(res);
  }
}
