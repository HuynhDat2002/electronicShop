import { Types } from 'mongoose';

export interface VariantOption {
  option_value: string; // "red", "256gb"
  option_label: string; // "Đỏ", "256GB"
}

export interface VariantItem {
  variant_name: string; // "Color", "Storage", "RAM"
  variant_slug: string; // "color", "storage", "ram"
  variant_options: VariantOption[];
}

export class VARIANT {
  constructor(
    public readonly variant_id: string,
    public readonly variant_spu_id: Types.ObjectId,
    public readonly variant_list: VariantItem[],
    public readonly variant_status: 'active' | 'inactive',
    public readonly _id?: Types.ObjectId,
    public readonly variant_spu?: Types.ObjectId,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static CreateInput: Omit<
    VARIANT,
    | 'variant_id'
    | 'createdAt'
    | 'updatedAt'
    | '_id'
    | 'variant_spu'
  >;

  static UpdateInput: Partial<
    Omit<VARIANT, 'variant_id' | 'variant_spu_id' | 'variant_spu' | 'createdAt' | 'updatedAt' | '_id'>
  > & {
    id: string;
  };

  static AddVariantItemInput: {
    variant_spu_id: string;
    variant_name: string;
    variant_options: VariantOption[];
    variant_position?: number;
  };

  static UpdateVariantItemInput: {
    variant_spu_id: string;
    variant_name: string; // variant name to update
    variant_options?: VariantOption[];
    variant_position?: number;
  };

  static RemoveVariantItemInput: {
    variant_spu_id: string;
    variant_name: string; // variant name to remove
  };
}