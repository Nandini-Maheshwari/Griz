import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        messages: [
            {
                text: {
                    type: String,
                    required: true
                },
                sender: {
                    type: String,
                    enum: ["user", "ai"],
                    required: true 
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { 
        timestamps: true
    }
)

// Ensure only one chat per user
chatSchema.index({ userId: 1 }, { unique: true });

export const Chat = mongoose.model("Chat", chatSchema);