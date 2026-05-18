import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';

// Initialize Gemini API
// Note: User needs to set GEMINI_API_KEY in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

// @desc    Chat with Gemini
// @route   POST /api/chat
// @access  Private
const chatWithGemini = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('Gemini API Key is not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `You are a helpful study assistant for a quiz platform. 
    The user is a student asking a question. 
    Keep your answer concise, helpful, and encouraging.
    
    Student Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to get response from AI');
  }
});

export { chatWithGemini };
