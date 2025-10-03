export * from './broker.type'
export * from './spu.type'

import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}