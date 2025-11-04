import { Types } from 'mongoose';

export type VariantType = {
  sku_variant_id: Types.ObjectId;
  sku_variant_slug: string;
  sku_variant_option_value: string;
  sku_variant_option_label?: string;
};
