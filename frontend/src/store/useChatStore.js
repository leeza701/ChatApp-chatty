import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res=await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage:async(messageData)=>{
        const { selectedUser, messages } = get();
        if (!selectedUser?._id) {
            toast.error("Select a chat first");
            return;
        }
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            const newMessage = res?.data?.message || res?.data; // support both shapes
            set({ messages: [...messages, newMessage] });
        } catch (error) {
            toast.error(error?.response?.data?.message || "failed to send message");
        }
    },

    subscribeToMessages:()=>{
        const{selectedUser}=get()
        if(!selectedUser) return;
        const socket=useAuthStore.getState().socket;
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            set({
                message:[...get(),messages,newMessage],});
        });
    },

    unsubscribeFromMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    }, 
    //optimize this one later 
    setSelectedUser:(selectedUser)=>set({selectedUser })
}));