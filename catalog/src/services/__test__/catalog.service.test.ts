// import { ISpuRepository } from "@/interfaces/catalogRepository.interface";
// import { MockCatalogRepository } from "../../repositories/mockCatalog.repository";
// import { CatalogService } from "../catalog.service";
// import { faker } from '@faker-js/faker'
// import { SPU as Product } from "@/models/spu.model";
// import {Factory } from 'rosie'

// const productFactory = new Factory<Product>()
//     .attr("id",faker.number.int({min:1,max:1000}))
//     .attr("name",faker.commerce.productName())
//     .attr("description",faker.commerce.productDescription())
//     .attr("stock",faker.number.int({min:10,max:1000}))
//     .attr("price",+faker.commerce.price())

// const mockProduct = (rest:any) => {
//     return {
//         name: faker.commerce.productName(),
//         description: faker.commerce.productDescription(),
//         stock: faker.number.int({ min: 10, max: 1000 }),
//         ...rest

//     }
// }
// describe("catalogService", () => {

//     let repository: ISpuRepository
//     beforeEach(() => {
//         repository = new MockCatalogRepository();
//     })
//     afterEach(() => {
//         repository = {} as MockCatalogRepository;
//     });

//     describe("createProduct", () => {
//         test("should create product", async () => {
//             const service = new CatalogService(repository);
//             const reqBody = await mockProduct({
//                 price: +faker.commerce.price()
//             })
//             const result = await service.createProduct(reqBody)
//             expect(result).toMatchObject({
//                 id: expect.any(Number),
//                 name: expect.any(String),
//                 description: expect.any(String),
//                 price: expect.any(Number),
//                 stock: expect.any(Number),
//             })
//         })

//         test("should  throw error with unable to create product", async () => {
//             const service = new CatalogService(repository);
//             const reqBody = await mockProduct({
//                 price: +faker.commerce.price()
//             })

//             jest
//                 .spyOn(repository, "create")
//                 .mockImplementationOnce(() => Promise.resolve({} as Product))

//             await expect(service.createProduct(reqBody)).rejects.toThrow("unable to create product")
//         })

//         test("should throw error with product already exist", async () => {
//             const service = new CatalogService(repository);
//             const reqBody = await mockProduct({
//                 price: +faker.commerce.price()
//             })

//             jest
//                 .spyOn(repository, "create")
//                 .mockImplementationOnce(() => Promise.reject(new Error("product already exist")))

//             await expect(service.createProduct(reqBody)).rejects.toThrow("product already exist")
//         })
//     })

//     describe("updateProduct",()=>{
//         test("should update product",async ()=>{
//             const service  = new CatalogService(repository)
//             const reqBody=mockProduct({
//                 price: +faker.commerce.price(),
//                 id:faker.number.int({min:10,max:1000}),
//             })

//             const result  = await service.updateProduct(reqBody)

//             expect(result).toMatchObject(reqBody)
//         })

//         test("should throw error with product does not exist", async () => {
//             const service = new CatalogService(repository);

//             jest
//                 .spyOn(repository, "update")
//                 .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")))

//             await expect(service.updateProduct({})).rejects.toThrow("product does not exist")
//         })
//     })

//     describe("getProducts",()=>{
//         test("should get products by limit and offset",async ()=>{
//             const service = new CatalogService(repository);
//             const randomLimit= faker.number.int({min:10,max:50})
//             const products = productFactory.buildList(randomLimit)
//             jest
//             .spyOn(repository, "find")
//             .mockImplementationOnce(() => Promise.resolve(products))

//             const result = await service.getProducts(randomLimit,0,"")
//             console.log('result',result)
//             expect(result.length).toEqual(randomLimit)
//             expect(result).toMatchObject(products)
//         })

//         test("should throw error with product does not exist", async () => {
//             const service = new CatalogService(repository);

//             jest
//                 .spyOn(repository, "find")
//                 .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")))

//             await expect(service.getProducts(0,0,"")).rejects.toThrow("product does not exist")
//         })
//     })

//     describe("getProduct",()=>{
//         test("should get products by id",async ()=>{
//             const service = new CatalogService(repository);
//             const randomLimit= faker.number.int({min:10,max:50})
//             const product = productFactory.build()
//             jest
//             .spyOn(repository, "findOne")
//             .mockImplementationOnce(() => Promise.resolve(product))

//             const result = await service.getProduct(product.id!)
//             console.log('result',result)
//             expect(result).toMatchObject(product)
//         })

//         // test("should throw error with product does not exist", async () => {
//         //     const service = new CatalogService(repository);

//         //     jest
//         //         .spyOn(repository, "find")
//         //         .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")))

//         //     await expect(service.getProducts(0,0)).rejects.toThrow("product does not exist")
//         // })
//     })

//     describe("deleteProduct",()=>{
//         test("should delete products by id",async ()=>{
//             const service = new CatalogService(repository);
//             const randomLimit= faker.number.int({min:10,max:50})
//             const product = productFactory.build()
//             jest
//             .spyOn(repository, "delete")
//             .mockImplementationOnce(() => Promise.resolve({id:product.id}))

//             const result = await service.deleteProduct(product.id!)
//             console.log('result',result)
//             expect(result).toMatchObject({
//                 id:product.id
//             })
//         })

//         // test("should throw error with product does not exist", async () => {
//         //     const service = new CatalogService(repository);

//         //     jest
//         //         .spyOn(repository, "find")
//         //         .mockImplementationOnce(() => Promise.reject(new Error("product does not exist")))

//         //     await expect(service.getProducts(0,0)).rejects.toThrow("product does not exist")
//         // })
//     })
// });
