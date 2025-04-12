import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Mood } from "../models/mood.model.js";
import { startOfMonth, endOfMonth } from 'date-fns';

// Log or update mood
const logMood = asyncHandler(async (req, res) => {
    const { mood, emoji } = req.body;
    const date = new Date().setHours(0, 0, 0, 0); // Today at midnight

    const moodEntry = await Mood.findOneAndUpdate(
        { 
            userId: req.user._id,
            date 
        },
        { mood, emoji },
        { 
            new: true,
            upsert: true 
        }
    );

    return res.status(200).json(
        new ApiResponse(200, moodEntry, "Mood logged")
    );
});

// Get monthly moods
const getMonthlyMoods = asyncHandler(async (req, res) => {
    const { month, year } = req.query;
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const moods = await Mood.find({
        userId: req.user._id,
        date: { $gte: startDate, $lte: endDate }
    });

    return res.status(200).json(
        new ApiResponse(200, moods, "Monthly moods retrieved")
    );
});

// Get mood statistics
const getMoodStats = asyncHandler(async (req, res) => {
    const stats = await Mood.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { 
            _id: "$mood", 
            count: { $sum: 1 },
            emoji: { $first: "$emoji" }
        }},
        { $project: { 
            mood: "$_id",
            emoji: 1,
            count: 1,
            _id: 0 
        }}
    ]);

    return res.status(200).json(
        new ApiResponse(200, stats, "Mood statistics")
    );
});

export { logMood, getMonthlyMoods, getMoodStats };