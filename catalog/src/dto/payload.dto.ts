import { CreateSpuRequest } from "./spu.dto";

export type CatalogProduct={
    id:number,

} & Partial<CreateSpuRequest>