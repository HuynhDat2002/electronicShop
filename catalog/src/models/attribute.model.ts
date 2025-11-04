import { Schema } from 'mongoose';

// Interface cho attribute option (value + label)
export interface IAttributeOption {
  id: string;
  value: string;
  label: string;
}

export class ATTRIBUTE {
  constructor(
    public readonly attribute_id: string,
    public readonly attribute_name: string,
    public readonly attribute_slug: string,
    public readonly attribute_status?: 'active' | 'inactive',
    public readonly attribute_options?: IAttributeOption[],
    public readonly _id?: Schema.Types.ObjectId,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static CreateInput: Omit<
    ATTRIBUTE,
    'attribute_id' | 'attribute_slug' | 'createdAt' | 'updatedAt' | '_id' | 'attribute_options'
  > & {
    attribute_option: {
      id:string;
      value: string;
      label: string;
    };
  };
  static UpdateInput: Partial<
    Omit<ATTRIBUTE, 'attribute_id' | 'attribute_slug' | 'createdAt' | 'updatedAt' | '_id'>
  > & {
    id: string;
  };
}
