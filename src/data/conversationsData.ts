import { ConversationScenario } from '../types';

export const conversationScenarios: ConversationScenario[] = [
  {
    id: 'conv-intro',
    title: 'Meeting a Friend',
    titleMn: 'Найзтайгаа танилцах',
    situationMn: 'Сургууль дээр шинэ найзтайгаа уулзан мэндчилж, нэр, насаа солилцох яриа.',
    icon: '👋',
    dialogue: [
      {
        speaker: 'Mimi',
        english: 'Hello! Welcome to our school! What is your name?',
        mongolian: 'Сайн байна уу! Манай сургуульд тавтай морил! Чамайг хэн гэдэг вэ?',
        userOptions: [
          { text: 'Hello! My name is Sara.', isBest: true, feedbackEn: 'Wonderful and polite introduction!' },
          { text: 'My name.', isBest: false, feedbackEn: 'Try saying the complete sentence: "My name is Sara."' },
        ],
      },
      {
        speaker: 'Mimi',
        english: 'Nice to meet you! How old are you?',
        mongolian: 'Танилцсандаа таатай байна! Чи хэдэн настай вэ?',
        userOptions: [
          { text: 'I am seven years old.', isBest: true, feedbackEn: 'Great job! Perfect English.' },
          { text: 'Seven old.', isBest: false, feedbackEn: 'Say: "I am seven years old."' },
        ],
      },
      {
        speaker: 'Mimi',
        english: 'What is your favourite colour?',
        mongolian: 'Чиний хамгийн дуртай өнгө юу вэ?',
        userOptions: [
          { text: 'My favourite colour is blue.', isBest: true, feedbackEn: 'Blue is a peaceful and beautiful colour!' },
          { text: 'I like purple and yellow.', isBest: true, feedbackEn: 'Two lovely colours!' },
        ],
      },
      {
        speaker: 'Mimi',
        english: 'Let us be great friends and learn together!',
        mongolian: 'Хоёулаа сайн найзууд болоод хамтдаа суралцацгаая!',
      },
    ],
  },
  {
    id: 'conv-icecream',
    title: 'Buying an Ice Cream',
    titleMn: 'Зайрмаг захиалах',
    situationMn: 'Цэцэрлэгт хүрээлэнгийн зайд дуртай зайрмагаа сонгон эелдгээр худалдан авах.',
    icon: '🍦',
    dialogue: [
      {
        speaker: 'Ice Cream Seller',
        english: 'Hello there! Would you like a fresh ice cream today?',
        mongolian: 'Сайн байна уу! Өнөөдөр амтат шинэхэн зайрмаг авах уу?',
        userOptions: [
          { text: 'Yes, please! I would love an ice cream.', isBest: true, feedbackEn: 'Polite and clear request!' },
          { text: 'Give ice cream.', isBest: false, feedbackEn: 'Remember to always say "please"!' },
        ],
      },
      {
        speaker: 'Ice Cream Seller',
        english: 'Which flavour do you like? We have vanilla, chocolate, and strawberry.',
        mongolian: 'Ямар амтанд дуртай вэ? Ваниль, шоколад, гүзээлзгэнэтэй байгаа шүү.',
        userOptions: [
          { text: 'I would like chocolate, please.', isBest: true, feedbackEn: 'Chocolate is delicious!' },
          { text: 'Strawberry is my favourite!', isBest: true, feedbackEn: 'Fresh strawberry is wonderful.' },
        ],
      },
      {
        speaker: 'Ice Cream Seller',
        english: 'Here you go! One yummy ice cream for you.',
        mongolian: 'Май даа! Чамд зориулсан нэг амтат зайрмаг.',
        userOptions: [
          { text: 'Thank you very much! Have a nice day.', isBest: true, feedbackEn: 'Super friendly polite manners!' },
          { text: 'Thanks.', isBest: false, feedbackEn: 'Good, but "Thank you very much" is even better!' },
        ],
      },
    ],
  },
  {
    id: 'conv-classroom',
    title: 'In the Classroom',
    titleMn: 'Ангид хичээлийн хэрэглэл асуух',
    situationMn: 'Ширээний найзаасаа харандаа, шугам эелдгээр гуйж ашиглах яриа.',
    icon: '✏️',
    dialogue: [
      {
        speaker: 'Classmate',
        english: 'Hi! We are drawing a colorful garden today.',
        mongolian: 'Сайн уу! Өнөөдөр бид өнгөлөг цэцэрлэг зурж байгаа шүү дээ.',
        userOptions: [
          { text: 'May I borrow your green pencil, please?', isBest: true, feedbackEn: 'Perfect polite permission request!' },
          { text: 'Give green pencil.', isBest: false, feedbackEn: 'Use: "May I borrow your pencil, please?"' },
        ],
      },
      {
        speaker: 'Classmate',
        english: 'Sure! Here is the green pencil. It is very sharp.',
        mongolian: 'Тэгэлгүй яахав! Энэ ногоон харандаа. Маш хурц үзүүртэй шүү.',
        userOptions: [
          { text: 'Thank you! You are very kind.', isBest: true, feedbackEn: 'Excellent friendly communication.' },
        ],
      },
    ],
  },
];
