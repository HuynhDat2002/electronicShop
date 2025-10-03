'use strice';

import { Consumer, Producer } from 'kafkajs';
import { SpuService } from '../spu.service';
import { SpuRepository } from '@/repositories/spu.repository';
import { MessageBroker } from '@/utils/broker';

export class BrokerService {
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private spuService: SpuService;

  constructor(spuService: SpuService) {
    this.spuService = spuService;
  }

  public async initializeBroker() {
    this.producer = await MessageBroker.connectProducer<Producer>();
    this.producer.on('producer.connect', async () => {
      console.log('Catalog Service Producer connected successfully');
    });

    this.consumer = await MessageBroker.connectConsumer<Consumer>();
    this.consumer.on('consumer.connect', async () => {
      console.log('Catalog Service Consumer connected successfully');
    });

    // keep listening to consumers events
    // perform the action based on the event
    await MessageBroker.subscribe(
      this.spuService.handleBrokerMessage.bind(this.spuService),
      'CatalogEvents'
    );
  }

  // publish discontinue product event
  public async sendDeleteProductMessage(data: any) {}
}
