import { IReservationRepository } from "@/interfaces/reservation.interface";
import { RESERVATION } from "@/models/reservation.model";
import { errorResponse, AppEventListener } from "@/utils";

export class ReservationService {
  private _repository: IReservationRepository;

  constructor(repository: IReservationRepository) {
    this._repository = repository;
  }

  async create(input: typeof RESERVATION.CreateInput) {
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError("Cannot create reservation");

    AppEventListener.instance.notify({
      event: "createSpu",
      data,
    });

    return data;
  }

  async update(
    input: {
      id: string;
    } & typeof RESERVATION.UpdateInput
  ) {
    const data = await this._repository.update(input);
    if (!data) throw new errorResponse.ValidationError("Cannot update reservation");

    AppEventListener.instance.notify({
      event: "createSpu",
      data,
    });

    return data;
  }

  async delete(id: string) {
    const data = await this._repository.delete(id);
    if (!data) throw new errorResponse.ValidationError("Cannot delete reservation");

    AppEventListener.instance.notify({
      event: "createSpu",
      data: { id },
    });

    return data;
  }

  async find(limit: number, offset: number) {
    const data = await this._repository.find(limit, offset);
    if (!data) throw new errorResponse.NotFound("No reservation found");

    return data;
  }

  async findOne(id: string) {
    const reser = await this._repository.findOne(id);
    if (!reser) throw new errorResponse.NotFound("Reservation not found");
    return reser;
  }

  async deleteAll() {
    const deleted = await this._repository.deleteAll();
    if (!deleted) throw new errorResponse.ValidationError("Cannot delete all reservations");

    AppEventListener.instance.notify({
      event: "createSpu",
    });

    return deleted;
  }
}