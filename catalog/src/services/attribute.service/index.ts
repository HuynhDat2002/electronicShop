import { IAttributeRepository } from '@/interfaces/attribute.interface';
import { ATTRIBUTE } from '@/models/attribute.model';
import { ElasticSearchService } from '@/services/elasticsearch.service';
import { errorResponse } from '@/utils';
import { AppEventListener } from '@/utils/AppEventListener';

const elkSearch = new ElasticSearchService();

export class AttributeService {
  private _repository: IAttributeRepository;

  constructor(repository: IAttributeRepository) {
    this._repository = repository;
  }

  /** ===================== CREATE ===================== */
  async create(input: typeof ATTRIBUTE.CreateInput) {
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError('Cannot create new attribute');

    // AppEventListener.instance.notify({
    //   event: 'createAttribute',
    //   data,
    // });

    return data;
  }

  /** ===================== UPDATE ===================== */
  async update(
    input: {
      id: string;
    } & typeof ATTRIBUTE.UpdateInput
  ) {
    const data = await this._repository.update(input);
    if (!data?.attribute_id) {
      throw new errorResponse.ValidationError('Unable to update attribute');
    }

    // AppEventListener.instance.notify({
    //   event: 'updateAttribute',
    //   data,
    // });

    return data;
  }

  /** ===================== FIND ALL ===================== */
  async find(limit: number, offset: number): Promise<ATTRIBUTE[]> {
    const data = await this._repository.find(limit, offset);
    if (!data) throw new errorResponse.NotFound('No attributes found');
    return data;
  }

  /** ===================== FIND ONE ===================== */
  async findOne(id: string): Promise<ATTRIBUTE> {
    const data = await this._repository.findOne(id);
    if (!data) throw new errorResponse.NotFound('Attribute not found');
    return data;
  }

  /** ===================== DELETE ONE ===================== */
  async delete(id: string) {
    const data = await this._repository.delete(id);
    if (!data) throw new errorResponse.ValidationError('Cannot delete attribute');

    // AppEventListener.instance.notify({
    //   event: 'deleteAttribute',
    //   data: { id },
    // });

    return data;
  }

  /** ===================== DELETE ALL ===================== */
  async deleteAll() {
    const data = await this._repository.deleteAll();
    if (!data) throw new errorResponse.ValidationError('Cannot delete all attributes');

    // AppEventListener.instance.notify({
    //   event: 'deleteAttributeIndex',
    // });

    return data;
  }

  /** ===================== GET BY ID FROM ELK (optional) ===================== */
  async getAttributeById(id: string) {
    const attribute = (await elkSearch.getSpuById(id)) as ATTRIBUTE;
    if (!attribute) throw new errorResponse.NotFound('Attribute not found in Elasticsearch');
    return attribute;
  }
}