import { reservationDto } from "@/dto";
import { errorResponse, OK, CREATED, RequestValidator } from "@/utils";
import { Request, Response, NextFunction } from "express";
import { ReservationService } from "@/services/reservation.service";
import { ReservationRepository } from "@/repositories/reservation.repository";

export const reservationService = new ReservationService(new ReservationRepository());

export class ReservationController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(reservationDto.CreateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await reservationService.create(input);

    new CREATED({
      message: "Create new reservation successfully",
      metadata: data,
    }).send(res);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { errors, input } = await RequestValidator(reservationDto.UpdateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const id = req.params.id;
    const data = await reservationService.update({ id, ...input });

    new OK({
      message: "Update reservation successfully",
      metadata: data,
    }).send(res);
  }

  async find(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    const data = await reservationService.find(Number(limit), Number(offset));

    new OK({
      message: "Get reservations successfully",
      metadata: data,
    }).send(res);
  }

  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const data = await reservationService.findOne(id);

    new OK({
      message: "Get reservation successfully",
      metadata: data,
    }).send(res);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const data = await reservationService.delete(id);

    new OK({
      message: "Delete reservation successfully",
      metadata: data,
    }).send(res);
  }

  async deleteAll(req: Request, res: Response) {
    const data = await reservationService.deleteAll();
    new OK({
      message: "Delete all reservations successfully",
      metadata: data,
    }).send(res);
  }
}