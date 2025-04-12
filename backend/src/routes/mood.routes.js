import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    logMood,
    getMonthlyMoods,
    getMoodStats
} from '../controllers/mood.controller.js';

const moodRouter = express.Router();

// Mood logging/updating
moodRouter.route("/log")
    .post(verifyJWT, logMood); // POST /api/v1/mood/log

moodRouter.route("/:date") 
    .patch(verifyJWT, logMood); // PATCH /api/v1/mood/:date

// Mood retrieval
moodRouter.route("/monthly")
    .get(verifyJWT, getMonthlyMoods); // GET /api/v1/mood/monthly?month=04&year=2025

moodRouter.route("/stats")
    .get(verifyJWT, getMoodStats); // GET /api/v1/mood/stats

export default moodRouter;