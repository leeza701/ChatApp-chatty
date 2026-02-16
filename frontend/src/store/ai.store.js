import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


const useAIStore = create((set) => ({
  messages: [],
  isLoading: false,

//   sendMessage: async (text) => {
//     const userMsg = { role: "user", text };

//     set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }));

//     // const res = await axios.post("/ai", { message: text });
//     const res = await axiosInstance.post("/ai", {
//   message: text,
// });


//     const aiMsg = { role: "ai", text: res.data.reply };

//     set((s) => ({
//       messages: [...s.messages, aiMsg],
//       isLoading: false,
//     }));
//   },
sendMessage: async (text) => {
  try {
    const userMsg = { role: "user", text };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isLoading: true,
    }));

    const res = await axiosInstance.post("/ai", {
      message: text,
    });

    const aiMsg = {
      role: "ai",
      text: res.data.reply,
    };

    set((s) => ({
      messages: [...s.messages, aiMsg],
      isLoading: false,
    }));
  } catch (error) {
    console.error("AI error:", error);

    set({ isLoading: false });
  }
}

}));

export default useAIStore;