import { CatalogProduct } from '@/dto/payload.dto';
import { EventPayload } from '@/utils/AppEventListener';
import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';
import { SpuElasticSearch } from './spu.elasticsearch';
import { SPU } from '@/models/spu.model';
import { errorResponse } from '@/utils';
import { VARIANT } from '@/models/variant.model';
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
      case 'createVariant':
        await this.spuElasticSearch.createVariant(data as VARIANT);
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

              spu_variants: {
                type: 'nested',
                properties: {
                  variation_id: { type: 'keyword' },
                  variation_slug: { type: 'text' },
                  variation_options: {
                    type: 'nested',
                    properties: {
                      option_value: { type: 'text' }, //"red", "256gb",
                      option_label: { type: 'text' }, // "đỏ", "256gb"
                      option_code: { type: 'text' },
                    },
                  },
                  variation_status: { type: 'text' },
                },
              },
              spu_skus: {
                type: 'nested',
                properties: {
                  sku_id: { type: 'keyword' },
                  sku_name: { type: 'text' },
                  sku_slug: { type: 'text' },
                  sku_price: {
                    type: 'object',
                    properties: {
                      original: { type: 'float' },
                      sale: { type: 'float' },
                      cost: { type: 'float' },
                      currency: { type: 'text' },
                    },
                  },
                  sku_default: { type: 'boolean' },
                  sku_image: {
                    type: 'object',
                    properties: {
                      image_id: { type: 'keyword' },
                      image_name: { type: 'text' },
                      image_url: { type: 'text' },
                    },
                  },
                  sku_inventories: {
                    type: 'nested',
                    properties: {
                      inven_stock: { type: 'integer' }, //"red", "256gb",
                      inven_location: { type: 'text' }, // "đỏ", "256gb"
                    },
                  },
                },
              },
              spu_attributes: {
                type: 'nested',
                properties: {
                  attribute_id: { type: 'keyword' },
                  attribute_name: { type: 'text' },
                  attribute_slug: { type: 'text' },
                  attribute_value: { type: 'text' },
                },
              },
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
                  fields: [`spu_name`, `spu_slug`, `spu_description`],
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

// {
//   "settings": {
//     "number_of_shards": 3,  // Nhiều SKUs hơn SPUs
//     "number_of_replicas": 1
//   },
//   "mappings": {
//     "properties": {
//       "sku_id": { "type": "keyword" },
//       "sku_name": {
//         "type": "text",
//         "fields": { "keyword": { "type": "keyword" } }
//       },
//       "sku_slug": { "type": "keyword" },
//       "spu_id": { "type": "keyword" },  // Join với SPU
//       "sku_status": { "type": "keyword" },

//       // Price info
//       "sku_price": {
//         "properties": {
//           "original": { "type": "integer" },
//           "sale": { "type": "integer" },
//           "currency": { "type": "keyword" }
//         }
//       },

//       // Variants của SKU này
//       "sku_variants": {
//         "type": "nested",
//         "properties": {
//           "variant_name": { "type": "keyword" },
//           "variant_slug": { "type": "keyword" },
//           "option_value": { "type": "keyword" },
//           "option_label": {
//             "type": "text",
//             "fields": { "keyword": { "type": "keyword" } }
//           }
//         }
//       },

//       // Stock info
//       "in_stock": { "type": "boolean" },
//       "sku_sold": { "type": "integer" },

//       "createdAt": { "type": "date" }
//     }
//   }
// }

// Search: "laptop gaming"
// GET /products/_search
// {
//   "query": {
//     "bool": {
//       "must": [
//         {
//           "multi_match": {
//             "query": "laptop gaming",
//             "fields": ["spu_name^3", "spu_description"]
//           }
//         }
//       ],
//       "filter": [
//         { "term": { "spu_status": "published" } },
//         { "range": { "price_range.min": { "lte": 20000000 } } }
//       ]
//     }
//   },
//   "aggs": {
//     "variants": {
//       "nested": { "path": "available_variants" },
//       "aggs": {
//         "gpu_options": {
//           "terms": { "field": "available_variants.options" }
//         }
//       }
//     }
//   }
// }
// Use Case 2: Find Exact SKU
// // User chọn: GPU=RTX3050, RAM=8GB
// GET /product_skus/_search
// {
//   "query": {
//     "bool": {
//       "must": [
//         { "term": { "spu_id": "spu_123" } },
//         { "term": { "sku_status": "published" } },
//         { "term": { "in_stock": true } },
//         {
//           "nested": {
//             "path": "sku_variants",
//             "query": {
//               "bool": {
//                 "must": [
//                   { "term": { "sku_variants.variant_slug": "gpu" } },
//                   { "term": { "sku_variants.option_value": "rtx3050" } }
//                 ]
//               }
//             }
//           }
//         },
//         {
//           "nested": {
//             "path": "sku_variants",
//             "query": {
//               "bool": {
//                 "must": [
//                   { "term": { "sku_variants.variant_slug": "ram" } },
//                   { "term": { "sku_variants.option_value": "8gb" } }
//                 ]
//               }
//             }
//           }
//         }
//       ]
//     }
//   }
// }
// Use Case 3: Multi-Index Search (nếu cần)
// // Search cả SPU và SKU
// GET /products,product_skus/_search
// {
//   "query": {
//     "multi_match": {
//       "query": "RTX3050",
//       "fields": ["spu_name", "sku_name"]
//     }
//   }
// }
