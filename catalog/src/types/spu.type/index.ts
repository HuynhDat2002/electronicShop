import { SPU } from '@/models/spu.model';
// constants.ts
// readonly ["draft", "published", "deleted", "unPublished"]
export const SPU_STATUS_CONSTANTS = ['draft', 'published', 'deleted', 'unPublished'] as const;
export type SPU_Status =typeof SPU_STATUS_CONSTANTS[number];

export type Update = {
  id: string;
} & typeof SPU.UpdateInput;

export type UpdateImage = {
  id: string;
  images?: {
    image_id: string;
    image_name: string;
    image_url: string;
  };
  action: 'add' | 'remove';
};