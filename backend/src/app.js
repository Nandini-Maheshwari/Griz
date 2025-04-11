import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    orign: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter);

export { app }