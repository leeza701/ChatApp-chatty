import {create} from "zustand";
export const useTheme=create((set)=>({
 theme:localStorage.getItem("Chat-theme")||"coffee",
 setTheme:(theme)=>set({theme}),
}));
