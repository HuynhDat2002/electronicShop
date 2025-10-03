"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFactory = void 0;
var rosie_1 = require("rosie");
var faker_1 = require("@faker-js/faker");
exports.ProductFactory = new rosie_1.Factory()
    .attr("id", faker_1.faker.number.int({ min: 1, max: 1000 }))
    .attr("name", faker_1.faker.commerce.productName())
    .attr("description", faker_1.faker.commerce.productDescription())
    .attr("stock", faker_1.faker.number.int({ min: 10, max: 1000 }))
    .attr("price", +faker_1.faker.commerce.price());
