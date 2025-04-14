import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { handleMessage, getChatHistory } from "../controllers/chat.controller.js";

const router = express.Router();

// Protected routes (require JWT)
router.route("/")
  .post(verifyJWT, handleMessage)    // POST /api/v1/chats
  .get(verifyJWT, getChatHistory);   // GET /api/v1/chats

export default router;