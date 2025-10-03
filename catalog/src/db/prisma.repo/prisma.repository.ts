// import { prisma } from "@/db";
// import { SPU } from "@/models/spu.model";
// import { ISpuRepository } from "@/interfaces/catalogRepository.interface";

// export class PrismaRepository implements ISpuRepository {
//   async create(data: SPU): Promise<SPU> {
//     const result = await prisma.SPU.create({
//       data: {
//         name: data.name,
//         price: data.price,
//         stock: data.stock,
//         description: data.description,
//       },
//     });
//     return result;
//   }
//   async update(data: SPU): Promise<SPU> {
//     const result = await prisma.SPU.update({
//       where: {
//         id: data.id,
//       },
//       data,
//     });
//     return result;
//   }
//   async delete(data: any): Promise<{}> {
//     throw new Error("Method not implemented.");
//   }
//   async find(limit: number, offset: number): Promise<SPU[]> {
//     const result = await prisma.SPU.findMany({
//       take: limit,
//     });
//     return result;
//   }
//   async findOne(data: SPU["id"]): Promise<SPU> {
//     throw new Error("Method not implemented.");
//   }
//   async getSpuStock(ids: number[]): Promise<SPU[]> {
//     throw new Error("Method not implemented.");
//   }
// }
