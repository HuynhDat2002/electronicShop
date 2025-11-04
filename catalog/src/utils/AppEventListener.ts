import { ElasticSearchService } from '@/services/elasticsearch.service';
import { EventEmitter } from 'events';

export type SpuEvents='createSpu' | 'updateSpu' | 'deleteSpu'|'deleteIndex'
export type VariantEvents='createVariant' | 'updateVariant' | 'deleteVariant'|'deleteIndex'
export type SkuEvents='createSku' | 'updateSku' | 'deleteSku'|'deleteIndex'

export interface EventPayload {
  event: SpuEvents|SkuEvents|VariantEvents;
  data?: any;
}

export class AppEventListener extends EventEmitter {
  private static _instance: AppEventListener;
  private eventName: string = 'ELASTIC_SEARCH_EVENT';
  constructor() {
    super();
  }
  static get instance() {
    return this._instance || (this._instance = new AppEventListener());
  }

  notify(payload: EventPayload) {
    this.emit(this.eventName, payload);
  }
  listen(elasticSearchInstance: ElasticSearchService) {
    this.on(this.eventName, (payload: EventPayload) => {
      try {
        console.log('Event received', payload);
        elasticSearchInstance.handleEvents(payload);
      } catch (err) {
        console.error('Error in listener:', err);
      }
    }); 
  }
}
