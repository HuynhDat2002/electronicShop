import * as rule from 'class-validator';
import * as myType from '@/types';
import { AttributeType } from '@/types';

class Attribute {
  @rule.IsOptional()
  @rule.IsString()
  _id?: string;

  @rule.IsString()
  attribute_value_id: string;

  @rule.IsString()
  attribute_name: string;

  @rule.IsString()
  attribute_value: string;

  @rule.IsString()
  attribute_label: string;
}
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Tên không được để trống',
  })
  @rule.Matches(/^([A-ZÀ-ỸZxa-zà-ỹ0-9]*)(\s[A-ZÀ-ỸZxa-zà-ỹ0-9]*)*$/g, {
    message: 'Tên phải theo định dạng: Nguyen Van A or Nguyễn Văn A',
  })
  spu_name: string;

  @rule.IsOptional()
  spu_image: {
    image_name: string;
    image_url: string;
  }[];

  @rule.IsOptional()
  spu_thumb: {
    image_name: string;
    image_url: string;
  };
  @rule.IsOptional()
  @rule.IsString()
  spu_description: string;

  @rule.IsOptional()
  spu_status: myType.SPU_Status;

  @rule.IsOptional()
  spu_attributes:AttributeType[]
}

export class UpdateRequest {
  @rule.IsString()
  @rule.Matches(/^([A-ZÀ-ỸZxa-zà-ỹ0-9]*)(\s[A-ZÀ-ỸZxa-zà-ỹ0-9]*)*$/g, {
    message: 'Tên phải theo định dạng: Nguyen Van A or Nguyễn Văn A',
  })
  @rule.IsOptional()
  spu_name?: string;

  @rule.IsOptional()
  @rule.IsString()
  spu_description: string;

  @rule.IsOptional()
  @rule.IsString()
  @rule.IsIn(myType.SPU_STATUS_CONSTANTS, {
    message: `Status must be one of: ${myType.SPU_STATUS_CONSTANTS.join(', ')}`,
  })
  @rule.IsOptional()
  spu_status: myType.SPU_Status;

  @rule.IsOptional()
  spu_thumb: {
    image_name: string;
    image_url: string;
  };

  @rule.IsOptional()
  @rule.IsNumber()
  @rule.Min(1, { message: 'Rating phải là số từ 1 đến 5' })
  @rule.Max(5, { message: 'Rating phải là số từ 1 đến 5' })
  spu_ratingAverage: number;
}

export class UpdateImageRequest {
  @rule.IsOptional()
  spu_image: [
    {
      image_name: string;
      image_url: string;
    },
  ];
}
