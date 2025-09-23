import { updateAxiosUserInstanceFilm} from '../../utils/axiosConfig';
import { AxiosRequestConfig } from 'axios'

export const getCommentByFilm = async (data:{filmId:string})=>{
    try{
        const axios =await updateAxiosUserInstanceFilm()
        const response = await axios.get(`/comment/getAllCommentByFilm/${data.filmId}`);
        console.log('get comments by film')
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}

export const getCommentByParentId = async (data:{filmId:string,parentCommentId:string})=>{
    try{
       const axios =await updateAxiosUserInstanceFilm()

        const response = await axios.post(`/comment/getCommentByParentId`,{filmId:data.filmId,parentCommentId:data.parentCommentId});
        console.log('get comments by parent',response.data)
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}

export const createComment = async (data:{filmId:string,content:string,parentCommentId?:string})=>{
    try{
       await updateAxiosUserInstanceFilm()
       const axios =await updateAxiosUserInstanceFilm()

        const response = await axios.post(`/comment/createComment`,data);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}


export const editComment = async (data:{commentId:string,filmId:string,content:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
       const axios =await updateAxiosUserInstanceFilm()

        const response = await axios.patch(`/comment/editComment`,data);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}

export const deleteComment = async (data:{commentId:string,filmId:string})=>{
    try{
        await updateAxiosUserInstanceFilm()
       const axios =await updateAxiosUserInstanceFilm()

        const response = await axios.patch(`/comment/editComment`,data);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}



export const deconsteComment = async (data:{commentId:string,filmId:string})=>{

    try{
        await updateAxiosUserInstanceFilm()
        const axios =await updateAxiosUserInstanceFilm()
       
        const response = await axios.delete(`/comment/deleteComment?commentId=${data.commentId}&filmId=${data.filmId}`);
        return response.data;
    }
    catch (error:any){
        console.log('movie',error.response.data)
        throw error.response.data
    }
}




