import { SkuRepository } from '../../../repositories/sku.repository';
import { asyncHandler } from '@/helpers';
import express, { Request, Response, NextFunction } from 'express';
import { SkuService } from '@/services';
import 'module-alias/register';

import multer from 'multer';
import { VariantController } from './variant.controller';
const upload = multer({ dest: './src/upload/' });

const router = express.Router();

console.log('from router');
const variantController = new VariantController();

router.get('/variant/test', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return res.status(201).json({ message: 'Test Successfully' });
});
router.post(
  '/variant',
  asyncHandler(variantController.create)
);

// router.patch('/sku/:id', upload.single('sku_thumb'), asyncHandler(variantController.update));

// router.get('/skus', asyncHandler(variantController.getskus));

// router.get('/sku/:id', asyncHandler(variantController.getskuById));

router.delete('/sku/:id', asyncHandler(variantController.delete));


export default router;
