import { ISpuRepository } from '@/interfaces/spu.interface';
import { classToPlain } from 'class-transformer';
import { errorResponse } from '@/utils';
import { SPU } from '@/models/spu.model';
import { NotFound, AuthorizeError, ValidationError } from '@/utils';
import { OrderWithLineItems } from '@/types/message.type';
import { AppEventListener } from '@/utils/AppEventListener';
import { ElasticSearchService } from '@/services/elasticsearch.service';

export class SpuService {
  private _repository: ISpuRepository;
  constructor(repository: ISpuRepository) {
    this._repository = repository;
  }
  async create(input: typeof SPU.CreateInput) {   
    const data = await this._repository.create(input);
    if (!data) throw new errorResponse.ValidationError('Cannot create new spu');

    //notify to elasticsearch to create record
    AppEventListener.instance.notify({
      event: 'createSpu',
      data: data,
    });
    return data;
  }

  async update(
    input: {
      id: string;
    } &  typeof SPU.UpdateInput
  ) {
    const data = await this._repository.update(input);
    //emit event to update record in ElasticSearch
    if (!data.spu_id) {
      throw new Error('unable to update product');
    }

    // notify to elasticsearch to update record
    // AppEventListener.instance.notify({
    //   event: 'updateProduct',
    //   data: data,
    // });
    return data;
  }

  //we will get product from ElasticSearch
  async getSpus(limit: number, offset: number, search: string) :Promise<any>{
    const elkSearch = new ElasticSearchService();
    const products = await elkSearch.searchProduct(search);
    console.log('products got from elasticsearch', products);
    // const products = await this._repository.find(limit,offset)
    return products;
  }

  async getSpu(id: string) {
    const elkSearch = new ElasticSearchService();
    const products = await elkSearch.getProduct(id);
    console.log('products got from elasticsearch', products);
    // const products = await this._repository.find(limit,offset)
    return products;
  }

  async deleteSpu(id: string) {
    const product = await this._repository.delete(id);

   // delete record from ElasticSearch
    AppEventListener.instance.notify({
      event: 'deleteProduct',
      data: { id },
    });
    return product;
  }
  async getSpuStock(ids: string[]) {
    const products = await this._repository.getSpuStock(ids);
    if (!products) {
      throw new NotFound('Products not found');
    }
    return products;
  }

  async handleBrokerMessage(message: any) {
    console.log('Catalog Service Received Message,', message);
    const orderData = message.data as OrderWithLineItems;
    const { orderLineItems } = orderData;
    orderLineItems.forEach(async (item) => {
      console.log('item in orderlineitems', item);
      const product = await this.getSpu(item.productId.toString());
      //   if (product?.stock < item.qty) throw new ValidationError('Product is out of stock');
      //   const updateStock = product.stock - item.qty;
      //   await this.updateProduct({ ...product, stock: updateStock });
    });
  }
}
