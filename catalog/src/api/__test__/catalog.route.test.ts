// import request from 'supertest';
// import express from 'express';
// import { faker } from '@faker-js/faker';
// import spuRoute, { spuService } from '../v1/spu';
// import { ProductFactory } from '../../utils/fixtures';
// const app = express();
// app.use(express.json());

// app.use(spuRoute);

// const mockRequest = () => {
//   return {
//     name: faker.commerce.productName(),
//     description: faker.commerce.productDescription(),
//     stock: faker.number.int({ min: 10, max: 1000 }),
//     price: +faker.commerce.price(),
//   };
// };

// describe('spu Routes', () => {
//   describe('POST /product', () => {
//     test('should create product successfully', async () => {
//       const reqBody = await mockRequest();
//       const product = await ProductFactory.build();
//       jest
//         .spyOn(spuService, 'createProduct')
//         .mockImplementationOnce(() => Promise.resolve(product));
//       const response = await request(app)
//         .post('/product')
//         .send(reqBody)
//         .set('Accept', 'application/json');

//       console.log('TEST RESPONSE', response);
//       expect(response.status).toBe(201);
//       expect(response.body).toEqual(product);
//     });

//     // test("should response with validation error 400", async () => {
//     //     const reqBody = await mockRequest()

//     //     const response = await request(app)
//     //         .post('/product')
//     //         .send({...reqBody,name:""})
//     //         .set("Accept", "application/json")

//     //     console.log("TEST RESPONSE", response)
//     //     expect(response.status).toBe(400)
//     //     expect(response.body).toEqual("name should not be empty")
//     // })

//     // test("should response with an internal error code 500", async () => {
//     //     const reqBody = await mockRequest()
//     //     jest
//     //     .spyOn(spuService, 'createProduct')
//     //     .mockImplementationOnce(() => Promise.reject(new Error("Internal Error 500 While Creating Product")))
//     //     const response = await request(app)
//     //         .post('/product')
//     //         .send(reqBody)
//     //         .set("Accept", "application/json")

//     //     console.log("TEST RESPONSE", response)
//     //     expect(response.status).toBe(500)
//     //     expect(response.body).toEqual("Internal Error 500 While Creating Product")
//     // })
//   });

//   describe('PATCH /product/:id', () => {
//     test('should update product successfully', async () => {
//       const product = await ProductFactory.build();
//       const reqBody = await mockRequest();
//       const requestBody = {
//         name: product.name,
//         price: product.price,
//         stock: product.stock,
//       };
//       jest
//         .spyOn(spuService, 'updateProduct')
//         .mockImplementationOnce(() => Promise.resolve(product));
//       const response = await request(app)
//         .patch(`/product/${product.id}`)
//         .send(requestBody)
//         .set('Accept', 'application/json');

//       console.log('TEST RESPONSE', response);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(product);
//     });

//     // test("should response with validation error 400", async () => {
//     //     const product = await ProductFactory.build()
//     //     const reqBody = await mockRequest()
//     //     const requestBody = {
//     //         name:product.name,
//     //         price:-1,
//     //         stock:product.stock,
//     //     }
//     //     const response = await request(app)
//     //         .patch(`/product/${product.id}`)
//     //         .send(requestBody)
//     //         .set("Accept", "application/json")

//     //     console.log("TEST RESPONSE", response)
//     //     expect(response.status).toBe(400)
//     //     expect(response.body).toEqual("price must not be less than 1")
//     // })

//     // test("should response with an internal error code 500", async () => {
//     //     const reqBody = await mockRequest()
//     //     jest
//     //     .spyOn(spuService, 'updateProduct')
//     //     .mockImplementationOnce(() => Promise.reject(new Error("Internal Error 500 While Updating Product")))
//     //     const product = await ProductFactory.build()
//     //     const requestBody = {
//     //         name:product.name,
//     //         price:product.price,
//     //         stock:product.stock,
//     //     }
//     //     const response = await request(app)
//     //         .patch(`/product/${product.id}`)
//     //         .send(requestBody)
//     //         .set("Accept", "application/json")

//     //     console.log("TEST RESPONSE", response)
//     //     expect(response.status).toBe(500)
//     //     expect(response.body).toEqual("Internal Error 500 While Updating Product")
//     // })
//   });

//   describe('GET /products?limit=0&offset=0', () => {
//     test('should return a range of products based on litmit and offset', async () => {
//       const randomLimit = faker.number.int({ min: 10, max: 50 });
//       const products = ProductFactory.buildList(randomLimit);
//       jest
//         .spyOn(spuService, 'getProducts')
//         .mockImplementationOnce(() => Promise.resolve(products));
//       const response = await request(app)
//         .get(`/products?limit=${randomLimit}&offset=0`)
//         .set('Accept', 'application/json');

//       console.log('TEST RESPONSE', response);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(products);
//     });
//   });

//   describe('GET /product/:id', () => {
//     test('should return a product by id', async () => {
//       const product = ProductFactory.build();
//       jest
//         .spyOn(spuService, 'getProduct')
//         .mockImplementationOnce(() => Promise.resolve(product));
//       const response = await request(app)
//         .get(`/product/${product.id}`)
//         .set('Accept', 'application/json');

//       console.log('TEST RESPONSE', response);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(product);
//     });
//   });

//   describe('DELETE /product/:id', () => {
//     test('should delete a product by id', async () => {
//       const product = ProductFactory.build();
//       jest
//         .spyOn(spuService, 'deleteProduct')
//         .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
//       const response = await request(app)
//         .delete(`/product/${product.id}`)
//         .set('Accept', 'application/json');

//       console.log('TEST RESPONSE', response);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({ id: product.id });
//     });
//   });
// });
