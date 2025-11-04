import { ATTRIBUTE } from "@/models/attribute.model";

export interface IAttributeRepository {
  create(data: typeof ATTRIBUTE.CreateInput): Promise<ATTRIBUTE>;
  update(data: typeof ATTRIBUTE.UpdateInput): Promise<ATTRIBUTE>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<ATTRIBUTE[]>;
  findOne(id: string): Promise<ATTRIBUTE>;
  deleteAll(): Promise<any>;
}