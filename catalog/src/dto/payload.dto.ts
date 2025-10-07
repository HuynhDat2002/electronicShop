import { CreateRequest } from "./spu.dto";

export type CatalogProduct={
    id:number,

} & Partial<CreateRequest>