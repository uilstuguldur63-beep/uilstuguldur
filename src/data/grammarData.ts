import { GrammarLesson } from '../types';

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'gram-nouns',
    title: 'Nouns: Singular and Plural',
    titleMn: 'Нэр үг: Ганц ба Олон тоо',
    summaryMn: 'Нэг юмыг нэрлэхэд ганц тоо, олон юмыг нэрлэхэд үгийн ард -s эсвэл -es залгадаг.',
    ruleExplanationMn: 'Англи хэлэнд ганц тоон дээр "a / an" хэрэглэдэг (жишээ нь: a cat, an apple). Харин хоёр ба түүнээс дээш бол үгийн төгсгөлд "-s" нэмнэ (жишээ нь: two cats, three apples).',
    examples: [
      { en: 'one book', mn: 'нэг ном', audio: 'one book' },
      { en: 'three books', mn: 'гурван ном', audio: 'three books' },
      { en: 'a red apple', mn: 'улаан алим', audio: 'a red apple' },
      { en: 'two apples', mn: 'хоёр алим', audio: 'two apples' },
    ],
    quiz: [
      {
        question: 'What is the plural of "cat"?',
        options: ['cat', 'cats', 'cates'],
        correctIndex: 1,
        explanationMn: 'Cat гэдэг үгэнд -s залгаж cats болно.',
      },
      {
        question: 'Fill in: "I have ___ green apple."',
        options: ['a', 'an', 'two'],
        correctIndex: 0,
        explanationMn: 'Green гэсэн гийгүүлэгч авиагаар эхэлсэн тул "a" хэрэглэнэ.',
      },
    ],
  },
  {
    id: 'gram-pronouns',
    title: 'Personal Pronouns',
    titleMn: 'Биеийн төлөөний нэрс (I, You, He, She, It, We, They)',
    summaryMn: 'Хүн, юмсын нэрийг төлөөлөн хэрэглэгддэг үгс.',
    ruleExplanationMn: '• I = Би\n• You = Чи / Та\n• He = Тэр (эрэгтэй)\n• She = Тэр (эмэгтэй)\n• It = Тэр (амьтан, юмс)\n• We = Бид\n• They = Тэд',
    examples: [
      { en: 'He is my brother.', mn: 'Тэр бол миний ах/дүү.', audio: 'He is my brother.' },
      { en: 'She is my sister.', mn: 'Тэр бол миний эгч/дүү.', audio: 'She is my sister.' },
      { en: 'We are learning English.', mn: 'Бид англи хэл сурч байна.', audio: 'We are learning English.' },
    ],
    quiz: [
      {
        question: 'Which pronoun is used for a little girl?',
        options: ['He', 'She', 'It'],
        correctIndex: 1,
        explanationMn: 'Эмэгтэй хүн, охинд "She" хэрэглэнэ.',
      },
      {
        question: 'Which pronoun is used for a dog or pencil?',
        options: ['They', 'He', 'It'],
        correctIndex: 2,
        explanationMn: 'Амьтан болон эд зүйлд "It" хэрэглэнэ.',
      },
    ],
  },
  {
    id: 'gram-prepositions',
    title: 'Prepositions: On, Under, Next to',
    titleMn: 'Байршил заах үгс (Дээр, Дор, Хажууд)',
    summaryMn: 'Эд зүйлс хаана байгааг зааж хэлэхэд ашигладаг үгс.',
    ruleExplanationMn: '• On = дээр (The duck is on the table)\n• Under = дор / доороо (The duck is under the table)\n• Next to = хажууд (The duck is next to the table)\n• In = дотор (The pencil is in the bag)',
    examples: [
      { en: 'The book is on the desk.', mn: 'Ном ширээн дээр байна.', audio: 'The book is on the desk.' },
      { en: 'The cat is under the chair.', mn: 'Муур сандлын дор байна.', audio: 'The cat is under the chair.' },
      { en: 'Sit next to your friend.', mn: 'Найзынхаа хажууд суу.', audio: 'Sit next to your friend.' },
    ],
    quiz: [
      {
        question: 'Where is the apple if it touches the top of the table?',
        options: ['on the table', 'under the table', 'next to the table'],
        correctIndex: 0,
        explanationMn: 'Ширээний гадаргуу дээр байгаа үед "on" хэрэглэнэ.',
      },
    ],
  },
  {
    id: 'gram-comparatives',
    title: 'Comparatives (-er)',
    titleMn: 'Харьцуулсан тэмдэг нэр (-er)',
    summaryMn: 'Хоёр юмыг харьцуулахдаа тэмдэг нэрийн төгсгөлд -er залгадаг.',
    ruleExplanationMn: '• tall (өндөр) ➔ taller (илүү өндөр)\n• fast (хурдан) ➔ faster (илүү хурдан)\n• cold (хүйтэн) ➔ colder (илүү хүйтэн)\n• juicy (шүүслэг) ➔ juicier (илүү шүүслэг)',
    examples: [
      { en: 'A tree is taller than an elephant.', mn: 'Мод заанаас илүү өндөр.', audio: 'A tree is taller than an elephant.' },
      { en: 'A car is faster than a horse.', mn: 'Машин мориноос илүү хурдан.', audio: 'A car is faster than a horse.' },
      { en: 'Ice cream is colder than soup.', mn: 'Зайрмаг шөлнөөс илүү хүйтэн.', audio: 'Ice cream is colder than soup.' },
    ],
    quiz: [
      {
        question: 'Which word means "илүү хүйтэн"?',
        options: ['cold', 'colder', 'coldest'],
        correctIndex: 1,
        explanationMn: 'Cold гэсэн үгэнд -er залгаж colder болно.',
      },
    ],
  },
  {
    id: 'gram-questions',
    title: 'Questions: Do you like...? / Can you...?',
    titleMn: 'Асуулт ба Богино хариулт',
    summaryMn: 'Дуртай эсэх, чадах эсэхийг асууж, зөв хариулах хэлбэрүүд.',
    ruleExplanationMn: '• "Do you like apples?" ➔ "Yes, I do." / "No, I don\'t."\n• "Can you jump high?" ➔ "Yes, I can." / "No, I can\'t."\n• "What is your name?" ➔ "My name is..."',
    examples: [
      { en: 'Do you like bananas? Yes, I do.', mn: 'Чи гадилд дуртай юу? Тийм ээ, дуртай.', audio: 'Do you like bananas? Yes, I do.' },
      { en: 'Can you catch a ball? Yes, I can.', mn: 'Чи бөмбөг барьж чадах уу? Тийм ээ, чадна.', audio: 'Can you catch a ball? Yes, I can.' },
    ],
    quiz: [
      {
        question: 'How do you answer "Do you like milk?" positively?',
        options: ['Yes, I am.', 'Yes, I do.', 'Yes, I can.'],
        correctIndex: 1,
        explanationMn: '"Do you..." асуултад "Yes, I do" гэж хариулна.',
      },
    ],
  },
];
