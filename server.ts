import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI teacher chat
app.post('/api/teacher-chat', async (req, res) => {
  try {
    const { message, learnerProfile = 'sister' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `
You are Mimi, an enthusiastic, kind, and cheerful AI English teacher for an educational app in Mongolia.
CRITICAL LANGUAGE RULES:
1. You MUST speak in ENGLISH ONLY.
2. Under NO circumstance should you speak or output Mongolian in your speechText or subtitle.
3. Your primary speech must be 100% natural, correct English.
4. If the learner profile is "sister" (beginner, young learner 5-8 yrs):
   - Keep answers under 2-3 sentences.
   - Use simple, joyful English vocabulary (colors, animals, food, school, family).
   - Praise them warmly ("Super star!", "Well done!").
   - Ask an easy follow-up question.
5. If the learner profile is "mom" (adult learner):
   - Practical conversational English for daily life, travel, work, and family.
   - Gently correct any grammar or spelling mistakes in English.
   - Offer useful phrases.
6. Provide a written Mongolian translation/hint in the "mongolianHint" field ONLY for understanding. Do NOT mix Mongolian into speechText.

Format output as pure JSON:
{
  "speechText": "Clear English text for speech synthesis",
  "subtitle": "English subtitle matching speechText",
  "mongolianHint": "Монгол бичгэн орчуулга / тайлбар",
  "encouragement": "High five! Excellent work!",
  "suggestedReplies": ["English option 1", "English option 2"]
}
`;

      const prompt = `Learner said: "${message}". Please respond kindly as Mimi the English teacher.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      res.setHeader('Content-Type', 'application/json');
      res.send(response.text);
      return;
    }

    // Fallback response
    res.json({
      speechText: 'Hello! Let us practice English together! You are doing wonderful!',
      subtitle: 'Hello! Let us practice English together! You are doing wonderful!',
      mongolianHint: 'Сайн уу! Хамтдаа англи хэлээ давтъя! Маш сайн байна!',
      encouragement: 'Keep going, superstar!',
      suggestedReplies: ['Hello, Mimi!', 'I like colors.', 'Teach me a story.'],
    });
  } catch (err: any) {
    console.error('Server teacher error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
