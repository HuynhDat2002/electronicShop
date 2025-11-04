import { IReservationRepository } from "@/interfaces/reservation.interface";
import { RESERVATION } from "@/models/reservation.model";
import * as errorResponse from "@/utils/error";
import { reservationModel as db } from "@/db/models/mongodb";
import {omitData} from "@/utils";

export class ReservationRepository implements IReservationRepository {
  async create(data: typeof RESERVATION.CreateInput): Promise<RESERVATION> {
    // Kiểm tra trùng đơn hàng
    const checkExist = await db.findOne({
      reser_order_id: data.reser_order_id,
      reser_inventory_id: data.reser_inventory_id,
    });

    if (checkExist)
      throw new errorResponse.ValidationError(
        "Reservation for this order and inventory already exists"
      );

    const result = await db.create({
      ...data,
      reservedAt: new Date(),
      expiredAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await result.save();
    return omitData<RESERVATION>(
      ["_id", "__v", "reser_inventory"],
      result.toObject()
    );
  }

  update(data: typeof RESERVATION.UpdateInput): Promise<RESERVATION> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<RESERVATION> {
    const reser = await db.findOneAndDelete({ reser_id: id });
    if (!reser)
      throw new errorResponse.ValidationError(
        "Cannot delete this reservation for some reason"
      );
    return omitData<RESERVATION>(["_id", "__v"], reser.toObject());
  }

  find(limit: number, offset: number): Promise<RESERVATION[]> {
    throw new Error("Method not implemented.");
  }

  findOne(id: string): Promise<RESERVATION> {
    throw new Error("Method not implemented.");
  }

  async deleteAll(): Promise<any> {
    const deleted = await db.deleteMany();
    console.log("Deleted all reservations", deleted);
    return deleted;
  }
}