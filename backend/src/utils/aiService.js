import axios from 'axios';
import { ApiError } from './ApiError.js';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
const RATE_LIMIT_MS = 1500;
let lastRequest = 0;

const THERAPY_PROMPT_TEMPLATE = `
You are a compassionate therapist. Follow these rules:
1. Start with empathy (e.g., "That sounds difficult.")
2. Ask open-ended questions.
3. Never give medical advice.
4. If a crisis is detected (e.g., mentions of suicide or harm), respond with: 
"I'm very concerned. Please contact the mental health helpline at +91 9152987821 (India)."

User: {message}
`;

export const getAIResponse = async (message) => {
  const now = Date.now();
  if (now - lastRequest < RATE_LIMIT_MS) {
    throw new ApiError(429, 'Please wait a moment before sending another message.');
  }
  lastRequest = now;

  try {
    const prompt = THERAPY_PROMPT_TEMPLATE.replace('{message}', message);

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    const { data } = await axios.post(GEMINI_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!rawText) {
      throw new Error('No response received from Gemini.');
    }

    const cleanText = filterGeminiResponse(rawText);
    return cleanText;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new ApiError(503, 'The therapist is unavailable. Please try again later.');
  }
};

const filterGeminiResponse = (text) => {
  const crisisPhrases = ['harm', 'suicide', 'kill', 'die', 'end it all'];
  const lowerText = text.toLowerCase();

  if (crisisPhrases.some(phrase => lowerText.includes(phrase))) {
    return 'I\'m very concerned. Please contact the mental health helpline at +91 9152987821 (India).';
  }

  return text;
};