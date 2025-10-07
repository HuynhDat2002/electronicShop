import { SKU } from '@/models/sku.model';
import { Update, UpdateImage } from '@/types';


// id is _id in mongoose
export interface ISkuRepository {
  create(data: typeof SKU.CreateInput): Promise<SKU>;
  update(data: typeof SKU.UpdateInput): Promise<SKU>;
  updateImage(data: UpdateImage): Promise<SKU>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<SKU[]>;
  findOne(id: string): Promise<SKU>;
  getSkuStock(ids: string[]): Promise<SKU[]>;
  deleteAll():Promise<any>;
}
