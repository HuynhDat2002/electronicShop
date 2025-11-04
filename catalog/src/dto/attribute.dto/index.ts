import * as rule from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho attribute option (value + label)
export class AttributeOptionDTO {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Giá trị không được để trống',
  })
  value: string;

  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Nhãn hiển thị không được để trống',
  })
  label: string;
}

// DTO tạo mới Attribute Template
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Tên thuộc tính không được để trống',
  })
  @rule.Matches(/^([A-ZÀ-ỸZxa-zà-ỹ0-9]*)(\s[A-ZÀ-ỸZxa-zà-ỹ0-9]*)*$/g, {
    message: 'Tên phải theo định dạng hợp lệ (không ký tự đặc biệt)',
  })
  attribute_name: string;

  @rule.IsOptional()
  attribute_option?: AttributeOptionDTO;

  @rule.IsOptional()
  @rule.IsString()
  @rule.IsIn(['active', 'inactive'])
  attribute_status?: 'active' | 'inactive';
}

// DTO cập nhật Attribute Template
export class UpdateRequest {
  @rule.IsOptional()
  @rule.IsString()
  @rule.Matches(/^([A-Za-zÀ-ỹ0-9]*)(\s[A-Za-zÀ-ỹ0-9]*)*$/g)
  attribute_name?: string;

  @rule.IsOptional()
  @rule.IsArray()
  @rule.ValidateNested({ each: true })
  attribute_options?: AttributeOptionDTO[];

  @rule.IsOptional()
  @rule.IsIn(['active', 'inactive'])
  attribute_status?: 'active' | 'inactive';
}

// DTO thêm option mới vào attribute
export class AddOptionRequest {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Giá trị không được để trống',
  })
  value: string;

  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Nhãn hiển thị không được để trống',
  })
  label: string;
}

// DTO xóa option khỏi attribute
export class RemoveOptionRequest {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Giá trị không được để trống',
  })
  value: string;
}