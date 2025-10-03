'use strict'
import mongoose from 'mongoose'
const connectString = process.env.MONGODB_URL ?? ''
console.log('url',connectString)
export class MongoDB{
    // khỏi tạo biến và construction
    private static _instance:MongoDB|null=null;
    constructor(){
        this.connect()
    }

    connect(type="mongodb"){
        if(1===1){
            mongoose.set('debug',true);
            mongoose.set('debug',{color:true})
        }
        mongoose
        .connect(connectString,{
            maxPoolSize:20
        })
        .then(()=>{
            console.log("Connect MongoDB Successfully")
        })
        .catch((err:any)=>console.log('Error Connect To Mongodb'))

    }

    static getInstance():MongoDB{
        if(!MongoDB._instance){
            MongoDB._instance = new MongoDB()
        }
        return MongoDB._instance;
    }
}

const instanceMongoDB = MongoDB.getInstance()

export default instanceMongoDB