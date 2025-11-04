import { variantDto } from '@/dto';
import { errorResponse, OK, RequestValidator, CREATED } from '@/utils';
import { Request, Response } from 'express';
import { VariantService } from '@/services/variant.service';
import { VariantRepository } from '@/repositories/variant.repository';

export const variantService = new VariantService(new VariantRepository());

export class VariantController {
  // Create a new variant document for a SPU
  async create(req: Request, res: Response) {
    const { errors, input } = await RequestValidator(variantDto.CreateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    console.log('input from variant create', input);
    const data = await variantService.create(input as any);

    new CREATED({
      message: 'Create new variant successfully',
      metadata: data,
    }).send(res);
  }

  // Get variant by SPU ID
  async getBySpuId(req: Request, res: Response) {
    const spu_id = req.params.spu_id as string;
    const data = await variantService.getVariantBySpuId(spu_id);

    new OK({
      message: 'Get variant successfully',
      metadata: data,
    }).send(res);
  }

  // Get variant by variant ID
  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await variantService.getVariantById(id);

    new OK({
      message: 'Get variant successfully',
      metadata: data,
    }).send(res);
  }

  // Update entire variant document
  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { errors, input } = await RequestValidator(variantDto.UpdateRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await variantService.update({ id, ...input } as any);

    new OK({
      message: 'Update variant successfully',
      metadata: data,
    }).send(res);
  }

  // Delete variant document
  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await variantService.deleteVariant(id);

    new OK({
      message: 'Delete variant successfully',
      metadata: data,
    }).send(res);
  }

  // Add a variant item (e.g., add "Storage" variant to existing document)
  async addVariantItem(req: Request, res: Response) {
    const { errors, input } = await RequestValidator(variantDto.AddVariantItemRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await variantService.addVariantItem({
      variant_spu_id: input.variant_spu_id,
      variant_name: input.variant_item.variant_name,
      variant_options: input.variant_item.variant_options,
      variant_position: input.variant_item.variant_position,
    });

    new CREATED({
      message: 'Add variant item successfully',
      metadata: data,
    }).send(res);
  }

  // Update a variant item
  async updateVariantItem(req: Request, res: Response) {
    const { errors, input } = await RequestValidator(variantDto.UpdateVariantItemRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await variantService.updateVariantItem(input);

    new OK({
      message: 'Update variant item successfully',
      metadata: data,
    }).send(res);
  }

  // Remove a variant item
  async removeVariantItem(req: Request, res: Response) {
    const { errors, input } = await RequestValidator(variantDto.RemoveVariantItemRequest, req.body);
    if (errors) throw new errorResponse.ValidationError(errors.toString());

    const data = await variantService.removeVariantItem(input);

    new OK({
      message: 'Remove variant item successfully',
      metadata: data,
    }).send(res);
  }
}
