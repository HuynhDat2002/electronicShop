import * as rule from 'class-validator';
import { Type } from 'class-transformer';

class VariantOptionDto {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "Option value không được để trống" })
  option_value: string;

  @rule.IsString()
  @rule.IsNotEmpty({ message: "Option label không được để trống" })
  option_label: string;
}

class VariantItemDto {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "Variant name không được để trống" })
  @rule.Matches(/^([A-Za-z0-9]*)(\s[A-Za-z0-9]*)*$/g, {
    message: "Tên phải hợp lệ (chỉ chữ cái tiếng Anh), không chứa ký tự đặc biệt",
  })
  variant_name: string;

  @rule.IsArray()
  @rule.ArrayMinSize(1, { message: "Phải có ít nhất một option" })
  @rule.ValidateNested({ each: true })
  @Type(() => VariantOptionDto)
  variant_options: VariantOptionDto[];

  @rule.IsOptional()
  @rule.IsNumber()
  variant_position?: number;
}

// Create variant document for a SPU
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "SPU ID không được để trống" })
  variant_spu_id: string;

  @rule.IsArray()
  @rule.ArrayMinSize(1, { message: "Phải có ít nhất một variant type (Color, Storage...)" })
  @rule.ValidateNested({ each: true })
  @Type(() => VariantItemDto)
  variant_list: VariantItemDto[];

  @rule.IsOptional()
  @rule.IsIn(["active", "inactive"])
  variant_status?: "active" | "inactive";
}

// Add a new variant type to existing variant document
export class AddVariantItemRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "SPU ID không được để trống" })
  variant_spu_id: string;

  @rule.ValidateNested()
  @Type(() => VariantItemDto)
  variant_item: VariantItemDto;
}

// Update a variant type in existing variant document
export class UpdateVariantItemRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "SPU ID không được để trống" })
  variant_spu_id: string;

  @rule.IsString()
  @rule.IsNotEmpty({ message: "Variant name không được để trống" })
  variant_name: string;

  @rule.IsOptional()
  @rule.IsArray()
  @rule.ValidateNested({ each: true })
  @Type(() => VariantOptionDto)
  variant_options?: VariantOptionDto[];

  @rule.IsOptional()
  @rule.IsNumber()
  variant_position?: number;
}

// Remove a variant type from variant document
export class RemoveVariantItemRequest {
  @rule.IsString()
  @rule.IsNotEmpty({ message: "SPU ID không được để trống" })
  variant_spu_id: string;

  @rule.IsString()
  @rule.IsNotEmpty({ message: "Variant name không được để trống" })
  variant_name: string;
}

// Update whole variant document
export class UpdateRequest {
  @rule.IsOptional()
  @rule.IsArray()
  @rule.ValidateNested({ each: true })
  @Type(() => VariantItemDto)
  variant_list?: VariantItemDto[];

  @rule.IsOptional()
  @rule.IsIn(["active", "inactive"])
  variant_status?: "active" | "inactive";
}