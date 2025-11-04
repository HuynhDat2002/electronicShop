import { IVariantRepository } from '@/interfaces/variant.interface';
import { VARIANT } from '@/models/variant.model';
import { errorResponse } from '@/utils';
import { AppEventListener } from '@/utils/AppEventListener';

export class VariantService {
  private _repository: IVariantRepository;

  constructor(repository: IVariantRepository) {
    this._repository = repository;
  }

  async deleteAll() {
    const data = await this._repository.deleteAll();
    if (!data) throw new errorResponse.ValidationError('Cannot delete all');
    AppEventListener.instance.notify({
      event: 'deleteIndex',
    });
    return data;
  }

  async create(input: typeof VARIANT.CreateInput) {
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError('Cannot create new variant');

    AppEventListener.instance.notify({
      event: 'createVariant',
      data: data,
    });
    return data;
  }

  async update(input: { id: string } & typeof VARIANT.UpdateInput) {
    const data = await this._repository.update(input);

    if (!data.variant_id) {
      throw new Error('Unable to update variant');
    }

    AppEventListener.instance.notify({
      event: 'updateVariant',
      data: data,
    });
    return data;
  }

  async getVariantById(id: string) {
    const variant = await this._repository.findOne(id);
    return variant;
  }

  async getVariantBySpuId(spu_id: string) {
    const variant = await this._repository.findBySpuId(spu_id);
    if (!variant) throw new errorResponse.NotFound('Variant not found for this SPU');
    return variant;
  }

  async deleteVariant(id: string) {
    const variant = await this._repository.delete(id);

    AppEventListener.instance.notify({
      event: 'deleteVariant',
      data: { id },
    });
    return variant;
  }

  // New methods for managing variant items
  async addVariantItem(input: typeof VARIANT.AddVariantItemInput) {
    const data = await this._repository.addVariantItem(input);

    AppEventListener.instance.notify({
      event: 'updateVariant',
      data: data,
    });
    return data;
  }

  async updateVariantItem(input: typeof VARIANT.UpdateVariantItemInput) {
    const data = await this._repository.updateVariantItem(input);

    AppEventListener.instance.notify({
      event: 'updateVariant',
      data: data,
    });
    return data;
  }

  async removeVariantItem(input: typeof VARIANT.RemoveVariantItemInput) {
    const data = await this._repository.removeVariantItem(input);

    AppEventListener.instance.notify({
      event: 'updateVariant',
      data: data,
    });
    return data;
  }
}
