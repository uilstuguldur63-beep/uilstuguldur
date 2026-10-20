import { mongolianAlphabetList, basicVowelsList } from './mongolianAlphabetData';
import { dictionaryWords } from './dictionaryData';
import { ProfileType } from '../types';

export interface GameQuestion100 {
  id: string;
  type: 'pick_option' | 'word_scramble' | 'missing_letter' | 'audio_pick' | 'math_solve';
  prompt: string;
  promptMn: string;
  audioText?: string;
  imageEmoji?: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
  // Specific for word making
  scrambledLetters?: string[];
  missingIndices?: number[];
  category?: string;
}

/**
 * Generate exactly 100 questions for Word Making Game
 * Specially tailored for Mom (Level 5+) vs Little Sister (Level 2+)
 */
export function generateWordMaking100(profileType: ProfileType, level: number): GameQuestion100[] {
  const isMom = profileType === 'mom';

  const sisterWords = [
    { word: 'НАР', emoji: '☀️', hint: 'Тэнгэрт гэрэлтэх алтан шар нар', en: 'Sun' },
    { word: 'НОМ', emoji: '📖', hint: 'Эрдэм номын ариун сан', en: 'Book' },
    { word: 'ЭЭЖ', emoji: '👩', hint: 'Энэрэл хайрын эзэн хайрт ээж', en: 'Mom' },
    { word: 'АЛИМ', emoji: '🍎', hint: 'Амттай улаан жимс', en: 'Apple' },
    { word: 'МУУР', emoji: '🐱', hint: 'Мяу мяу гэдэг хөөрхөн амьтан', en: 'Cat' },
    { word: 'НОХОЙ', emoji: '🐶', hint: 'Хүний үнэнч найз', en: 'Dog' },
    { word: 'ГЭР', emoji: '🛖', hint: 'Монгол түмний өргөө', en: 'Ger' },
    { word: 'УУЛ', emoji: '🏔️', hint: 'Өндөр сүрлэг хайрхан', en: 'Mountain' },
    { word: 'ЦАГ', emoji: '⏰', hint: 'Цаг хугацааг заагч', en: 'Clock' },
    { word: 'ӨДӨР', emoji: '🌤️', hint: 'Нартай гэгээлэг өдөр', en: 'Day' },
    { word: 'САР', emoji: '🌙', hint: 'Шөнийн тэнгэрийн саран', en: 'Moon' },
    { word: 'ЦЭЦЭГ', emoji: '🌸', hint: 'Анхилуун сайхан цэцэг', en: 'Flower' },
    { word: 'ШУВУУ', emoji: '🐦', hint: 'Тэнгэрт нисдэг далавчит шувуухай', en: 'Bird' },
    { word: 'ЗАГАС', emoji: '🐟', hint: 'Усанд сэлдэг амьтан', en: 'Fish' },
    { word: 'БӨМБӨГ', emoji: '⚽', hint: 'Өнхөрдөг дугуй бөмбөг', en: 'Ball' },
    { word: 'СҮҮ', emoji: '🥛', hint: 'Цагаан идээ, шимт сүү', en: 'Milk' },
    { word: 'ОДОН', emoji: '⭐', hint: 'Тэнгэрийн тод одон', en: 'Star' },
    { word: 'МАШИН', emoji: '🚗', hint: 'Хурдан давхидаг тэрэг', en: 'Car' },
    { word: 'ШИРЭЭ', emoji: '🪑', hint: 'Хичээл хийдэг ширээ', en: 'Desk' },
    { word: 'БААВГАЙ', emoji: '🐻', hint: 'Ойн хүчирхэг баавгай', en: 'Bear' },
    { word: 'ҮНЭГ', emoji: '🦊', hint: 'Овжин шар үнэг', en: 'Fox' },
    { word: 'МОД', emoji: '🌳', hint: 'Ногоон навчит мод', en: 'Tree' },
    { word: 'ТУУЛАЙ', emoji: '🐰', hint: 'Хөөрхөн цагаан туулай', en: 'Rabbit' },
    { word: 'ХОНЬ', emoji: '🐑', hint: 'Таван хошуу малын нэг', en: 'Sheep' },
    { word: 'МОРЬ', emoji: '🐎', hint: 'Хийморьлог хүлэг морь', en: 'Horse' },
  ];

  const momWords = [
    { word: 'СУРГУУЛЬ', emoji: '🏫', hint: 'Эрдэм мэдлэг олгох газар', en: 'School' },
    { word: 'БОЛОВСРОЛ', emoji: '🎓', hint: 'Насан туршийн үнэт баялаг', en: 'Education' },
    { word: 'ГЭР БҮЛ', emoji: '👨‍👩‍👧', hint: 'Аз жаргалын ундарга', en: 'Family' },
    { word: 'БАЙГАЛЬ', emoji: '🌲', hint: 'Эх дэлхий, ногоон орчин', en: 'Nature' },
    { word: 'ЭРДЭМТЭН', emoji: '🔬', hint: 'Шинжлэх ухааны бүтээлч хүн', en: 'Scientist' },
    { word: 'ХАРИЛЦАА', emoji: '💬', hint: 'Хүмүүсийн харилцан яриа', en: 'Communication' },
    { word: 'БАЯРЛАЛАА', emoji: '🙏', hint: 'Талархлын эелдэг үг', en: 'Thank you' },
    { word: 'ИРЭЭДҮЙ', emoji: '🚀', hint: 'Маргаашийн гэрэлт цаг үе', en: 'Future' },
    { word: 'НАЙРАМДАЛ', emoji: '🤝', hint: 'Нөхөрлөл, бат бэх холбоо', en: 'Friendship' },
    { word: 'АМЖИЛТ', emoji: '🏆', hint: 'Хичээл зүтгэлийн үр шим', en: 'Success' },
    { word: 'ЭРҮҮЛ МЭНД', emoji: '🩺', hint: 'Хүний хамгийн эрхэм баялаг', en: 'Health' },
    { word: 'МЭДЛЭГ', emoji: '💡', hint: 'Ухаан бодлыг тэлэгч хүч', en: 'Knowledge' },
    { word: 'ТУРШЛАГА', emoji: '📊', hint: 'Ажил амьдралаас хуримтлагдсан чадвар', en: 'Experience' },
    { word: 'АЯЛАЛ', emoji: '✈️', hint: 'Шинэ газар оронд зочлох', en: 'Travel' },
    { word: 'ҮҮРГЭВЧ', emoji: '🎒', hint: 'Эд зүйлсээ үүрэх цүнх', en: 'Backpack' },
    { word: 'ЦЭЦЭРЛЭГ', emoji: '🌷', hint: 'Цэцэгс алагласан хүрээлэн', en: 'Garden' },
    { word: 'ӨГЛӨӨНИЙ ЦАЙ', emoji: '🥐', hint: 'Өдрийн эхний шимт хоол', en: 'Breakfast' },
    { word: 'АЖИЛ ХЭРЭГ', emoji: '💼', hint: 'Мэргэжлийн үйл ажиллагаа', en: 'Business' },
    { word: 'ХӨРӨНГӨ ОРУУЛАЛТ', emoji: '📈', hint: 'Ирээдүйд чиглэсэн санхүүгийн алхам', en: 'Investment' },
    { word: 'ЧӨЛӨӨТ ЦАГ', emoji: '🎨', hint: 'Хүсэл сонирхлоо хөгжүүлэх цаг', en: 'Free time' },
  ];

  const pool = isMom ? momWords : sisterWords;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const item = pool[i % pool.length];
    const cycle = Math.floor(i / pool.length);
    const cleanWord = item.word.replace(/\s+/g, '');
    const letters = cleanWord.split('');

    // Scramble letters
    const scrambled = [...letters].sort(() => 0.5 - Math.random());
    // Avoid accidentally keeping same order if possible
    if (scrambled.join('') === cleanWord && scrambled.length > 2) {
      scrambled.reverse();
    }

    if (cycle % 2 === 0) {
      // Type 1: Scrambled letter puzzle
      questions.push({
        id: `wm-scramble-${i + 1}`,
        type: 'word_scramble',
        prompt: `Эвдэрсэн үсгүүдийг зөв дараалалд оруулан «${item.word}» үгийг бүтээгээрэй!`,
        promptMn: `Үсгүүд: [ ${scrambled.join(' · ')} ]`,
        imageEmoji: item.emoji,
        audioText: item.word,
        scrambledLetters: scrambled,
        answer: cleanWord,
        options: generateWordOptions(cleanWord, pool.map((p) => p.word.replace(/\s+/g, ''))),
        hint: `${item.hint}. Англиар: "${item.en}"`,
        explanation: `«${cleanWord}» үг нь зөв дарааллаараа: ${cleanWord} гэж бичигдэнэ.`,
        category: item.en,
      });
    } else {
      // Type 2: Missing letter exercise
      const missingIndex = Math.min(letters.length - 1, (i % (letters.length - 1)) + 1);
      const missingChar = letters[missingIndex];
      const masked = letters.map((c, idx) => (idx === missingIndex ? '_' : c)).join(' ');

      const optPool = isMom
        ? ['А', 'Э', 'И', 'О', 'У', 'Ө', 'Ү', 'Ь', 'Ы', 'Ъ', 'Л', 'Р', 'Н', 'М', 'Д', 'Т']
        : ['А', 'Э', 'И', 'О', 'У', 'Ө', 'Ү', 'Н', 'Р', 'М', 'Л'];
      const wrongOpts = optPool.filter((c) => c !== missingChar).sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [missingChar, ...wrongOpts].sort(() => 0.5 - Math.random());

      questions.push({
        id: `wm-missing-${i + 1}`,
        type: 'missing_letter',
        prompt: `Дутуу үсгийг нөхөж үгийг бүтээгээрэй: ${masked}`,
        promptMn: `Жишээ: ${item.hint}`,
        imageEmoji: item.emoji,
        audioText: item.word,
        options,
        answer: missingChar,
        hint: `Бүтэн үг нь: «${item.word}» (${item.en})`,
        explanation: `«${item.word}» үгийн дутуу үсэг нь «${missingChar}» юм.`,
        category: item.en,
      });
    }
  }

  return questions;
}

function generateWordOptions(correct: string, wordList: string[]): string[] {
  const others = wordList.filter((w) => w !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
  return [correct, ...others].sort(() => 0.5 - Math.random());
}

/**
 * Generate exactly 100 questions for Find Letter Game
 */
export function generateFindLetter100(): GameQuestion100[] {
  const letters = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const target = letters[i % letters.length];
    const isUpper = i % 2 === 0;
    const char = isUpper ? target.upper : target.lower;

    // 3 distractor letters
    const distractors = letters
      .filter((l) => l.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((l) => (isUpper ? l.upper : l.lower));

    const options = [char, ...distractors].sort(() => 0.5 - Math.random());

    questions.push({
      id: `fl-${i + 1}`,
      type: 'pick_option',
      prompt: `«${char}» үсгийг таньж сонгоорой!`,
      promptMn: `Жишээ үг: ${target.exampleWord} ${target.emoji} (${target.exampleWordTranslationEn})`,
      imageEmoji: target.emoji,
      audioText: target.upper,
      options,
      answer: char,
      hint: `${target.nameMn} · Дуудлага: [${target.pronunciationMn}]`,
      explanation: `Зөв хариу бол «${char}» үсэг юм. Жишээ үг: ${target.exampleWord}.`,
    });
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Picture & Word Match
 */
export function generatePictureWordMatch100(): GameQuestion100[] {
  const items = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const target = items[i % items.length];
    const otherWords = items
      .filter((it) => it.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((it) => it.exampleWord);

    const options = [target.exampleWord, ...otherWords].sort(() => 0.5 - Math.random());

    questions.push({
      id: `pwm-${i + 1}`,
      type: 'pick_option',
      prompt: `Зурагт тохирох зөв үгийг сонгоно уу:`,
      promptMn: `Зураг: ${target.emoji} (${target.exampleWordTranslationEn})`,
      imageEmoji: target.emoji,
      audioText: target.exampleWord,
      options,
      answer: target.exampleWord,
      hint: `Энэ үг нь «${target.upper}» үсгээр эхэлнэ. Англиар: ${target.exampleWordTranslationEn}`,
      explanation: `${target.emoji} бол «${target.exampleWord}» юм!`,
    });
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Case Match (Upper <-> Lower)
 */
export function generateCaseMatch100(): GameQuestion100[] {
  const letters = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const target = letters[i % letters.length];
    const toLower = i % 2 === 0;

    const promptText = toLower
      ? `Том «${target.upper}» үсгийн жижиг хэлбэрийг ол:`
      : `Жижиг «${target.lower}» үсгийн том хэлбэрийг ол:`;

    const answer = toLower ? target.lower : target.upper;
    const wrongOptions = letters
      .filter((l) => l.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((l) => (toLower ? l.lower : l.upper));

    const options = [answer, ...wrongOptions].sort(() => 0.5 - Math.random());

    questions.push({
      id: `cm-${i + 1}`,
      type: 'pick_option',
      prompt: promptText,
      promptMn: `Үсэг: ${target.nameMn}`,
      audioText: target.upper,
      imageEmoji: target.emoji,
      options,
      answer,
      hint: `${target.nameMn} (${target.exampleWord})`,
      explanation: `«${target.upper}» үсгийн хос нь «${target.lower}» юм.`,
    });
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Listen & Choose
 */
export function generateListenChoose100(): GameQuestion100[] {
  const letters = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const target = letters[i % letters.length];
    const distractors = letters
      .filter((l) => l.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((l) => l.upper);

    const options = [target.upper, ...distractors].sort(() => 0.5 - Math.random());

    questions.push({
      id: `lc-${i + 1}`,
      type: 'audio_pick',
      prompt: `Сонсох товчийг дарж авиаг сонсоод зөв үсгийг таана уу:`,
      promptMn: `🔊 Сонсоод тохирох үсгийг сонгоорой`,
      audioText: target.upper,
      imageEmoji: '🎧',
      options,
      answer: target.upper,
      hint: `Дуудлага: [${target.pronunciationMn}] · Үг: ${target.exampleWord}`,
      explanation: `Та «${target.upper}» үсгийн дуудлагыг зөв таалаа!`,
    });
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Vowel Hunt & Classification
 */
export function generateVowelHunt100(): GameQuestion100[] {
  const basic = basicVowelsList; // 7 basic
  const all = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const cycle = i % 4;

    if (cycle === 0) {
      // Find basic vowel among consonants
      const target = basic[i % basic.length];
      const consonants = all.filter((l) => !l.isBasicVowel).sort(() => 0.5 - Math.random()).slice(0, 3).map((l) => l.upper);
      const options = [target.upper, ...consonants].sort(() => 0.5 - Math.random());

      questions.push({
        id: `vh-${i + 1}`,
        type: 'pick_option',
        prompt: `Аль нь үндсэн 7 эгшгийн нэг вэ?`,
        promptMn: `Үндсэн 7 эгшиг: А, Э, И, О, У, Ө, Ү`,
        audioText: target.upper,
        imageEmoji: '🎯',
        options,
        answer: target.upper,
        hint: `Энэ эгшиг нь «${target.exampleWord}» үгэнд ордог.`,
        explanation: `«${target.upper}» бол Монгол цагаан толгойн үндсэн 7 эгшгийн нэг юм!`,
      });
    } else if (cycle === 1) {
      // Identify Masculine Vowel (А, О, У)
      const masc = ['А', 'О', 'У'];
      const target = masc[i % masc.length];
      const others = ['Э', 'Ө', 'Ү', 'Б', 'Г', 'Д'].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [target, ...others].sort(() => 0.5 - Math.random());

      questions.push({
        id: `vh-${i + 1}`,
        type: 'pick_option',
        prompt: `Аль нь чанга ЭР ЭГШИГ (А, О, У) вэ?`,
        promptMn: `Эр эгшиг: А, О, У`,
        audioText: target,
        imageEmoji: '🦁',
        options,
        answer: target,
        hint: `Эр эгшгүүд нь А, О, У юм.`,
        explanation: `«${target}» нь чанга, бахим эр эгшиг үсэг юм.`,
      });
    } else if (cycle === 2) {
      // Identify Feminine Vowel (Э, Ө, Ү)
      const fem = ['Э', 'Ө', 'Ү'];
      const target = fem[i % fem.length];
      const others = ['А', 'О', 'У', 'В', 'М', 'С'].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [target, ...others].sort(() => 0.5 - Math.random());

      questions.push({
        id: `vh-${i + 1}`,
        type: 'pick_option',
        prompt: `Аль нь зөөлөн ЭМ ЭГШИГ (Э, Ө, Ү) вэ?`,
        promptMn: `Эм эгшиг: Э, Ө, Ү`,
        audioText: target,
        imageEmoji: '🌸',
        options,
        answer: target,
        hint: `Эм эгшгүүд нь Э, Ө, Ү юм.`,
        explanation: `«${target}» нь зөөлөн, намуун эм эгшиг үсэг юм.`,
      });
    } else {
      // Identify Neutral Vowel (И) or Diphthong
      const options = ['И', 'А', 'Э', 'Б'].sort(() => 0.5 - Math.random());
      questions.push({
        id: `vh-${i + 1}`,
        type: 'pick_option',
        prompt: `Эр, эм үгэнд хоёуланд нь зохицдог СААРМАГ эгшиг аль нь вэ?`,
        promptMn: `Саармаг эгшиг: И`,
        audioText: 'И',
        imageEmoji: '⚖️',
        options,
        answer: 'И',
        hint: `Ирвэс, Тийм гэх мэт үгэнд ордог найрсаг эгшиг.`,
        explanation: `«И» бол Монгол хэлний цорын ганц саармаг эгшиг үсэг юм.`,
      });
    }
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Letter Sequence / Alphabet Order
 */
export function generateLetterOrder100(): GameQuestion100[] {
  const letters = mongolianAlphabetList;
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    const idx = i % (letters.length - 2);
    const first = letters[idx].upper;
    const second = letters[idx + 1].upper;
    const third = letters[idx + 2].upper;

    const askThird = i % 2 === 0;
    const prompt = askThird
      ? `Дарааллын дараагийн үсгийг ол: ${first}, ${second}, ___ ?`
      : `Дарааллын дундах үсгийг ол: ${first}, ___, ${third} ?`;

    const answer = askThird ? third : second;
    const wrong = letters
      .filter((l) => l.upper !== answer && l.upper !== first && l.upper !== second && l.upper !== third)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((l) => l.upper);

    const options = [answer, ...wrong].sort(() => 0.5 - Math.random());

    questions.push({
      id: `lo-${i + 1}`,
      type: 'pick_option',
      prompt,
      promptMn: `Цагаан толгойн 35 үсгийн дараалал`,
      audioText: answer,
      imageEmoji: '🪜',
      options,
      answer,
      hint: `Монгол цагаан толгойн #{letters.find((l) => l.upper === answer)?.order} дахь үсэг.`,
      explanation: `Зөв дараалал: ${first}, ${second}, ${third}!`,
    });
  }

  return questions;
}

/**
 * Generate exactly 100 questions for Math Race (Mom Level 5+ vs Sister Level 2+)
 */
export function generateMathRace100(isMom: boolean, level: number): GameQuestion100[] {
  const questions: GameQuestion100[] = [];

  for (let i = 0; i < 100; i++) {
    let num1 = 0;
    let num2 = 0;
    let op = '+';
    let ans = 0;

    if (isMom) {
      // Mom (Level 5+): 2-digit addition, subtraction, multiplication & division
      const opCycle = i % 4;
      if (opCycle === 0) {
        num1 = 15 + ((i * 7) % 70);
        num2 = 12 + ((i * 5) % 45);
        op = '+';
        ans = num1 + num2;
      } else if (opCycle === 1) {
        num1 = 50 + ((i * 6) % 50);
        num2 = 10 + ((i * 4) % 40);
        op = '-';
        ans = num1 - num2;
      } else if (opCycle === 2) {
        num1 = 3 + (i % 9);
        num2 = 4 + ((i * 2) % 9);
        op = '×';
        ans = num1 * num2;
      } else {
        const divisor = 2 + (i % 8);
        ans = 3 + (i % 12);
        num1 = divisor * ans;
        num2 = divisor;
        op = '÷';
      }
    } else {
      // Sister (Level 2+): friendly single & low double digits (1-20)
      const opCycle = i % 2;
      if (opCycle === 0) {
        num1 = 1 + (i % 10);
        num2 = 1 + ((i * 3) % 9);
        op = '+';
        ans = num1 + num2;
      } else {
        num1 = 5 + (i % 12);
        num2 = 1 + (i % 5);
        if (num2 >= num1) num2 = 1;
        op = '-';
        ans = num1 - num2;
      }
    }

    const wrong1 = ans + (i % 2 === 0 ? 1 : 2);
    const wrong2 = Math.max(0, ans - (i % 2 === 0 ? 2 : 1));
    const wrong3 = ans + 5;
    const options = [String(ans), String(wrong1), String(wrong2), String(wrong3)]
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .slice(0, 4)
      .sort(() => 0.5 - Math.random());

    questions.push({
      id: `math-${i + 1}`,
      type: 'math_solve',
      prompt: `${num1} ${op} ${num2} = ?`,
      promptMn: `${num1} дээр ${num2}-ийг ${op === '+' ? 'нэмбэл' : op === '-' ? 'хасвал' : op === '×' ? 'үржүүлбэл' : 'хуваавал'} хэд вэ?`,
      imageEmoji: '➕',
      audioText: `${num1} ${op === '+' ? 'нэмэх нь' : op === '-' ? 'хасах нь' : op === '×' ? 'үржүүлэх нь' : 'хуваах нь'} ${num2}`,
      options,
      answer: String(ans),
      hint: `Тооцоолох арга: ${num1} ${op} ${num2}`,
      explanation: `${num1} ${op} ${num2} = ${ans} гарна!`,
    });
  }

  return questions;
}
