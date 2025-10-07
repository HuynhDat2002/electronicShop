import { SKU } from '@/models/sku.model';
// constants.ts
// readonly ["draft", "published", "deleted", "unPublished"]
export const SKU_STATUS_CONSTANTS = ['draft', 'published', 'deleted', 'unPublished'] as const;
export type SKU_Status =typeof SKU_STATUS_CONSTANTS[number];


export type UpdateImage = {
  id: string;
  images?: {
    image_id: string;
    image_name: string;
    image_url: string;
  };
  action: 'add' | 'remove';
};

export type Price={
  original:number,
  sale?:number,
  cost?:number,
  currency?:string
}