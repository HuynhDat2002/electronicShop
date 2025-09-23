import { updateAxiosUserInstanceFilm} from '../../utils/axiosConfig';

export const getFilms = async (page:number)=>{
    try{
        // updateAxiosUserInstanceFilm()
        console.log('films service')
        const axios = await updateAxiosUserInstanceFilm()
        const response = await axios.get(`/getAllFilm?page=${page}`);
        console.log('response films', response.data)

        return response.data;
    }
    catch (error:any){
        console.log('errorrrr',  error)
        throw error
    }
}

export const search = async (data:{query:string,page:number})=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()

        const response = await axios.get(`/getAllFilm?query=${data.query}&page=${data.page}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getA = async (data:{id:string})=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()
        console.log('getA',data.id)
        const response = await axios.get(`/getFilm/${data.id}`);
        console.log('getfilm',response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getListCategory = async ()=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()
        const response = await axios.get(`/getListCategory`);
        console.log('getcategory',response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getListCountry = async ()=>{
   try{
        const axios = await updateAxiosUserInstanceFilm()
        const response = await axios.get(`/getListCountry`);
        console.log('get list of country',response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const filter = async ({field="",data="",page=1})=>{
   try{
        const axios = await updateAxiosUserInstanceFilm()
        console.log('field-service',field)
        console.log('data-service',data)
        console.log('page-service',page)
        const response = await axios.get(`/filter?field=${field}&data=${data}&page=${page}`);
        console.log('get filter list',response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}



export const ratingFilm = async (data:{filmId:string,rating:number})=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()

        const response = await axios.patch(`/ratingFilm`,{filmId:data.filmId,rating:data.rating});
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        console.log('error rating',error)
        throw error.response.data ? error.response.data : error
    }
}

export const getRatings = async (data:{filmId:string})=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()

        const response = await axios.get(`/getRating/${data.filmId}`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}

export const getPageTotal = async ()=>{
    try{
        const axios = await updateAxiosUserInstanceFilm()



        const response = await axios.get(`/getPageTotal`);
        console.log(response.data)
        return response.data;
    }
    catch (error:any){
        throw error.response.data ? error.response.data : error
    }
}