import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function teacherApiPlugin(): Plugin {
  return {
    name: 'teacher-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/teacher-chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body || '{}');
              const { message, learnerProfile = 'sister', history = [] } = payload;

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

                const prompt = `Learner said: "${message}". Please respond kindly as Mimi the English teacher. Keep it supportive and fun!`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                  config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.7,
                  },
                });

                const rawText = response.text || '{}';
                res.setHeader('Content-Type', 'application/json');
                res.end(rawText);
                return;
              }

              // Resilient fallback when API key is not present
              const fallbackResponse = getFallbackTeacherResponse(message, learnerProfile);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(fallbackResponse));
            } catch (err: any) {
              console.error('Teacher API error:', err);
              const fallback = getFallbackTeacherResponse('hello', 'sister');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(fallback));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

function getFallbackTeacherResponse(userMsg: string, profile: string) {
  const lower = (userMsg || '').toLowerCase();

  if (profile === 'sister') {
    if (lower.includes('blue') || lower.includes('red') || lower.includes('color') || lower.includes('yellow')) {
      return {
        speechText: 'I love colors! Blue and yellow are so bright and cheerful. What animal do you like?',
        subtitle: 'I love colors! Blue and yellow are so bright and cheerful. What animal do you like?',
        mongolianHint: 'Би өнгөнд маш дуртай! Цэнхэр, шар өнгө үнэхээр цовоо сэргэлэн харагддаг. Чи ямар амьтанд дуртай вэ?',
        encouragement: 'Great job naming your favorite color!',
        suggestedReplies: ['I like cats.', 'I like cute rabbits.', 'I like big elephants.'],
      };
    }
    if (lower.includes('cat') || lower.includes('dog') || lower.includes('animal') || lower.includes('rabbit')) {
      return {
        speechText: 'Animals are fantastic friends! Cats say meow, and dogs say woof. Can you jump like a happy rabbit?',
        subtitle: 'Animals are fantastic friends! Cats say meow, and dogs say woof. Can you jump like a happy rabbit?',
        mongolianHint: 'Амьтад бол гайхалтай сайн найзууд! Муур мяу, нохой ваав гэдэг. Чи баяртай туулай шиг үсэрч чадах уу?',
        encouragement: 'Super! You speak wonderful English!',
        suggestedReplies: ['Yes, I can jump!', 'I have a little cat.', 'Let us count to ten.'],
      };
    }
    return {
      speechText: 'Hello my sweet friend! I am Mimi, your English teacher. Let us learn and have fun together today!',
      subtitle: 'Hello my sweet friend! I am Mimi, your English teacher. Let us learn and have fun together today!',
      mongolianHint: 'Сайн уу, хайрт найз минь! Би бол чиний англи хэлний багш Мими. Өнөөдөр хоёулаа хамтдаа сурч, хөгжилдөцгөөе!',
      encouragement: 'Welcome! You are ready to learn!',
      suggestedReplies: ['Hello, Mimi!', 'I am ready to learn.', 'What is our first lesson?'],
    };
  }

  // Mom profile
  if (lower.includes('market') || lower.includes('shop') || lower.includes('buy') || lower.includes('price')) {
    return {
      speechText: 'Shopping conversations are very practical. You can ask: "How much does this cost?" or "May I pay by card, please?" Practice saying: "Excuse me, where is the fresh fruit section?"',
      subtitle: 'Shopping conversations are very practical. You can ask: "How much does this cost?" or "May I pay by card, please?" Practice saying: "Excuse me, where is the fresh fruit section?"',
      mongolianHint: 'Дэлгүүрт хэрэглэгддэг яриа маш практик ач холбогдолтой. "Энэ ямар үнэтэй вэ?" эсвэл "Картаар төлж болох уу?" гэж асууж дадаарай.',
      encouragement: 'Practical everyday English mastered step-by-step!',
      suggestedReplies: ['How much is this loaf of bread?', 'Can you help me find this item?', 'Thank you for your assistance.'],
    };
  }

  return {
    speechText: 'Hello! I am delighted to practice conversational English with you. Today we can practice everyday conversations, travel vocabulary, or grammar. What would you like to explore first?',
    subtitle: 'Hello! I am delighted to practice conversational English with you. Today we can practice everyday conversations, travel vocabulary, or grammar. What would you like to explore first?',
    mongolianHint: 'Сайн байна уу! Тантай хамт англиар ярианы дадлага хийхдээ баяртай байна. Өнөөдөр өдөр тутмын яриа, аялал, дүрэм дадлагажиж болно. Алинаас нь эхлэх вэ?',
    encouragement: 'Consistency is the key to mastering English!',
    suggestedReplies: ['Let us practice daily family conversations.', 'Can we review verb tenses?', 'Let us practice ordering food.'],
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), teacherApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

