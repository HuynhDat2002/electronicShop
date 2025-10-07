import { CatalogProduct } from '@/dto/payload.dto';
import { EventPayload } from '@/utils/AppEventListener';
import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';
import { SpuElasticSearch } from './spu.elasticsearch';
import { SPU } from '@/models/spu.model';
import { errorResponse } from '@/utils';
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
        await this.spuElasticSearch.create(data as SPU);
        console.log('createProduct event received elasticsearch');
        break;
      case 'updateSpu':
        await this.spuElasticSearch.update(data as SPU);
        console.log('updateProduct event received elasticsearch');
        break;
      case 'deleteSpu':
        await this.spuElasticSearch.delete((data as CatalogProduct).id.toString());
        console.log('deleteProduct event received elasticsearch');
        break;
      case 'deleteIndex':
        await this.deleteIndex();
        console.log('deleteIndex event received elasticsearch');
        break;
    }
  }
  async createIndexSpu() {
    const indexExists = await this.client.indices.exists({ index: this.indexSpu });
    if (!indexExists) {
      console.log('Index spu does not exist, creating index:', this.indexSpu);
      const result = await this.client.indices.create({
        index: this.indexSpu,
        body: {
          mappings: {
            properties: {
              spu_id: { type: 'keyword' }, // tìm exact match
              spu_name: { type: 'text' }, // full-text search
              spu_slug: { type: 'keyword' }, // unique, query nhanh
              spu_description: { type: 'text' }, // search mô tả
              spu_status: { type: 'keyword' }, // enum
              spu_image: {
                type: 'nested',
                properties: {
                  image_id: { type: 'keyword' },
                  image_url: { type: 'text' },
                  image_name: { type: 'text' },
                },
              },
              spu_thumb: {
                type: 'object',
                properties: {
                  image_id: { type: 'keyword' },
                  image_name: { type: 'text' },
                  image_url: { type: 'keyword' },
                },
              },
              spu_ratingAverage: { type: 'float' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      if (result) console.log('create index successfully');
    } else {
      console.log('Index spu already exists:', this.indexSpu);
    }
  }

  async deleteIndex() {
    try {
      const deleteIndex = await this.client.indices.delete({ index: this.indexSpu });
      if (deleteIndex) {
        console.log('Delete index spu successfully');
      }
    } catch (error) {
      console.log('Delete index error');
    }
  }
  async search(data: { search: string; limit: number | 20; page: number | 1; sort?: any }) {
    try {
      const offset = (data.page - 1) * data.limit;
      const result = await this.client.search({
        index: 'spu',
        query:
          data.search.length === 0
            ? {
                match_all: {},
              }
            : {
                multi_match: {
                  query: data.search,
                  fields: [
                    `spu_name`,
                    `spu_slug`,
                    `spu_description`,
                  ],
                  fuzziness: 'AUTO',
                },
              },
        sort: [
          {
            createdAt: {
              order: 'desc',
            },
          },
        ],
        size: data.limit,
        from: offset,
      });
      console.log('search result from elasticsearch', result.hits.hits);
      return result.hits.hits.map((hit) => hit._source) as SPU[];
    } catch (error) {
      throw new errorResponse.NotFound(`Not found spu`);
    }
  }

  async getSpuById(id: string, indexName = 'spu'): Promise<any> {
    try {
      const result = await this.client.get({
        index: indexName,
        id: id,
      });
      return result;
    } catch (error) {
      throw new errorResponse.NotFound('Cannot find by this id');
    }
  }
}
