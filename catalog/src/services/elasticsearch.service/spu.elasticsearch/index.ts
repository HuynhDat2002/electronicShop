import { SPU } from '@/models/spu.model';
import { Client } from '@elastic/elasticsearch';
import { errorResponse } from '@/utils';
import { VARIANT } from '@/models/variant.model';
import { ElasticsearchTransformer } from '../transform.helper';
import { spuModel } from '@/db/models/mongodb/spu.model';

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
      throw new errorResponse.NotFound('Not found product');
    }
  }

  /**
   * Create product in Elasticsearch with transformed data
   */
  async create(data: SPU) {
    try {
      // Get full SPU data with populated references
      const spuData = await spuModel
        .findOne({ spu_id: data.spu_id })
        .populate('spu_skus')
        .populate('spu_variants')
        .populate('spu_default_sku')
        .lean();

      if (!spuData) {
        console.error('SPU not found in MongoDB:', data.spu_id);
        return;
      }

      // Transform to Elasticsearch format
      const esDocument = await ElasticsearchTransformer.transformSpuForElasticsearch(spuData);

      const result = await this.client.index({
        index: this.indexName,
        id: data.spu_id.toString(),
        document: esDocument,
      });

      console.log('✅ Product created in elasticsearch:', data.spu_id);
    } catch (error) {
      console.error('❌ Product create error in elasticsearch:', error);
    }
  }

  /**
   * Update product variant in Elasticsearch
   * When variant is updated, we need to re-sync the entire SPU
   */
  async createVariant(data: VARIANT) {
    try {
      // Get SPU data and re-sync
      const spuData = await spuModel
        .findOne({ spu_id: data.variant_spu_id })
        .populate('spu_skus')
        .populate('spu_variants')
        .populate('spu_default_sku')
        .lean();

      if (!spuData) {
        console.error('SPU not found for variant update:', data.variant_spu_id);
        return;
      }

      // Transform to Elasticsearch format
      const esDocument = await ElasticsearchTransformer.transformSpuForElasticsearch(spuData);

      const result = await this.client.index({
        index: this.indexName,
        id: data.variant_spu_id.toString(),
        document: esDocument,
      });

      console.log('✅ Product variant updated in elasticsearch:', data.variant_spu_id);
    } catch (error) {
      console.error('❌ Product variant update error in elasticsearch:', error);
    }
  }

  /**
   * Update product in Elasticsearch
   */
  async update(data: SPU) {
    try {
      const exists = await this.client.exists({
        index: this.indexName,
        id: data.spu_id.toString(),
      });

      if (exists) {
        // Get full SPU data with populated references
        const spuData = await spuModel
          .findOne({ spu_id: data.spu_id })
          .populate('spu_skus')
          .populate('spu_variants')
          .populate('spu_default_sku')
          .lean();

        if (!spuData) {
          console.error('SPU not found in MongoDB:', data.spu_id);
          return;
        }

        // Transform to Elasticsearch format
        const esDocument = await ElasticsearchTransformer.transformSpuForElasticsearch(spuData);

        const result = await this.client.index({
          index: this.indexName,
          id: data.spu_id.toString(),
          document: esDocument,
        });

        console.log('✅ Product updated in elasticsearch:', data.spu_id);
      } else {
        console.log('Product does not exist in elasticsearch, creating new:', data.spu_id);
        await this.create(data);
      }
    } catch (error) {
      console.error('❌ Product update error in elasticsearch:', error);
    }
  }

  /**
   * Delete product from Elasticsearch
   */
  async delete(id: string) {
    try {
      const result = await this.client.delete({
        index: this.indexName,
        id: id.toString(),
      });
      console.log('✅ Product deleted from elasticsearch:', id);
    } catch (err) {
      console.error('❌ Error deleting product from elasticsearch:', err);
    }
  }

  /**
   * Sync a single SKU update to Elasticsearch
   * When SKU is updated, we need to re-sync the entire SPU
   */
  async syncSkuUpdate(skuSpuId: string) {
    try {
      const spuData = await spuModel
        .findOne({ spu_id: skuSpuId })
        .populate('spu_skus')
        .populate('spu_variants')
        .populate('spu_default_sku')
        .lean();

      if (!spuData) {
        console.error('SPU not found for SKU update:', skuSpuId);
        return;
      }

      const esDocument = await ElasticsearchTransformer.transformSpuForElasticsearch(spuData);

      await this.client.index({
        index: this.indexName,
        id: skuSpuId.toString(),
        document: esDocument,
      });

      console.log('✅ Product synced after SKU update:', skuSpuId);
    } catch (error) {
      console.error('❌ Error syncing SKU update to elasticsearch:', error);
    }
  }
}
