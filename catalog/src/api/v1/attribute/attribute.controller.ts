import { attributeDto } from "@/dto";
import { errorResponse, OK, CREATED, RequestValidator } from "@/utils";
import { Request, Response, NextFunction } from "express";
import { AttributeService } from "@/services/attribute.service";
import { AttributeRepository } from "@/repositories/attribute.repository";

export const attributeService = new AttributeService(new AttributeRepository());

export class AttributeController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(attributeDto.CreateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await attributeService.create(input);

    new CREATED({
      message: "Create new attribute successfully",
      metadata: data,
    }).send(res);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(attributeDto.UpdateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const id = req.params.id;
    const data = await attributeService.update({ id, ...input });

    new OK({
      message: "Update attribute successfully",
      metadata: data,
    }).send(res);
  }

  async find(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    const data = await attributeService.find(Number(limit), Number(offset));

    new OK({
      message: "Get attributes successfully",
      metadata: data,
    }).send(res);
  }

  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const data = await attributeService.findOne(id);

    new OK({
      message: "Get attribute successfully",
      metadata: data,
    }).send(res);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const data = await attributeService.delete(id);

    new OK({
      message: "Delete attribute successfully",
      metadata: data,
    }).send(res);
  }

  async deleteAll(req: Request, res: Response) {
    const data = await attributeService.deleteAll();
    new OK({
      message: "Delete all attributes successfully",
      metadata: data,
    }).send(res);
  }
}