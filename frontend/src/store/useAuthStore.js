import {create } from "zustand"
import  {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
 const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:3001":"/";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
    try {
        const res=await axiosInstance.get("/auth/check");
        set({authUser:res.data})
        get().connectSocket()
    } catch (error) {
        set({authUser:null})
    }
    finally{
        set({isCheckingAuth:false});
    }
    },

    signup:async(data)=>{
        set({ isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfuly");
            set({authUser:res.data});
            get().connectSocket()
        }catch(error){
            const message = error?.response?.data?.message || "Signup failed";
            toast.error(message);
        }finally{
            set({isSigningUp:false});
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("logged in successfuly");
            get().connectSocket();

        } catch (error) {
            const message = error?.response?.data?.message || "Login failed";
            toast.error(message);
        }
        finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("logged out successfuly");
            get().disconnectSocket()
        } catch (error) {
            const message = error?.response?.data?.message || "Logout failed";
            toast.error(message);
        }
    },

     updatedProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("profile updated seccessfuly");
        }
        catch(error){
            console.log("error in updated profile ",error);
            const message = error?.response?.data?.message || "Update failed";
            toast.error(message);
        }
        finally{    
            set({isUpdatingProfile:false});
        }
     },


     connectSocket: () => {
    const { authUser } = get();
    if (!authUser || (get().socket && get().socket.connected)) return;

    const socket = io(BASE_URL, {
        query: { userId: authUser._id }, // ✅ Send userId for identification
        withCredentials: true, // ✅ Important for CORS
        transports: ["websocket"], // optional but improves reliability
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
    });

    set({ socket:socket });

    socket.on("getOnlineUsers", (userIds) => {
        set({onlineUsers:userIds})
    });
},
    // connectSocket:()=>{
    //     const { authUser } = get();
    //     if (!authUser || (get().socket && get().socket.connected)) return;
    //     const socket = io(BASE_URL)
            
    //     socket.connect();
    //     set({socket});
    // },
    
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },

}));
