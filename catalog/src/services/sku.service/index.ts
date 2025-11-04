import { ISkuRepository } from '@/interfaces/sku.interface';
import { classToPlain } from 'class-transformer';
import { errorResponse } from '@/utils';
import { SKU } from '@/models/sku.model';
import { NotFound, AuthorizeError, ValidationError } from '@/utils';
import { OrderWithLineItems } from '@/types/message.type';
import { AppEventListener } from '@/utils/AppEventListener';
import { ElasticSearchService } from '@/services/elasticsearch.service';
import { MessageType } from '@/types';
const elkSearch = new ElasticSearchService();
export class SkuService {
  private _repository: ISkuRepository;
  constructor(repository: ISkuRepository) {
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
  async create(input: typeof SKU.CreateInput) {
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError('Cannot create new sku');
    return data;
  }

  async update(
    input: {
      id: string;
    } & typeof SKU.UpdateInput
  ) {
    const data = await this._repository.update(input);
    //emit event to update record in ElasticSearch
    if (!data.sku_id) {
      throw new Error('unable to update product');
    }

    //notify to elasticsearch to update record
    AppEventListener.instance.notify({
      event: 'updateSpu',
      data: data,
    });
    return data;
  }

  //we will get product from ElasticSearch
  // async getSkus(data:{limit: number, page: number, search: string,sort?:any}): Promise<SKU[]> {
  //   const skus:SKU[] = await elkSearch.search({limit:data.limit,page:data.page,search:data.search,sort:data.sort});
  //   console.log('products got from elasticsearch', skus);
  //   return skus as SKU[];
  // }

  async getSkuById(id: string) {
    const sku = await elkSearch.getSpuById(id) as SKU;
    console.log('get a sku from elasticsearch', sku);
    return sku;
  }

  async deleteSku(id: string) {
    const product = await this._repository.delete(id);

    // delete record from ElasticSearch
    // AppEventListener.instance.notify({
    //   event: 'deleteProduct',
    //   data: { id },
    // });
    return product;
  }
  async getSkuStock(ids: string[]) {
    const products = await this._repository.getSkuStock(ids);
    if (!products) {
      throw new NotFound('Products not found');
    }
    return products;
  }

  
}
