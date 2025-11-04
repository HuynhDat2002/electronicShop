import { Types } from "mongoose";

export type AttributeType = {
  _id: Types.ObjectId;
  attribute_value_id: string;
  attribute_name: string;
  attribute_value: string;
  attribute_label: string;
};