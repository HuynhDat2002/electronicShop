import * as rule from 'class-validator';
import * as skuType from '@/types/sku.type';
export class CreateRequest {
  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Tên không được để trống',
  })
  @rule.Matches(/^([A-ZÀ-ỸZxa-zà-ỹ0-9]*)(\s[A-ZÀ-ỸZxa-zà-ỹ0-9]*)*$/g, {
    message: 'Tên phải theo định dạng: Nguyen Van A or Nguyễn Văn A',
  })
  sku_name: string;

  @rule.IsString()
  @rule.IsNotEmpty({
    message: 'Spu Id không được để trống',
  })
  sku_spu_id: string;

  @rule.IsNotEmpty({
    message: 'Giá không được để trống',
  })
  sku_price: skuType.Price;

  @rule.IsOptional()
  sku_default: boolean;

  @rule.IsOptional()
  @rule.IsString()
  sku_status: skuType.SKU_Status;

  @rule.IsOptional()
  sku_image:{
    image_url:string,
    image_name:string
  }
}
