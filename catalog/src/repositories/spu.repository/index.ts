import { ISpuRepository } from '@/interfaces/spu.interface';
import { SPU } from '@/models/spu.model';
import * as errorResponse from '@/utils/error';
import slugify from 'slugify';
import { mongodb as db } from '@/db';
import { deleteImage, uploadImage, uploadImages } from '@/utils';
import { AttributeType, UpdateImage } from '@/types';
import { omitData } from '@/utils';

async function validateAttribute(attrs: AttributeType[]) : Promise<AttributeType[]>{
  const newAttrs =await Promise.all(
    attrs.map(async (attr) => {
     const found = await db.attributeModel.findOne({
       attribute_slug: slugify(attr.attribute_name, { lower: true }),
       attribute_options: {
         $elemMatch: {
           id: attr.attribute_value_id,
           value: attr.attribute_value,
         },
       },
       attribute_status: 'active',
     });
     if (!found) {
       throw new errorResponse.ValidationError(
         `Attribute ${attr.attribute_name} with value ${attr.attribute_value} does not exists`
       );
     }
     return {
         ...attr,
         _id: found._id,
       }
   }) 
  )
  return newAttrs;
}
export class SpuRepository implements ISpuRepository {
  async deleteAll() {
    const spus = await db.spuModel.find();
    for (let i of spus) {
      if (i.spu_image) {
        for (let j of i.spu_image) {
          deleteImage(j.image_id as string);
        }
      }
      if (i.spu_thumb) {
        deleteImage(i.spu_thumb.image_id as string);
      }
    }

    const skus = await db.skuModel.find();
    for (let i of skus) {
      if (i.sku_image) {
        deleteImage(i.sku_image.image_id as string);
      }
    }
    const deleteA = await db.spuModel.deleteMany();
    await db.skuModel.deleteMany();
    await db.inventoryModel.deleteMany();
    await db.reservationModel.deleteMany();
    await db.attributeModel.deleteMany();
    await db.variantModel.deleteMany();
    console.log('delete all', deleteA);
    return deleteA;
  }
  async create(data: typeof SPU.CreateInput): Promise<SPU> {
    //check product exist
    const checkExist = await db.spuModel.findOne({
      spu_slug: slugify(data.spu_name, { lower: true }),
    });

    if (checkExist)
      throw new errorResponse.ValidationError('This product name has already existed');
    console.log('data from create', data);
    //check image file and upload
    if (data.spu_image) {
      data.spu_image = await uploadImages(data?.spu_image, `spu`);
    }
    if (data.spu_thumb) {
      data.spu_thumb = await uploadImage(data?.spu_thumb, `spu`);
    }
    if (data.spu_attributes) {
      data.spu_attributes=await validateAttribute(data.spu_attributes)
    }

    //create new
    const result = new db.spuModel(data);
    if (!result) {
      if (data.spu_image) {
        for (let i of data.spu_image) {
          deleteImage(i.image_id as string);
        }
      }
      if (data.spu_thumb) {
        deleteImage(data.spu_thumb.image_id as string);
      }
      throw new errorResponse.ValidationError('Server Error! Cannot create new product');
    }

    //save to slugify
    await result.save();

    //return as typeof SPU
    return omitData<SPU>(['_id', '__v'], result.toObject());
  }
  async update(
    data: {
      id: string;
    } & typeof SPU.UpdateInput
  ): Promise<SPU> {
    //update
    const { id, ...rest } = data;
    if (rest.spu_thumb) {
      console.log('thumb from update', rest.spu_thumb);
      const found = await db.spuModel.findOne({ spu_id: id });
      if (!found) throw new errorResponse.ValidationError('Cannot find product by this id');
      rest.spu_thumb = await uploadImage(rest.spu_thumb, `spu`);
      console.log('rest thumb', rest.spu_thumb);

      deleteImage(found.spu_thumb.image_id as string);
    }

    const resp = await db.spuModel.findOneAndUpdate(
      {
        spu_id: id,
      },
      {
        $set: rest,
      },
      {
        new: true,
      }
    );
    if (!resp) throw new errorResponse.ValidationError('Server Error! Cannot update product');

    const result = omitData<SPU>(['_id', '__v'], resp.toObject());
    return result;
  }

  async updateImage(data: UpdateImage): Promise<SPU> {
    throw new Error('Method not implemented.');
  }
  async addImage() {}
  async delete(id: string): Promise<SPU> {
    const spu = await db.spuModel.findOneAndDelete({ spu_id: id });
    if (!spu) throw new errorResponse.ValidationError('Cannot delete this product for some reason');
    for (let i of spu.spu_image) {
      deleteImage(i.image_id as string);
    }
    deleteImage(spu.spu_thumb.image_id as string);
    return omitData<SPU>(['_id', '__v'], spu.toObject());
  }
  find(limit: number, offset: number): Promise<SPU[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string): Promise<SPU> {
    throw new Error('Method not implemented.');
  }
  getSpuStock(ids: string[]): Promise<SPU[]> {
    throw new Error('Method not implemented.');
  }
}
