import { spuDto } from '@/dto';
import { SpuRepository } from '@/repositories';
import { SpuService } from '@/services';
import { errorResponse, OK, RequestValidator } from '@/utils';
import { Request, Response, NextFunction } from 'express';
import { CREATED } from '@/utils';
import { SPU } from '@/models/spu.model';
export const spuService = new SpuService(new SpuRepository());

export class SpuController {
  async create(req: Request, res: Response, next: NextFunction) {
    //check input
    let files = req.files as any;
    if (files.spu_image) {
      files.spu_image = files.spu_image.map((i: any) => ({
        image_name: i.originalname,
        image_url: i.path,
      })) as Array<{ image_name: string; image_url: string }>;
    }
    if (files.spu_thumb) {
      files.spu_thumb = files.spu_thumb.map((i: any) => ({
        image_name: i.originalname,
        image_url: i.path,
      }))[0] as { image_name: string; image_url: string };
    }
    console.log('files from input', files);
    let { errors, input } = await RequestValidator(spuDto.CreateRequest, { ...req.body, ...files });
    if (errors) throw new errorResponse.ValidationError(errors.toString());
    //service
    const data = await spuService.create(input);

    new CREATED({
      message: 'Create new spu successfully',
      metadata: data,
    }).send(res);
  }
  async update(req: Request, res: Response, next: NextFunction) {
    //check input
    let thumb = req.file as any;
    if (thumb) {
      thumb = {
        image_name: thumb.originalname,
        image_url: thumb.path,
      } as { image_name: string; image_url: string };
      req.body = { ...req.body, ...{ spu_thumb: thumb } };
    }
    const { errors, input } = await RequestValidator(spuDto.UpdateRequest, req.body);
    console.log('input update', input);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const id = req.params.id || '';
    const data = await spuService.update({ id, ...input });
    new CREATED({
      message: 'Update spu successfully',
      metadata: data,
    }).send(res);
  }

  async getSpus(req: Request, res: Response, next: NextFunction): Promise<any> {
    const limit = Number(req.query.limit)||20;
    const page = Number(req.query.page)||1;
    const search = req.query.search as string ||'';
    const sort = req.query.sort as any
    console.log('search', req.query);
    const data = await spuService.getSpus({limit,page,search,sort});
    new OK({
      message: 'Get spus successfully',
      metadata: data,
    }).send(res);
  }

  async getSpuById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const data = await spuService.getSpuById(id);
    new OK({
      message: 'Get spu successfully',
      metadata: data,
    }).send(res);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    const data = await spuService.deleteSpu(id);
    new OK({
      message: 'Delete spu successfully',
      metadata: data,
    }).send(res);
  }
}
