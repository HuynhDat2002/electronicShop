
import axios from 'axios';
import { LoginValueProps, SignUpValueProps } from '../../types'
import { updateAxiosUserInstanceFilm, updateAxiosUserInstance } from '../../utils/axiosConfig';
import { NextRequest, NextResponse, userAgent } from 'next/server'
interface Token {
    user: { id: string };
    tokens: string;
}

export const getToken = (): Token => {
    if (typeof window !== "undefined" && localStorage.getItem("user") as string) {
        return JSON.parse(localStorage.getItem("user") as string) as Token;
    }
    return {
        user: { id: "" },
        tokens: ""
    };
};

// const base_url_user = "http://localhost/user/api"

// const createAxiosUserInstance = (token: Token) => {
//     return axios.create({
//         baseURL: base_url_user,
//         withCredentials: true,
//         headers: {
//             'x-client-id': token.user._id || '',
//             'authorization': token.tokens || '',
//             Accept: "application/json",
//         },
//     });
// };





const getEmail = (): string => {
    if (localStorage.getItem('email')) return localStorage.getItem('email') as string
    return ""
}


export const checkLogin = async () => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/checkLogin`);
        return response.data;
    }
    catch (error: any) {
        console.log(`error check login`, error)
        throw error.response.data
    }

}

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const { device } = userAgent(request)
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    url.searchParams.set('viewport', viewport)
    return NextResponse.rewrite(url)
  }

export const logIn = async (data: LoginValueProps) => {
    try {
        console.log('data login',data)
const axiosUser =await updateAxiosUserInstance()
        const response = await axiosUser.post(`/signIn`, {email:data.email,password:data.password,tokenCaptcha:data.tokenCaptcha});
        await localStorage.setItem('user', JSON.stringify(response.data.metadata));
        await updateAxiosUserInstance();  // Update the axios instance with new token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }
}

export const checkDevice = async (data: {email:string,password:string,tokenCaptcha:string}) => {
    try {
        console.log('data check',data)
const axiosUser =await updateAxiosUserInstance()

        await localStorage.setItem('email', data.email);
        const response = await axiosUser.post(`/checkDevice`, {email:data.email,password:data.password,tokenCaptcha:data.tokenCaptcha});
        // await localStorage.setItem('user', JSON.stringify(response.data.metadata));
        await updateAxiosUserInstance();  // Update the axios instance with new token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}


export const signUp = async () => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/signUp`);
        console.log('dataaa', response.data)
        await localStorage.setItem('user', JSON.stringify(response.data.metadata));
       await  updateAxiosUserInstance();  // Update the axios instance with new token
       await  updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        throw error.response.data
    }
}
export const logout = async () => {
    try {
        const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/logout`);
        await localStorage.removeItem("user");
        await localStorage.removeItem('userinfo')
        await updateAxiosUserInstance();  // Update the axios instance after removing token
        await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error logout`, error.response.data)
        throw error.response.data
    }

}

export const forgotPassword = async (data: { email: string }) => {
    try {
        const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/forgotPassword`, data);
       await localStorage.setItem('email', data.email)
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const verify = async (data: { otp: string }) => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const email = await getEmail()
        const response = await axiosUser.post(`/verifyOTP`, {
            email: email,
            otp: data.otp
        });
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const resetPassword = async (data: { password: string, confirmPassword: string }) => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const email = getEmail()
        const response = await axiosUser.post(`/resetPassword`, {
            email: email,
            newPassword: data.password
        });
        if (response)
            localStorage.removeItem('email')
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}


export const sendOTP = async (data: { name: string, email: string, password: string }) => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/sendOTP`, data);
        localStorage.setItem('email', data.email)

        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const changePassword = async (data: { password: string, newPassword: string }) => {
    try {
const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.post(`/changePassword`, data);
       await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const getUser = async () => {
    try {
      const axiosUser =await updateAxiosUserInstance()

        const response = await axiosUser.get(`/getUser`);
        if (localStorage.getItem('userinfo')) {
            await localStorage.removeItem('userinfo')
        }
       await localStorage.setItem('userinfo', JSON.stringify(response.data.metadata))
       await updateAxiosUserInstanceFilm()
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}

export const editUser = async (data: { name: string }) => {
    try {
        const axiosUser =await updateAxiosUserInstance()
        console.log('edit',data)
        const response = await axiosUser.patch(`/editUser`, data);
        if (localStorage.getItem('userinfo')) await localStorage.removeItem('userinfo')

         await localStorage.setItem('userinfo', JSON.stringify(response.data.metadata))
        return response.data;
    }
    catch (error: any) {
        console.log(`error login`, error.response.data)
        throw error.response.data
    }

}