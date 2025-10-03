import { SpuRepository } from '../../../repositories/spu.repository';
import {asyncHandler} from '@/helpers';
import express, { Request, Response, NextFunction } from 'express';
import { SpuService } from '@/services';
import 'module-alias/register';
import { RequestValidator } from '../../../utils/requestValidator';
import { CreateProductRequest, UpdateProductRequest } from '@/dto';
import { BrokerService } from '@/services/broker.service';
const router = express.Router();

console.log('from router');
export const spuService = new SpuService(new SpuRepository());
export const brokerService = new BrokerService(spuService);

//endpoints
brokerService.initializeBroker();
router.get('/v1/test', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return res.status(201).json({ message: 'Test Successfully' });
});
router.post(
  '/v1/product',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { errors, input } = await RequestValidator(CreateProductRequest, req.body);
    if (errors) return res.status(400).json(errors);
    const data = await spuService.createProduct(input);
    return res.status(201).json(data);
  }
);

router.patch(
  '/v1/product/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      console.log('update');
      const { errors, input } = await RequestValidator(UpdateProductRequest, req.body);
      if (errors) return res.status(400).json(errors);

      const id = parseInt(req.params.id) || 0;
      const data = await spuService.updateProduct({ id, ...input });
      return res.status(200).json(data);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(error.message);
    }
  }
);

router.get(
  '/v1/products',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const limit = Number(req.query.limit);
      const offset = Number(req.query.offset);
      const search = req.query.search as string;
      console.log('search', typeof search);
      const data = await spuService.getProducts(limit, offset, search);
      return res.status(200).json(data);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(error.message);
    }
  }
);

router.get(
  '/v1/product/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = req.params.id as string;

      const data = await spuService.getProduct(id);
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  '/v1/product/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = Number(req.params.id);

      const data = await spuService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(error.message);
    }
  }
);

router.post(
  '/v1/product/stock',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const ids = req.body.ids;

      const data = await spuService.getProductStock(ids);
      return res.status(200).json(data);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json(error.message);
    }
  }
);

export default router;
