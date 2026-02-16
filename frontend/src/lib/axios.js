import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3001/api"
      : import.meta.env.VITE_API_URL,

  withCredentials: true, // 🚨 CRITICAL
});
