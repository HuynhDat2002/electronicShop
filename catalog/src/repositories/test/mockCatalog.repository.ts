import { ISpuRepository } from '@/interfaces/spu.interface';
import { SPU } from '@/models/spu.model';

export class MockCatalogRepository implements ISpuRepository {
  create(data: SPU): Promise<SPU> {
    const mockSPU = {
      id: 123,
      ...data,
    } as SPU;
    return Promise.resolve(mockSPU);
  }
  update(data: SPU): Promise<SPU> {
    return Promise.resolve(data as unknown as SPU);
  }
  delete(id: any) {
    return Promise.resolve(id);
  }
  find(limit: number, offset: number): Promise<[]> {
    return Promise.resolve([]);
  }
  findOne(id: string): Promise<SPU> {
    return Promise.resolve({} as unknown as SPU);
  }
  getSpuStock(ids: string[]): Promise<SPU[]> {
    return Promise.resolve([]);
  }
}
