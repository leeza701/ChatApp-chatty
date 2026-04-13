import axios from "axios"

export const axiosInstance=axios.create({
    baseURL: import.meta.env.VITE_AI_URL || "http://localhost:8000",
    withCredentials:true,
     headers:{
        "content-type":"application/json"
    }
})

