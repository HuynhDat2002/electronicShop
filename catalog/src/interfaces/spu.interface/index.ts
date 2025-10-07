import { SPU } from '@/models/spu.model';
import { Update, UpdateImage } from '@/types';


// id is _id in mongoose
export interface ISpuRepository {
  create(data: typeof SPU.CreateInput): Promise<SPU>;
  update(data: typeof SPU.UpdateInput): Promise<SPU>;
  updateImage(data: UpdateImage): Promise<SPU>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<SPU[]>;
  findOne(id: string): Promise<SPU>;
  getSpuStock(ids: string[]): Promise<SPU[]>;
  deleteAll():Promise<any>;
}
