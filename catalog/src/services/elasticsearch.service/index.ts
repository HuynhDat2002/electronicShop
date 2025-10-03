import { CatalogProduct } from '@/dto/payload.dto';
import { EventPayload } from '@/utils/AppEventListener';
import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';
import { SpuElasticSearch } from './spu.elasticsearch';
console.log('elastic-url', process.env.ELASTICSEARCH_URL);
export class ElasticSearchService {
  private indexSpu = 'spu';
  private client: Client;
  private spuElasticSearch: SpuElasticSearch;
  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      maxRetries: 10,
      requestTimeout: 10000,
    });
    this.createIndexSpu();
    this.spuElasticSearch = new SpuElasticSearch(this.client, this.indexSpu);
  }

  async handleEvents({ event, data }: EventPayload) {
    switch (event) {
      case 'createSpu':
        await this.spuElasticSearch.create(data as CatalogProduct);
        console.log('createProduct event received elasticsearch');
        break;
      case 'updateSpu':
        await this.spuElasticSearch.update(data as CatalogProduct);
        console.log('updateProduct event received elasticsearch');
        break;
      case 'deleteSpu':
        await this.spuElasticSearch.delete((data as CatalogProduct).id.toString());
        console.log('deleteProduct event received elasticsearch');
        break;
    }
  }
  async createIndexSpu() {
    const indexExists = await this.client.indices.exists({ index: this.indexSpu });
    if (!indexExists) {
      console.log('Index does not exist, creating index:', this.indexSpu);
      const result = await this.client.indices.create({
        index: this.indexSpu,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              stock: { type: 'integer' },
            },
          },
        },
      });
      if (result) console.log('create index successfully');
    } else {
      console.log('Index already exists:', this.indexSpu);
    }
  }
}
