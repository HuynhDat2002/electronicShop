import { CatalogProduct } from '@/dto';
import { SPU } from '@/models/spu.model';
import { Client } from '@elastic/elasticsearch';
import { errorResponse } from '@/utils';
export class SpuElasticSearch {
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
      throw new errorResponse.NotFound('Not found spu');
    }
  }

  async create(data: SPU) {
    try {
      const result = await this.client.index({
        index: this.indexName,
        id: data.spu_id.toString(),
        document: data,
      });
      console.log('spu created in elasticsearch', result);
    } catch (error) {
      console.log('spu create error', error);
    }
  }

  async update(data: SPU) {
    try {
      const exists = await this.client.exists({
        index: this.indexName,
        id: data.spu_id.toString(),
      });
      if (exists) {
        const result = await this.client.index({
          index: this.indexName,
          id: data.spu_id.toString(),
          document: data,
        });
        console.log('spu updated in elasticsearch', result);
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
