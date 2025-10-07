import { ISpuRepository } from '@/interfaces/spu.interface';
import { SPU } from '@/models/spu.model';
import * as errorResponse from '@/utils/error';
import slugify from 'slugify';
import { mongodb as db } from '@/db';
import { deleteImage, uploadImage, uploadImages } from '@/utils';
import { UpdateImage } from '@/types';
import { omitDataSpu } from '@/utils';
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
    const deleteA = await db.spuModel.deleteMany();
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
    return omitDataSpu(['_id', '__v'], result.toObject());
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

    const result = omitDataSpu(['_id', '__v'], resp.toObject());
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
    return omitDataSpu(['_id', '__v'], spu.toObject());
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
