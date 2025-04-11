import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    saveChat,
    getLatestChat,
    clearChat
} from '../controllers/chat.controller.js';

const chatRouter = express.Router();

// Protected Routes (require JWT)
chatRouter.route("/")
    .post(verifyJWT, saveChat)
    .get(verifyJWT, getLatestChat)
    .delete(verifyJWT, clearChat);

export default chatRouter;