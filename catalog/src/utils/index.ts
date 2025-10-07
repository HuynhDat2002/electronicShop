export * from './error'
export * from  './fixtures'
export * from './logger'
export * from './requestValidator'
export * from './cloud/imagekit.utils'
export * from './successResponse'
import _ from 'lodash'

import {SPU} from '@/models/spu.model'
import { SKU } from '@/models/sku.model'
export const omitDataSpu =(fields:string[],object={})=>{
    return _.omit(object,fields) as SPU
}


export const omitDataSku =(fields:string[],object={})=>{
    return _.omit(object,fields) as SKU
}
