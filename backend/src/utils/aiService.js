import axios from 'axios';
import { ApiError } from './ApiError.js';

const THERAPY_PROMPT_TEMPLATE = `
You are a compassionate therapist. Follow these rules:
1. Start with empathy (e.g., "That sounds difficult")
2. Ask open-ended questions
3. Never give medical advice
4. For crisis messages, respond with: "I'm very concerned. Please contact the mental health helpline at +91 9152987821 (for India)."

User: {message}
`;

const RATE_LIMIT_MS = 1500; // 1.5s between requests
let lastRequest = 0;

export const getAIResponse = async (message) => {
  const now = Date.now();
  if (now - lastRequest < RATE_LIMIT_MS) {
    throw new ApiError(429, "Please wait a moment before sending another message");
  }
  lastRequest = now;

  try {
    const prompt = THERAPY_PROMPT_TEMPLATE.replace('{message}', message);

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HF_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 60,
          temperature: 0.3, // randomness
          do_sample: false // Disable multiple outputs
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const rawText = response.data[0]?.generated_text || "";
    const cleanText = filterResponse(rawText);
    return cleanText;
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    throw new ApiError(503, "The therapist is unavailable. Please try later.");
  }
};

const filterResponse = (text) => {
  const crisisPhrases = ["harm", "suicide", "kill", "die", "end it all"];
  if (crisisPhrases.some(phrase => text.toLowerCase().includes(phrase))) {
    return "I'm deeply concerned. Please contact the mental health helpline at +91 9152987821 (for India).";
  }

  const therapistBlocks = text.split("Therapist:");
  if (therapistBlocks.length < 2) return text.trim();
  const lastResponse = therapistBlocks[therapistBlocks.length - 1]
    .split("User:")[0]  // Remove any subsequent user parts
    .trim()
    .replace(/^:/, '')  // Remove leading colons if any
    .trim();
  
  console.log("Raw:", text, "Filtered:", lastResponse); 
  
  return lastResponse || "I'm here to listen. Could you share more about what you're experiencing?";
};