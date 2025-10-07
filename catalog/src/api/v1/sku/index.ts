import { SkuRepository } from '../../../repositories/sku.repository';
import { asyncHandler } from '@/helpers';
import express, { Request, Response, NextFunction } from 'express';
import { SkuService } from '@/services';
import 'module-alias/register';

import multer from 'multer';
import { SkuController } from './sku.controller';
const upload = multer({ dest: './src/upload/' });

const router = express.Router();

console.log('from router');
const skuController = new SkuController();
export const skuService = new SkuService(new SkuRepository());

router.get('/test', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return res.status(201).json({ message: 'Test Successfully' });
});
router.post(
  '/sku',
  upload.single('sku_image'),
  asyncHandler(skuController.create)
);

// router.patch('/sku/:id', upload.single('sku_thumb'), asyncHandler(skuController.update));

// router.get('/skus', asyncHandler(skuController.getskus));

// router.get('/sku/:id', asyncHandler(skuController.getskuById));

router.delete('/sku/:id', asyncHandler(skuController.delete));

router.delete(
  '/sku/delete/all',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const deleteAll = await skuService.deleteAll();
    return res.status(200).json(deleteAll);
  })
);

export default router;
