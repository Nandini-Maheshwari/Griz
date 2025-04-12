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
import chatRouter from "./routes/chat.routes.js";
import moodRouter from "./routes/mood.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/mood", moodRouter);

export { app }