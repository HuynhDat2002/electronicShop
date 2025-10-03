import { SpuRepository } from '../../../repositories/spu.repository';
import { asyncHandler } from '@/helpers';
import express, { Request, Response, NextFunction } from 'express';
import { SpuService } from '@/services';
import 'module-alias/register';
import { RequestValidator } from '../../../utils/requestValidator';
import { CreateRequest, UpdateRequest } from '@/dto';
import { BrokerService } from '@/services/broker.service';
import { errorResponse } from '@/utils';

import multer from 'multer';
import { SpuController } from './spu.controller';
const upload = multer({ dest: './src/upload/' });

const router = express.Router();

console.log('from router');
const spuController = new SpuController();
export const spuService = new SpuService(new SpuRepository());
export const brokerService = new BrokerService(spuService);

//endpoints
brokerService.initializeBroker();
router.get('/test', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return res.status(201).json({ message: 'Test Successfully' });
});
router.post(
  '/spu',
  upload.fields([
    { name: 'spu_image', maxCount: 10 }, // nhiều ảnh
    { name: 'spu_thumb', maxCount: 1 }, // 1 ảnh
  ]),
  asyncHandler(spuController.create)
);

router.patch('/spu/:id', upload.single('spu_thumb'), asyncHandler(spuController.update));

router.get('/spus', asyncHandler(spuController.getSpus));

router.get(
  '/spu/:id',
  asyncHandler(spuController.getSpu)
);

router.delete(
  '/spu/:id',
 asyncHandler(spuController.delete)
);

export default router;
