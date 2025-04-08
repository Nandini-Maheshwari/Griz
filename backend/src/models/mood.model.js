import mongoose, { Schema } from "mongoose";

const moodSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: () => new Date().setHours(0,0,0,0) //store data at midnight
        },
        mood: {
            type: String,
            enum: ['happy', 'sad', 'anxious', 'neutral', 'excited'],
            required: true 
        },
        emoji: {
            type: String,
            required: true 
        }
    }, 
    { 
        timestamps: true 
    }
);

// Prevent duplicate entries per user per day
// compound index -> an index on both userId and date fields together
moodSchema.index({ userId: 1, date: 1 }, { unique: true });

export default Mood = mongoose.model("Mood", moodSchema);