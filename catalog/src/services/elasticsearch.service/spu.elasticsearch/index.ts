import { CatalogProduct } from '@/dto';
import { Client } from '@elastic/elasticsearch';


export class SpuElasticSearch{
    private client:Client
    private indexName:string;
    constructor(client:Client,indexName:string){
        this.client=client,
        this.indexName=indexName
    }
       async get(id:string){
    const result = await this.client.get({
      index:this.indexName,
      id:id.toString(),
    })

    return result._source
   }

   async create(data:CatalogProduct){
    const result =await this.client.index({
      index:this.indexName,
      id:data.id.toString(),
      document:data
    })
    console.log("product created in elasticsearch", result)
   }

   async update(data:CatalogProduct){
    const result =await this.client.update({
      index:this.indexName,
      id:data.id.toString(),
      doc:data
    })
    console.log("product updated in elasticsearch", result)
   }

   async delete(id:string){
    try{

      const result = await this.client.delete({
       index:this.indexName,
       id:id.toString(),
      })
      console.log("product deleted in elasticsearch", result)
    }
    catch(err){
      console.log('error delete elasticsearch',err)
    }
   }

   async search(search:string){
    const result = await this.client.search({
      index:this.indexName,
      query: search.length===0? {
        match_all:{}
      } : {
        multi_match:{
          query:search,
          fields:["name","description"],
          fuzziness:"AUTO",
        }
      }
    })
    console.log("search result from elasticsearch", result.hits.hits)
    return result.hits.hits.map((hit)=>hit._source)
   }
}