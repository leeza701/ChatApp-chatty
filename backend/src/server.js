import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import connectDB  from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

import aiRoutes from "./routes/ai.route.js";

dotenv.config();

const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:
    process.env.NODE_ENV === "development" ? "http://localhost:5174" : process.env.CLIENT_URL,
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);



server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});