import { CatalogProduct } from '@/dto';
import { SKU } from '@/models/sku.model';
import { Client } from '@elastic/elasticsearch';
import { errorResponse } from '@/utils';
export class SkuElasticSearch {
  private client: Client;
  private indexName: string;
  constructor(client: Client, indexName: string) {
    ((this.client = client), (this.indexName = indexName));
  }
  async get(id: string) {
    try {
      const result = await this.client.get({
        index: this.indexName,
        id: id.toString(),
      });

      return result._source;
    } catch (error) {
      throw new errorResponse.NotFound('Not found sku');
    }
  }

  async create(data: SKU) {
    try {
      const result = await this.client.index({
        index: this.indexName,
        id: data.sku_id.toString(),
        document: data,
      });
      console.log('sku created in elasticsearch', result);
    } catch (error) {
      console.log('sku create error', error);
    }
  }

  async update(data: SKU) {
    try {
      const exists = await this.client.exists({
        index: this.indexName,
        id: data.sku_id.toString(),
      });
      if (exists) {
        const result = await this.client.index({
          index: this.indexName,
          id: data.sku_id.toString(),
          document: data,
        });
        console.log('sku updated in elasticsearch', result);
      }
    } catch (error) {
      console.log('product update in elasticsearch error');
    }
  }

  async delete(id: string) {
    try {
      const result = await this.client.delete({
        index: this.indexName,
        id: id.toString(),
      });
      console.log('product deleted in elasticsearch', result);
    } catch (err) {
      console.log('error delete elasticsearch', err);
    }
  }

}
