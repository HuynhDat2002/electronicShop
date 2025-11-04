import { RESERVATION } from "@/models/reservation.model";

export interface IReservationRepository {
  create(data: typeof RESERVATION.CreateInput): Promise<RESERVATION>;
  update(data: typeof RESERVATION.UpdateInput): Promise<RESERVATION>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<RESERVATION[]>;
  findOne(id: string): Promise<RESERVATION>;
  deleteAll(): Promise<any>;
}