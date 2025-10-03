import { Types } from 'mongoose';

export class SPU {
  constructor(
    public readonly spu_id: string, // cannot update
    public readonly spu_name: string,
    public readonly spu_slug: string,
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
    public readonly _id?: Types.ObjectId
  ) {}

  static CreateInput: Omit<SPU, 'spu_id' | 'spu_slug' | 'createdAt' | '_id'>;
  static UpdateInput: Partial<Omit<SPU, 'spu_image'|'spu_id' | 'spu_slug' | 'createdAt' | '_id'>> & {
    id:string
  };
}
