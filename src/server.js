import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Nhớ đuôi .js
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// Load biến môi trường
dotenv.config();

const app = express();

// Middleware quan trọng: Giúp Express hiểu được dữ liệu JSON
// Nếu thiếu dòng này, req.body sẽ bị undefined
app.use(express.json());
app.use(cookieParser()); // ← THÊM MỚI

// CORS
app.use(
  cors({
    credentials: true, // ← THÊM MỚI
    origin: process.env.FE_URL, // ← THÊM MỚI
  })
);
// Kết nối Database
connectDB();

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route gốc
// Mọi request bắt đầu bằng /api/users sẽ đi vào userRoutes
app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
