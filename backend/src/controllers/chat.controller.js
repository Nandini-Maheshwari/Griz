import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";


const saveChat = asyncHandler(async (req, res) => {
    const { messages } = req.body;
    const userId = req.user._id;

    if (!messages || !Array.isArray(messages)) {
        throw new ApiError(400, "Messages array is required");
    }

    const chat = await Chat.findOneAndUpdate(
        { userId },
        { 
            messages,
            $set: { updatedAt: new Date() }
        },
        { 
            new: true,
            upsert: true //if no document is found, create new
        }
    );

    return res.status(200).json(
        new ApiResponse(200, chat, "Chat saved successfully")
    );
});

const getLatestChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ userId: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, chat || { messages: [] }, "Chat retrieved")
    );
});

const clearChat = asyncHandler(async (req, res) => {
    await Chat.deleteOne({ userId: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, {}, "Chat cleared")
    );
});

export { 
    saveChat, 
    getLatestChat, 
    clearChat 
};