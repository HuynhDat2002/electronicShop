import { Consumer, Producer } from "kafkajs"
import { MessageType, CatalogEvent, TOPIC_TYPE } from "../../types"

export interface PublishType{
    headers: Record<string,any>
    topic: TOPIC_TYPE
    event:CatalogEvent
    message:Record<string,any>

}

export type MessageHandler = (input:MessageType)=>void

export type MessageBrokerType = {
    //producer
    connectProducer:<T>(producer:Producer)=>Promise<T>
    disconnectProducer:(producer:Producer)=>Promise<void>
    publish: (data:PublishType)=>Promise<boolean>

    //consumer
    connectConsumer:<T>(consumer:Consumer)=>Promise<T>
    disconnectConsumer:(consumer:Consumer)=>Promise<void>
    runEachMessage:(consumer:Consumer)=>Promise<void>
    subscribe: (
        consumer:Consumer,
        topic:TOPIC_TYPE
    )=>Promise<void>
}