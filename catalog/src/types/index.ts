export * from './broker.type'
export * from './spu.type'
export * from './attribute.type'
export * from './variant.type'
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}