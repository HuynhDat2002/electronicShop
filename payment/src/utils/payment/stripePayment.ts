import { PaymentGateway } from "./payment.type";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const createPayment =  async (
    amount:number, 
    metadata:{
        orderNumber:number,
        userId:number,
    }   
):Promise<{secret:string, pubKey:string,amount:number}> => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount:amount,
        currency:"usd",
        metadata:metadata
    })

    
   return {
    secret:paymentIntent.client_secret as string,
    pubKey: process.env.STRIPE_PUBLIC_KEY as string,
    amount:paymentIntent.amount as number
   }
}

const getPayment= async (paymentId:string):Promise<Record<string,unknown>> => {

     const paymentResponse = await stripe.paymentIntents.retrieve(paymentId as string,{});
    if(!paymentResponse) throw new Error("Payment not found")
     const {status} = paymentResponse
    const orderNumber = paymentResponse.metadata["orderNumber"]
     return {status:status,orderNumber:orderNumber,paymentLog:paymentResponse}
   
}

export const StripePayment:PaymentGateway = {
    createPayment,
    getPayment
}