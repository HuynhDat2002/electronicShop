import { VARIANT } from '@/models/variant.model';

// id is _id in mongoose
export interface IVariantRepository {
  create(data: typeof VARIANT.CreateInput): Promise<VARIANT>;
  update(data: typeof VARIANT.UpdateInput): Promise<VARIANT>;
  delete(data: any): Promise<{}>;
  find(limit: number, offset: number): Promise<VARIANT[]>;
  findOne(id: string): Promise<VARIANT>;
  findBySpuId(spu_id: string): Promise<VARIANT | null>;
  deleteAll(): Promise<any>;

  // New methods for managing variant items within a document
  addVariantItem(data: typeof VARIANT.AddVariantItemInput): Promise<VARIANT>;
  updateVariantItem(data: typeof VARIANT.UpdateVariantItemInput): Promise<VARIANT>;
  removeVariantItem(data: typeof VARIANT.RemoveVariantItemInput): Promise<VARIANT>;
}
