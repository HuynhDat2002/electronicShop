import { IVariantRepository } from '@/interfaces/variant.interface';
import { VARIANT } from '@/models/variant.model';
import * as errorResponse from '@/utils/error';
import slugify from 'slugify';
import { variantModel as db } from '@/db/models/mongodb';
import { omitData } from '@/utils';
export class VariantRepository implements IVariantRepository {
  async create(data: typeof VARIANT.CreateInput): Promise<VARIANT> {
    // Check if variant for this SPU already exists
    const checkExist = await db.findOne({
      variant_spu_id: data.variant_spu_id,
    });
    if (checkExist)
      throw new errorResponse.ValidationError('Variant document for this SPU already exists');

    console.log('data from create variant', data);

    // Create new variant document
    const result = await db.create(data);
    await result.save();

    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], result.toObject());
  }

  async update(data: typeof VARIANT.UpdateInput): Promise<VARIANT> {
    const { id, ...updateData } = data;

    const variant = await db.findOneAndUpdate(
      { variant_id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!variant)
      throw new errorResponse.NotFound('Variant not found');

    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant.toObject());
  }

  async delete(id: string): Promise<VARIANT> {
    const variant = await db.findOneAndDelete({ variant_id: id });
    if (!variant)
      throw new errorResponse.ValidationError('Cannot delete this variant for some reason');
    return omitData<VARIANT>(['_id', '__v'], variant.toObject());
  }

  async find(limit: number, offset: number): Promise<VARIANT[]> {
    const variants = await db.find()
      .skip(offset)
      .limit(limit)
      .lean();

    return variants.map(v => omitData<VARIANT>(['_id', '__v', 'variant_spu'], v));
  }

  async findOne(id: string): Promise<VARIANT> {
    const variant = await db.findOne({ variant_id: id }).lean();
    if (!variant)
      throw new errorResponse.NotFound('Variant not found');

    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant);
  }

  async findBySpuId(spu_id: string): Promise<VARIANT | null> {
    const variant = await db.findOne({ variant_spu_id: spu_id }).lean();
    if (!variant) return null;

    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant);
  }

  async deleteAll(): Promise<any> {
    const deleteA = await db.deleteMany();
    console.log('delete all', deleteA);
    return deleteA;
  }

  // Add a new variant item (e.g., add "Storage" to existing variant document)
  async addVariantItem(data: typeof VARIANT.AddVariantItemInput): Promise<VARIANT> {
    const { variant_spu_id, variant_name, variant_options, variant_position } = data;

    const variant = await db.findOne({ variant_spu_id });
    if (!variant)
      throw new errorResponse.NotFound('Variant document not found for this SPU');

    // Check if variant_name already exists
    const exists = variant.variant_list.some((v: any) => v.variant_name === variant_name);
    if (exists)
      throw new errorResponse.ValidationError(`Variant "${variant_name}" already exists`);

    // Add new variant item
    const variantSlug = slugify(variant_name, { lower: true });
    variant.variant_list.push({
      variant_name,
      variant_slug: variantSlug,
      variant_options,
      variant_position: variant_position ?? variant.variant_list.length,
    });

    await variant.save();
    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant.toObject());
  }

  // Update an existing variant item
  async updateVariantItem(data: typeof VARIANT.UpdateVariantItemInput): Promise<VARIANT> {
    const { variant_spu_id, variant_name, variant_options, variant_position } = data;

    const variant = await db.findOne({ variant_spu_id });
    if (!variant)
      throw new errorResponse.NotFound('Variant document not found for this SPU');

    const variantItem = variant.variant_list.find((v: any) => v.variant_name === variant_name);
    if (!variantItem)
      throw new errorResponse.NotFound(`Variant "${variant_name}" not found`);

    // Update fields
    // if (variant_options) variantItem.variant_options = variant_options;
    if (variant_position !== undefined) variantItem.variant_position = variant_position;

    await variant.save();
    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant.toObject());
  }

  // Remove a variant item
  async removeVariantItem(data: typeof VARIANT.RemoveVariantItemInput): Promise<VARIANT> {
    const { variant_spu_id, variant_name } = data;

    const variant = await db.findOne({ variant_spu_id });
    if (!variant)
      throw new errorResponse.NotFound('Variant document not found for this SPU');

    const index = variant.variant_list.findIndex((v: any) => v.variant_name === variant_name);
    if (index === -1)
      throw new errorResponse.NotFound(`Variant "${variant_name}" not found`);

    variant.variant_list.splice(index, 1);
    await variant.save();

    return omitData<VARIANT>(['_id', '__v', 'variant_spu'], variant.toObject());
  }
}
