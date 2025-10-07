import { ISkuRepository } from '@/interfaces/sku.interface';
import { SKU } from '@/models/sku.model';
import * as errorResponse from '@/utils/error';
import slugify from 'slugify';
import { skuModel as db } from '@/db/models/mongodb';
import { deleteImage, uploadImage, uploadImages } from '@/utils';
import { UpdateImage } from '@/types';
import { omitDataSku } from '@/utils';
export class SkuRepository implements ISkuRepository {
  async create(data: typeof SKU.CreateInput): Promise<SKU> {
    //check product exist
    const checkExist = await db.findOne({
      sku_slug: slugify(data.sku_name, { lower: true }),
    });
    if (checkExist) throw new errorResponse.ValidationError('This sku name has already existed');
    console.log('data from create sku', data);
    //check image file and upload
    if (data.sku_image) {
      data.sku_image = await uploadImage(data?.sku_image, `sku`);
    }

    //create new
    const result = await db.create(data);
    if (!result) {
      if (data.sku_image) {
        deleteImage(data.sku_image.image_id as string);
      }
      throw new errorResponse.ValidationError('Server Error! Cannot create new product');
    }

    //save to slugify
    await result.save();

    //return as typeof SPU
    return omitDataSku(['_id', '__v', 'sku_spu'], result.toObject());
  }
  update(data: typeof SKU.UpdateInput): Promise<SKU> {
    throw new Error('Method not implemented.');
  }
  updateImage(data: UpdateImage): Promise<SKU> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<SKU> {
    const sku = await db.findOneAndDelete({ sku_id: id });
    if (!sku) throw new errorResponse.ValidationError('Cannot delete this sku for some reason');
    deleteImage(sku.sku_image.image_id as string);
    return omitDataSku(['_id', '__v'], sku.toObject());
  }
  find(limit: number, offset: number): Promise<SKU[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string): Promise<SKU> {
    throw new Error('Method not implemented.');
  }
  getSkuStock(ids: string[]): Promise<SKU[]> {
    throw new Error('Method not implemented.');
  }
  async deleteAll(): Promise<any> {
    const spus = await db.find();
    for (let i of spus) {
      if (i.sku_image) {
        deleteImage(i.sku_image.image_id as string);
      }
    }
    const deleteA = await db.deleteMany();
    console.log('delete all', deleteA);
    return deleteA;
  }
}
