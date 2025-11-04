'use strice';

import { Consumer, Kafka, logLevel, Producer } from 'kafkajs';
import { MessageBroker } from '@/utils/broker';
const CLIENT_ID = process.env.CLIENT_ID || 'catalog-service';
const GROUP_ID = process.env.GROUP_ID || 'catalog-service-group';
const BROKERS = [process.env.BROKERS_1 || 'localhost:9092'];

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});
export class BrokerService {
  private producer: Producer;
  private consumer: Consumer;
  constructor() {
    this.producer = kafka.producer({
      retry: {
        initialRetryTime: 1000,
        retries: 50,
      },
    });
    this.consumer = kafka.consumer({
      groupId: GROUP_ID,
      retry: {
        initialRetryTime: 1000,
        retries: 50,
      },
    });
  }

  public async initializeBroker() {
    this.producer = await MessageBroker.connectProducer<Producer>(this.producer);
    this.producer.on('producer.connect', async () => {
      console.log('Catalog Service Producer connected successfully');
    });

    this.consumer = await MessageBroker.connectConsumer<Consumer>(this.consumer);
    this.consumer.on('consumer.connect', async () => {
      console.log('Catalog Service Consumer connected successfully');
    });

    // keep listening to consumers events
    // perform the action based on the event
    await MessageBroker.subscribe(this.consumer, 'CatalogEvents');
    MessageBroker.runEachMessage(this.consumer);
  }

  // publish discontinue product event
  public async sendDeleteProductMessage(data: any) {}
}
