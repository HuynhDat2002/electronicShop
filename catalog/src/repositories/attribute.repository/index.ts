import { IAttributeRepository } from '@/interfaces/attribute.interface';
import { ATTRIBUTE } from '@/models/attribute.model';
import * as errorResponse from '@/utils/error';
import slugify from 'slugify';
import { attributeModel as db } from '@/db/models/mongodb';
import { omitData } from '@/utils';

export class AttributeRepository implements IAttributeRepository {
  async create(data: typeof ATTRIBUTE.CreateInput): Promise<ATTRIBUTE> {
    // check attribute name
    const option={
      value:slugify(data.attribute_option.value as string ,{lower:true}),
      label:data.attribute_option.label as string
    }
    const attrs = await db.findOne({
      attribute_slug: slugify(data.attribute_name, { lower: true }),
    });
    if (!attrs) {
      const result = await db.create({
        attribute_name: data.attribute_name,
        attribute_options: [option],
      });
      if (!result) throw new errorResponse.ValidationError('Cannot create new attribute');
      await result.save();
      return omitData<ATTRIBUTE>(['_id', '__v', 'attribute_spu'], result.toObject());
    }
    if(attrs.attribute_options?.find(o=>o.value===option.value)){
      throw new errorResponse.ValidationError('this value of attribute has already existed'); 
    }
    const updateAttribute = await db.findOneAndUpdate(
      {
        attribute_slug: slugify(data.attribute_name, { lower: true }),
      },
      {
        $addToSet: {
          attribute_options: option,
        },
      },
      {
        new: true,
      }
    );
    if (!updateAttribute) throw new errorResponse.ValidationError('Cannot create new attribute');

    await updateAttribute.save();

    return omitData<ATTRIBUTE>(['_id', '__v', 'attribute_spu'], updateAttribute.toObject());
  }

  update(data: typeof ATTRIBUTE.UpdateInput): Promise<ATTRIBUTE> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<ATTRIBUTE> {
    const attribute = await db.findOneAndDelete({ attribute_id: id });
    if (!attribute)
      throw new errorResponse.ValidationError('Cannot delete this attribute for some reason');
    return omitData<ATTRIBUTE>(['_id', '__v'], attribute.toObject());
  }

  find(limit: number, offset: number): Promise<ATTRIBUTE[]> {
    throw new Error('Method not implemented.');
  }

  findOne(id: string): Promise<ATTRIBUTE> {
    throw new Error('Method not implemented.');
  }

  async deleteAll(): Promise<any> {
    const deleted = await db.deleteMany();
    console.log('Deleted all attributes', deleted);
    return deleted;
  }
}
