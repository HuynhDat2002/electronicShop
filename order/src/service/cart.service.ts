import { GetProductDetails, GetStockDetails } from "@/utils/broker"
import {logger} from '../utils'
import {errorResponse} from '../utils'
import {CartLineItems} from '@prisma/client'
import {CartRepositoryType} from '../repository/cart.repository'
import { CartEditRequestInput, CartRequestInput } from "@/dto"
export const CreateCart = async (input:CartRequestInput & {customerId:number},repo:CartRepositoryType)=>{
    // make a call to our catalog service
    // synchoronize call
    console.log("customerId",input.customerId)
    const product = await GetProductDetails(input.productId)
    logger.info(product)
    if(product.stock<input.qty){
        throw new errorResponse.NotFound("Product is out of stock")
    }
    
    //find if the product is already in the cart
    const existingItem = await repo.findCartByProductId(input.customerId,input.productId)

    if(existingItem){
        return await repo.updateCart(existingItem.id,existingItem.qty+input.qty)
    }

    const data = await repo.createCart(input.customerId,{
        productId:product.id,
        itemName:product.name,
        price:product.price,
        qty:input.qty,
        variant:product.variant
    } as CartLineItems)
    return product
}

export const GetCart = async (customerId:number,repo:CartRepositoryType)=>{
    //get customer cart data
    const cart = await repo.findCart(customerId)
    if(!cart) throw new errorResponse.NotFound("Cart not found")

    // list out all line items in the cart
    const lineItems = cart.cartLineItems;
    if(!lineItems.length){
        throw new errorResponse.NotFound("Cart items is empty")
    }
    //verify with inventory service if the product is still available
    const stockDetails = await GetStockDetails(lineItems.map(item=>item.productId))
    if(Array.isArray(stockDetails)){
        //update stock availability in cart line items
        lineItems.forEach(item=>{
            const stock = stockDetails.find(stock=>stock.id===item.productId)
            if(stock){
                item.availability = stock.stock
            }
        }
        )
    }
    // return update cart data with latest stock availability
    cart.cartLineItems = lineItems
    return cart
}

const AuthorizedCart = async (lineItemId:number, customerId:number,repo:CartRepositoryType)=>{
    const cart = await repo.findCart(customerId)
    if(!cart) throw new errorResponse.NotFound("Cart not found")
    const lineItem = cart.cartLineItems.find(item=>item.id===lineItemId)
    if(!lineItem) throw new errorResponse.NotFound("Cart item not found")
    return lineItem
}
export const EditCart = async (input:CartEditRequestInput & {customerId:number},repo:CartRepositoryType)=>{
    await AuthorizedCart(input.id,input.customerId,repo)
    const data = await repo.updateCart(input.id,input.qty)
    return data
}

export const DeleteCart = async (input:{id:number,customerId:number},repo:CartRepositoryType)=>{
    await AuthorizedCart(input.id,input.customerId,repo)
    const data = await repo.deleteCart(input.id)
    return data
}

