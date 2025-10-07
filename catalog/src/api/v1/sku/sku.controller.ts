import { skuDto } from '@/dto';
import { SkuRepository } from '@/repositories';
import { SkuService } from '@/services';
import { errorResponse, OK, RequestValidator } from '@/utils';
import { Request, Response, NextFunction } from 'express';
import { CREATED } from '@/utils';
import { SKU } from '@/models/sku.model';
export const skuService = new SkuService(new SkuRepository());

export class SkuController {
  async create(req: Request, res: Response, next: NextFunction) {
    //check input
    let file = req.file as any;
    
    if (file) {
      file ={
        image_name: file.originalname,
        image_url: file.path,
      } as { image_name: string; image_url: string };
    }

    console.log('files from input', file);
    let { errors, input } = await RequestValidator(skuDto.CreateRequest, { ...req.body, ...{sku_image:file,sku_price:JSON.parse(req.body.sku_price)} });
    if (errors) throw new errorResponse.ValidationError(errors.toString());
    
    console.log('input from sku create',input)
    //service
    const data = await skuService.create(input);

    new CREATED({
      message: 'Create new sku successfully',
      metadata: data,
    }).send(res);
  }
  // async update(req: Request, res: Response, next: NextFunction) {
  //   //check input
  //   let thumb = req.file as any;
  //   if (thumb) {
  //     thumb = {
  //       image_name: thumb.originalname,
  //       image_url: thumb.path,
  //     } as { image_name: string; image_url: string };
  //     req.body = { ...req.body, ...{ sku_thumb: thumb } };
  //   }
  //   const { errors, input } = await RequestValidator(skuDto.UpdateRequest, req.body);
  //   console.log('input update', input);
  //   if (errors) throw new errorResponse.ValidationError(errors.toString());

  //   const id = req.params.id || '';
  //   const data = await skuService.update({ id, ...input });
  //   new CREATED({
  //     message: 'Update sku successfully',
  //     metadata: data,
  //   }).send(res);
  // }

  // async getskus(req: Request, res: Response, next: NextFunction): Promise<any> {
  //   const limit = Number(req.query.limit)||20;
  //   const page = Number(req.query.page)||1;
  //   const search = req.query.search as string ||'';
  //   const sort = req.query.sort as any
  //   console.log('search', req.query);
  //   const data = await skuService.getskus({limit,page,search,sort});
  //   new OK({
  //     message: 'Get skus successfully',
  //     metadata: data,
  //   }).send(res);
  // }

  // async getSkuById(req: Request, res: Response, next: NextFunction) {
  //   const id = req.params.id as string;
  //   const data = await skuService.getSkuById(id);
  //   new OK({
  //     message: 'Get sku successfully',
  //     metadata: data,
  //   }).send(res);
  // }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const data = await skuService.deleteSku(id);
    new OK({
      message: 'Delete sku successfully',
      metadata: data,
    }).send(res);
  }
}
