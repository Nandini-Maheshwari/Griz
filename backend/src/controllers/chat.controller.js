import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAIResponse } from "../utils/aiService.js";
import { Chat } from "../models/chat.model.js";

// Handle user messages and save to DB
const handleMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  // 1. Get AI response
  const aiReply = await getAIResponse(message);

  // 2. Save to MongoDB
  const updatedChat = await Chat.findOneAndUpdate(
    { 
        userId 
    },
    { 
      $push: {  
        messages: { 
          text: message, 
          sender: "user",
          timestamp: new Date() 
        } 
      } 
    },
    { 
        upsert: true, 
        new: true 
    }
  );

  // 3. Save AI reply
  updatedChat.messages.push({
    text: aiReply,
    sender: "ai",
    timestamp: new Date()
  });
  await updatedChat.save();

  // 4. Return response (excluding sensitive fields)
  const sanitizedChat = updatedChat.toObject();
  delete sanitizedChat.__v;

  return res.status(200).json(
    new ApiResponse(200, { reply: aiReply, chat: sanitizedChat }, "Message processed")
  );
});

// Get chat history
const getChatHistory = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user._id });
  return res.status(200).json(
    new ApiResponse(200, chat || { messages: [] }, "Chat history retrieved")
  );
});

export { handleMessage, getChatHistory };