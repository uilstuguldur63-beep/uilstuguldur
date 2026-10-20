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
              const {
                message,
                learnerProfile = 'sister',
                learnerLevel = 2,
                languageMode = 'auto', // 'auto' | 'mn' | 'en'
                history = [],
              } = payload;

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
You are Mimi, a warm, patient, and highly intelligent bilingual AI Tutor for the educational app "Миний дүү бас ээж" (My Little Sister and Mom).

CORE PERSONALITY & BEHAVIOR:
1. BILINGUAL CAPABILITY (MONGOLIAN & ENGLISH):
   - You are completely fluent in both Mongolian (Монгол хэл, Кирилл цагаан толгой ө, ү үсгүүдийг маш зөв таньж хэрэглэнэ) and English.
   - If the user wrote in Mongolian or chosen language is "mn", respond naturally and helpfully in Mongolian.
   - If the user wrote in English or chosen language is "en", respond naturally and encouragingly in English.
   - If languageMode is "auto", detect user's language and respond in the matching language, or provide bilingual guidance when helpful.
   - You teach and answer questions about:
     * English language, vocabulary, grammar, sentences, and conversation.
     * Mathematics (тоо бодлого, нэмэх, хасах, үржүүлэх, хуваах, логик).
     * Mongolian language, 35 Cyrillic letters, the 7 basic vowels (эгшиг үсэг), spelling rules (зөв бичих дүрэм).
     * Word-making, puzzles, reading, and vocabulary building.

2. ABSOLUTELY NO REPETITIVE ANSWERS:
   - NEVER repeat the same greeting when a chat opens or when answering questions.
   - NEVER give identical answers to different questions.
   - ALWAYS read the conversation history to make your response relevant, fresh, and progressive.
   - If a student asks a follow-up or says they don't understand, DO NOT repeat the previous explanation! Explain the concept from a new angle using simpler words, step-by-step numbers, analogies, or concrete real-world examples.
   - Vary your praise and encouragement (do not say "Super star!" every time; use genuine, situational encouragement).

3. ADAPTATION TO SPECIFIC LEARNER PROFILE & LEVEL:
   - Profile "mom" (Starting Level 5, currently Level ${learnerLevel}):
     * Adult learner seeking practical everyday conversational English, grammar clarity, mental math, and intermediate word puzzles.
     * Provide slightly more challenging, sophisticated explanations with real-world usefulness.
     * Explain rules clearly (e.g. why a rule applies in Mongolian spelling or English verb tenses).
   - Profile "sister" (Starting Level 2, currently Level ${learnerLevel}):
     * Young learner (child) starting with gentle, friendly guidance.
     * Use short, easy sentences, friendly emojis, clear steps, and playful examples (animals, toys, fruit, colors).
     * Praise small efforts warmly and guide step by step without overwhelming.

4. OUTPUT FORMAT:
Output MUST be pure, valid JSON with this exact schema:
{
  "speechText": "Natural, direct spoken/chat response by Mimi in the target language (Mongolian or English)",
  "language": "mn" or "en",
  "subtitle": "Helpful translation or summary in the alternate language to assist learning",
  "mongolianHint": "A helpful hint or grammar/math tip in clear Mongolian",
  "encouragement": "Varied, non-repetitive encouraging sentence",
  "suggestedReplies": ["Dynamic suggestion 1", "Dynamic suggestion 2", "Dynamic suggestion 3"]
}
`;

                // Build contents array including previous history for deep context
                const contents: any[] = [];

                if (Array.isArray(history) && history.length > 0) {
                  // Pass up to 10 most recent turns for context
                  const recent = history.slice(-10);
                  for (const h of recent) {
                    const role = h.role === 'model' || h.role === 'assistant' ? 'model' : 'user';
                    const textContent = h.content || h.text || '';
                    if (textContent.trim()) {
                      contents.push({
                        role,
                        parts: [{ text: textContent }],
                      });
                    }
                  }
                }

                contents.push({
                  role: 'user',
                  parts: [
                    {
                      text: `Learner Profile: ${learnerProfile} (Level ${learnerLevel}). Language preference: ${languageMode}. Message: "${message}". Please respond thoughtfully and naturally as Mimi.`,
                    },
                  ],
                });

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents,
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

              // Dynamic fallback when API key is not present or offline
              const fallbackResponse = getFallbackTeacherResponse(
                message,
                learnerProfile,
                learnerLevel,
                languageMode,
                history
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(fallbackResponse));
            } catch (err: any) {
              console.error('Teacher API error:', err);
              const fallback = getFallbackTeacherResponse(
                'туслаач',
                'sister',
                2,
                'auto',
                []
              );
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

/**
 * Intelligent, varied, non-repetitive fallback responses for math, Mongolian, English, word puzzles
 */
function getFallbackTeacherResponse(
  userMsg: string,
  profile: string,
  level: number,
  langMode: string,
  history: any[] = []
) {
  const text = (userMsg || '').trim();
  const lower = text.toLowerCase();
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);
  const isMom = profile === 'mom';

  // Determine language to answer in
  const respondInMn =
    langMode === 'mn' || (langMode === 'auto' && (hasCyrillic || lower.includes('сайн') || lower.includes('тоо') || lower.includes('үсэг')));

  // Math queries
  const mathMatch = text.match(/(\d+)\s*([\+\-\*\/xX×÷])\s*(\d+)/);
  if (mathMatch) {
    const num1 = parseInt(mathMatch[1], 10);
    const op = mathMatch[2];
    const num2 = parseInt(mathMatch[3], 10);
    let ans = 0;
    let opName = '';
    let opNameEn = '';

    if (op === '+' || op === 'нэмэх') {
      ans = num1 + num2;
      opName = 'нэмэхэд';
      opNameEn = 'plus';
    } else if (op === '-' || op === 'хасах') {
      ans = num1 - num2;
      opName = 'хасахад';
      opNameEn = 'minus';
    } else if (op === '*' || op === 'x' || op === 'X' || op === '×' || op === 'үржүүлэх') {
      ans = num1 * num2;
      opName = 'үржүүлэхэд';
      opNameEn = 'multiplied by';
    } else {
      ans = num2 !== 0 ? Math.floor(num1 / num2) : 0;
      opName = 'хуваахад';
      opNameEn = 'divided by';
    }

    if (respondInMn) {
      return {
        speechText: `${num1} дээр ${num2}-ийг ${opName} хариу нь ${ans} гарна! Танд үүнтэй төстэй бодлого бодох уу?`,
        language: 'mn',
        subtitle: `${num1} ${opNameEn} ${num2} equals ${ans}! Would you like to solve another math problem?`,
        mongolianHint: `Тоо бодох дараалал: ${num1} ${op} ${num2} = ${ans}`,
        encouragement: 'Тооны бодлогоо маш хурдан, зөв бодож байна шүү!',
        suggestedReplies: [`${ans} + 5 хэд вэ?`, 'Өөр хэцүү бодлого өгөөч', 'Англи хэл рүү шилжих'],
      };
    } else {
      return {
        speechText: `That is great! ${num1} ${opNameEn} ${num2} is equal to ${ans}. Math is like solving exciting puzzles!`,
        language: 'en',
        subtitle: `${num1} ба ${num2}-ийн хариу ${ans} гарна. Математик бол сонирхолтой таавар юм!`,
        mongolianHint: `Math calculation: ${num1} ${op} ${num2} = ${ans}`,
        encouragement: 'Fantastic math thinking!',
        suggestedReplies: [`What is ${ans} plus 10?`, 'Can you give me a word problem?', 'Let us practice English colors.'],
      };
    }
  }

  // Mongolian Vowel / Alphabet queries
  if (lower.includes('эгшиг') || lower.includes('үсэг') || lower.includes('цагаан толгой') || lower.includes('vowel')) {
    if (respondInMn) {
      return {
        speechText:
          'Монгол хэлэнд үндсэн 7 эгшиг бий: А, Э, И, О, У, Ө, Ү. Эдгээр нь эр эгшиг (А, О, У), эм эгшиг (Э, Ө, Ү), саармаг эгшиг (И) гэж хуваагддаг. Та аль үсгийг илүү нарийвчлан сонирхмоор байна?',
        language: 'mn',
        subtitle: 'Mongolian has 7 basic vowels: A, E, I, O, U, Ö, Ü categorized into masculine, feminine and neutral.',
        mongolianHint: 'Эр эгшиг: А, О, У | Эм эгшиг: Э, Ө, Ү | Саармаг: И',
        encouragement: 'Цагаан толгойгоо хичээнгүй сурч байгаа танд баяр хүргэе!',
        suggestedReplies: ['Яагаад Я, Е, Ё, Ю эгшиг биш вэ?', 'А үсгээр эхэлсэн 3 үг хэлээч', 'Эр, эм эгшгийн дүрэм юу вэ?'],
      };
    } else {
      return {
        speechText:
          'In Mongolian, there are seven basic vowels: A, E, I, O, U, Ö, Ü. They follow vowel harmony rules! In English, our main vowels are A, E, I, O, U. Notice how fun they are to compare!',
        language: 'en',
        subtitle: 'Монгол хэлэнд 7 үндсэн эгшиг байдаг бол англи хэлэнд A, E, I, O, U гэсэн 5 эгшиг бий.',
        mongolianHint: 'Vowel comparison: Mongolian 7 vowels vs English 5 vowels',
        encouragement: 'Comparing languages makes you smarter every day!',
        suggestedReplies: ['What is vowel harmony?', 'Give me 3 English words with vowel A', 'Let us practice spelling'],
      };
    }
  }

  // Word-making / vocabulary queries
  if (lower.includes('үг') || lower.includes('word') || lower.includes('бүтээх') || lower.includes('spell')) {
    if (isMom) {
      return {
        speechText: respondInMn
          ? 'Үг бүтээх дасгалд үгийн үндэс, дагавар нөхцөлүүдийг зөв холбох нь чухал. Жишээлбэл "Эрдэм" гэдэг үгнээс "Эрдэмтэн", "Эрдэмтэй" гэсэн үг үүснэ. Англиар "Educate -> Education -> Educator" гэж хувирдагтай төстэй.'
          : 'Building vocabulary is all about prefixes, roots, and suffixes! For example, from "friend" we can make "friendly", "friendship", and "unfriendly". Which word shall we explore next?',
        language: respondInMn ? 'mn' : 'en',
        subtitle: respondInMn
          ? 'Word formation connects roots with suffixes, expanding your vocabulary quickly.'
          : 'Үг бүтээхдээ язгуур дээр залгавар залгаснаар үгийн сангаа хурдан тэлж болно.',
        mongolianHint: 'Үг бүтээх жишээ: Үндэс + Дагавар',
        encouragement: 'Таны үгийн баялаг өдөр бүр баяжиж байна!',
        suggestedReplies: ['"Success" гэдэг үгээр дасгал хийе', 'Монгол хэлний нийлмэл үгс', 'Англи өдөр тутмын хэллэг'],
      };
    } else {
      return {
        speechText: respondInMn
          ? 'Үг бүтээцгээе! «Н-О-М» гэж эвлүүлбэл «НОМ» 📖 болно! «А-Л-И-М» гэвэл амттай улаан «АЛИМ» 🍎 болно шүү дээ! Өөр ямар үг бүтээх үү?'
          : 'Let us make fun words! Put "C-A-T" together and we get "CAT" 🐱! Put "S-U-N" together and we get "SUN" ☀️! Can you spell your name?',
        language: respondInMn ? 'mn' : 'en',
        subtitle: respondInMn
          ? 'Let us build words with letters and pictures together!'
          : 'Үсгүүдээ холбоод өхөөрдөм шинэ үгс бүтээцгээе!',
        mongolianHint: 'Үсэг эвлүүлж үг бүтээх тоглоом',
        encouragement: 'Чи үнэхээр мундаг үсэг эвлүүлэгч шүү!',
        suggestedReplies: ['Нар гэдэг үгийг зуръя', 'Нохой гэж яаж бичих вэ?', 'Англиар муур гэж юу вэ?'],
      };
    }
  }

  // Conversational response tailored to learner level and language
  if (respondInMn) {
    if (isMom) {
      return {
        speechText: `Сайн байна уу! Би таны найдвартай багш Мими байна (Түвшин ${level}). Англи хэлний ярианы дасгал, дүрмийн тайлбар, тоо бодлого эсвэл үг бүтээх дасгалын алийг нь хиймээр байна вэ? Би ямар ч сэдвээр хамтран ажиллахад бэлэн байна.`,
        language: 'mn',
        subtitle: 'Hello! I am your bilingual tutor Mimi. What topic would you like to explore today?',
        mongolianHint: 'Түвшин 5+: Яриа, дүрэм, тоо, үг бүтээх',
        encouragement: 'Таны хичээл зүтгэл өдөр бүр гайхалтай үр дүн авчирч байна!',
        suggestedReplies: ['Дэлгүүрт ярих англи хэл заагаач', 'Математикийн бодлого бодъё', 'Зөв бичих дүрмээс асуух зүйл байна'],
      };
    } else {
      return {
        speechText: `Сайн уу, бяцхан дүү минь! Багш Мими нь чамдаа туслахад бэлэн байна (Түвшин ${level})! Гоё зурагтай үг сурах уу, тоо тоолох уу, эсвэл үсэг зурах уу? Аль нь сонирхолтой байна?`,
        language: 'mn',
        subtitle: 'Hello little learner! Would you like to practice pictures, numbers, or tracing letters?',
        mongolianHint: 'Түвшин 2+: Зурагт үг, тоо, үсэг зурах',
        encouragement: 'Хамтдаа өнөөдөр маш их шинэ зүйл сурна аа!',
        suggestedReplies: ['Өнгөнүүд англиар яаж хэлэх вэ?', 'Хөөрхөн амьтдын нэр сурмаар байна', '1-ээс 10 хүртэл тоолъё'],
      };
    }
  } else {
    if (isMom) {
      return {
        speechText: `Hello! I am delighted to learn with you at Level ${level}. We can practice practical everyday conversations, polish English grammar, or solve engaging word and math puzzles together. What topic would you like to start with?`,
        language: 'en',
        subtitle: `Сайн байна уу! Таны Түвшин ${level}-д тохируулан ярианы англи хэл, дүрэм, эсвэл бодлого хамтран дадлагажихад таатай байна.`,
        mongolianHint: 'Practical conversational English and problem solving',
        encouragement: 'Consistency is the true secret to fluency!',
        suggestedReplies: ['How do I introduce myself professionally?', 'Let us practice conversation for shopping', 'Explain past tense simply'],
      };
    } else {
      return {
        speechText: `Hi there, little star! Mimi is super happy to see you at Level ${level}! We can count colorful balloons, name sweet animals, or sing letter sounds! What is your favorite thing today?`,
        language: 'en',
        subtitle: `Сайн уу бяцхан одон минь! Мими чамтайгаа Түвшин ${level}-д хамт суралцахдаа маш их баяртай байна!`,
        mongolianHint: 'Friendly English learning with colors, animals and letters',
        encouragement: 'You are doing great, step by step!',
        suggestedReplies: ['I love blue and pink!', 'Show me cute animal words', 'Let us count together!'],
      };
    }
  }
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), teacherApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  };
});
