import { Schema, Types } from 'mongoose';
import { SKU } from './sku.model';
import { AttributeType } from '@/types';
export class SPU {
  constructor(
    public readonly spu_id: string, // cannot update
    public readonly spu_name: string,
    public readonly spu_slug: string,
    public readonly spu_total_sold:number,
    public spu_image?: Array<{
      image_id?: string;
      image_url: string;
      image_name: string;
    }>,
    public spu_thumb?: {
      image_id?: string;
      image_url: string;
      image_name: string;
    },
    public readonly spu_ratingAverage?: number,

    public readonly spu_status?: 'draft' | 'published' | 'deleted' | 'unPublished',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly spu_description?: string,
    public readonly _id?: Schema.Types.ObjectId,
    public readonly spu_skus?:Array<string>|Array<SKU>,
    public readonly spu_variants?:Array<string>,
    public spu_attributes?:Array<AttributeType>,
  ) {}

  static CreateInput: Omit<SPU, 'spu_id' | 'spu_slug' | 'createdAt' | '_id' |'spu_ratingAverage'|'spu_skus'|'spu_variants'|'spu_total_sold'>;
  static UpdateInput: Partial<Omit<SPU, 'spu_image'|'spu_id' | 'spu_slug' | 'createdAt' | '_id'>> & {
    id:string
  };
}
