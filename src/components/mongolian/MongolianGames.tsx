import React, { useState } from 'react';
import {
  Gamepad2,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Star,
  Award,
} from 'lucide-react';
import { mongolianAlphabetList, basicVowelsList } from '../../data/mongolianAlphabetData';
import { MongolianLetter } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface MongolianGamesProps {
  onReward: (stars: number, coins: number) => void;
  onPlaySound: (text: string) => void;
  onNavigateToDrawing?: (letter: MongolianLetter) => void;
}

export const MongolianGames: React.FC<MongolianGamesProps> = ({
  onReward,
  onPlaySound,
  onNavigateToDrawing,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const games = [
    { id: 'find-letter', title: '1. Үсэг таних (Find the letter)', icon: '🔍', desc: 'Өгөгдсөн үсгийг олон үсгүүд дундаас танин олох.' },
    { id: 'match-picture', title: '2. Зураг ба үг (Match the picture)', icon: '🖼️', desc: 'Зургийг харгалзах монгол үгтэй холбох.' },
    { id: 'case-match', title: '3. Том, жижиг үсэг (Letter matching)', icon: '🔤', desc: 'Том үсгийг тохирох жижиг үсэгтэй холбох.' },
    { id: 'listen-choose', title: '4. Сонсоод таах (Listen & choose)', icon: '🎧', desc: 'Үсгийн дуудлагыг сонсоод зөв хариуг сонгох.' },
    { id: 'vowel-hunt', title: '5. Эгшиг үсэг агнах (Vowel hunt)', icon: '🎯', desc: 'Үндсэн 7 эгшиг үсгийг (А, Э, И, О, У, Ө, Ү) илрүүлэх.' },
    { id: 'word-complete', title: '6. Үг гүйцээх (Word completion)', icon: '🧩', desc: 'Үгийн дутуу үсгийг нөхөж бичих.' },
    { id: 'letter-order', title: '7. Үсгийн дараалал (Letter order)', icon: '🪜', desc: 'Цагаан толгойн зөв дарааллаар байрлуулах.' },
    { id: 'memory-cards', title: '8. Ой тогтоолт (Memory game)', icon: '🃏', desc: 'Үсэг ба холбогдох зургийн хосыг олох.' },
    { id: 'daily-practice', title: '9. Өдрийн дасгал (Daily practice)', icon: '⭐', desc: 'Өдөр бүрийн 5 асуулттай холимог дасгал.' },
  ];

  return (
    <div className="space-y-6">
      {selectedGameId ? (
        <div>
          <button
            onClick={() => setSelectedGameId(null)}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Бүх тоглоом руу буцах</span>
          </button>

          {selectedGameId === 'find-letter' && (
            <FindLetterGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'match-picture' && (
            <MatchPictureGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'case-match' && (
            <CaseMatchGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'listen-choose' && (
            <ListenChooseGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'vowel-hunt' && (
            <VowelHuntGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'word-complete' && (
            <WordCompleteGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'letter-order' && (
            <LetterOrderGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'memory-cards' && (
            <MongolianMemoryGame onReward={onReward} onPlaySound={onPlaySound} />
          )}

          {selectedGameId === 'daily-practice' && (
            <DailyPracticeGame onReward={onReward} onPlaySound={onPlaySound} />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                speechService.playSoundEffect('click');
                setSelectedGameId(g.id);
              }}
              className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 inline-block mb-3 group-hover:scale-110 transition-transform">
                  {g.icon}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {g.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {g.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600">
                <span>Тоглох</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 1. Find the Letter Game
const FindLetterGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const targets = [
    { target: mongolianAlphabetList[0], options: ['Б', 'А', 'В', 'Г'] },
    { target: mongolianAlphabetList[13], options: ['Н', 'М', 'Л', 'П'] },
    { target: mongolianAlphabetList[20], options: ['Т', 'Р', 'С', 'У'] },
    { target: mongolianAlphabetList[32], options: ['О', 'Э', 'Ө', 'Ү'] },
  ];

  const current = targets[step % targets.length];

  const handlePick = (char: string) => {
    setSelected(char);
    onPlaySound(char);
    if (char === current.target.upper) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      onReward(2, 5);
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-purple-600">Үе #{step + 1} / {targets.length}</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          «{current.target.upper}» үсгийг олоорой!
        </h3>
        <p className="text-xs text-slate-500">Жишээ үг: {current.target.exampleWord} {current.target.emoji}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`h-24 rounded-2xl text-3xl font-extrabold border-2 transition-all font-display ${
              selected === opt
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-900 dark:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isCorrect === true && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 font-bold text-sm">
          🎉 Маш сайн! Зөв үсгээ оллоо!
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setStep((p) => p + 1);
            setSelected(null);
            setIsCorrect(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах үсэг ➔
        </button>
      </div>
    </div>
  );
};

// 2. Match the Picture Game
const MatchPictureGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const rounds = [
    { emoji: '🍎', word: 'Алим', letter: 'А', options: ['Алим', 'Ном', 'Бөмбөг'] },
    { emoji: '🐎', word: 'Морь', letter: 'М', options: ['Үнэг', 'Морь', 'Заан'] },
    { emoji: '🛖', word: 'Гэр', letter: 'Г', options: ['Гэр', 'Ваар', 'Дэвтэр'] },
    { emoji: '🌸', word: 'Цэцэг', letter: 'Ц', options: ['Цэцэг', 'Чихэр', 'Сар'] },
  ];

  const current = rounds[step % rounds.length];

  const handlePick = (word: string) => {
    setSelected(word);
    onPlaySound(word);
    if (word === current.word) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      onReward(2, 5);
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-sky-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-sky-600">Зураг ба үг холбох #{step + 1}</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Энэ зургийг зөв монгол үгтэй нь тааруулна уу!
        </h3>
      </div>

      <div className="text-7xl p-4 bg-sky-50 dark:bg-sky-950/40 rounded-3xl inline-block shadow-inner">
        {current.emoji}
      </div>

      <div className="space-y-2 pt-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`w-full p-4 rounded-2xl text-sm font-bold border-2 transition-all ${
              selected === opt
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isCorrect === true && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 font-bold text-sm">
          🎉 Зөв! «{current.word}» нь «{current.letter}» үсгээр эхэлнэ!
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setStep((p) => p + 1);
            setSelected(null);
            setIsCorrect(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах зураг ➔
        </button>
      </div>
    </div>
  );
};

// 3. Case Match Game (Uppercase ➔ Lowercase)
const CaseMatchGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const pairs = [
    { upper: 'А', lower: 'а', options: ['а', 'б', 'о'] },
    { upper: 'Б', lower: 'б', options: ['в', 'б', 'д'] },
    { upper: 'Э', lower: 'э', options: ['о', 'е', 'э'] },
    { upper: 'У', lower: 'у', options: ['ү', 'у', 'х'] },
    { upper: 'Я', lower: 'я', options: ['я', 'ю', 'е'] },
  ];

  const current = pairs[step % pairs.length];

  const handlePick = (char: string) => {
    setSelected(char);
    onPlaySound(char);
    if (char === current.lower) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      onReward(2, 5);
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-purple-600">Том ба жижиг үсэг холбох</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          «{current.upper}» том үсгийн жижиг хувилбар аль нь вэ?
        </h3>
      </div>

      <div className="text-7xl font-extrabold text-purple-600 dark:text-purple-400 font-display py-2">
        {current.upper}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`h-20 rounded-2xl text-3xl font-extrabold border-2 transition-all font-display ${
              selected === opt
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setStep((p) => p + 1);
            setSelected(null);
            setIsCorrect(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах ➔
        </button>
      </div>
    </div>
  );
};

// 4. Listen & Choose Game
const ListenChooseGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const rounds = [
    { target: 'А', word: 'Алим', options: ['А', 'О', 'У'] },
    { target: 'М', word: 'Морь', options: ['Н', 'М', 'Л'] },
    { target: 'Н', word: 'Нар', options: ['М', 'Н', 'П'] },
    { target: 'Ц', word: 'Цэцэг', options: ['Ц', 'Ч', 'Ш'] },
  ];

  const current = rounds[step % rounds.length];

  const handlePlay = () => {
    onPlaySound(current.target);
  };

  const handlePick = (ans: string) => {
    setSelected(ans);
    if (ans === current.target) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      onReward(2, 5);
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-emerald-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-emerald-600">Сонсоод таах</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Товч дээр дарж дууг сонсоод зөв үсгийг дарна уу!
        </h3>
      </div>

      <button
        onClick={handlePlay}
        className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
        title="Сонсох"
      >
        <Volume2 className="w-10 h-10" />
      </button>

      <div className="grid grid-cols-3 gap-3 pt-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`h-20 rounded-2xl text-3xl font-extrabold border-2 transition-all font-display ${
              selected === opt
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setStep((p) => p + 1);
            setSelected(null);
            setIsCorrect(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах ➔
        </button>
      </div>
    </div>
  );
};

// 5. Vowel Hunt Game
const VowelHuntGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const lettersPool = [
    { char: 'А', isVowel: true },
    { char: 'Б', isVowel: false },
    { char: 'Э', isVowel: true },
    { char: 'Г', isVowel: false },
    { char: 'И', isVowel: true },
    { char: 'Д', isVowel: false },
    { char: 'О', isVowel: true },
    { char: 'Ж', isVowel: false },
    { char: 'У', isVowel: true },
    { char: 'З', isVowel: false },
    { char: 'Ө', isVowel: true },
    { char: 'М', isVowel: false },
    { char: 'Ү', isVowel: true },
    { char: 'Н', isVowel: false },
  ];

  const [foundVowels, setFoundVowels] = useState<string[]>([]);
  const totalVowels = 7; // А, Э, И, О, У, Ө, Ү

  const handleCharClick = (item: { char: string; isVowel: boolean }) => {
    onPlaySound(item.char);
    if (item.isVowel) {
      if (!foundVowels.includes(item.char)) {
        speechService.playSoundEffect('correct');
        const updated = [...foundVowels, item.char];
        setFoundVowels(updated);

        if (updated.length === totalVowels) {
          speechService.playSoundEffect('star');
          fireCelebrationConfetti();
          onReward(5, 15);
        }
      }
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-amber-100 dark:border-slate-700 shadow-md space-y-6 max-w-lg mx-auto text-center">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Үндсэн 7 эгшиг үсгийг агнаарай! 🎯
        </h3>
        <p className="text-xs text-slate-500">
          Олсон эгшиг: <span className="font-bold text-amber-600">{foundVowels.length}</span> / {totalVowels}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
        {lettersPool.map((item, idx) => {
          const isFound = foundVowels.includes(item.char);
          return (
            <button
              key={idx}
              onClick={() => handleCharClick(item)}
              className={`h-16 rounded-2xl text-2xl font-extrabold border-2 font-display transition-all ${
                isFound
                  ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-md scale-105'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              {item.char}
            </button>
          );
        })}
      </div>

      {foundVowels.length === totalVowels && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 font-bold text-sm">
          🎉 Баяр хүргэе! Үндсэн 7 эгшиг үсгийг (А, Э, И, О, У, Ө, Ү) бүгдийг нь оллоо! (+5 ⭐)
        </div>
      )}
    </div>
  );
};

// 6. Word Completion Game
const WordCompleteGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const words = [
    { full: 'Алим', display: '_лим', missing: 'А', emoji: '🍎', options: ['А', 'О', 'Э'] },
    { full: 'Морь', display: '_орь', missing: 'М', emoji: '🐎', options: ['Н', 'М', 'Л'] },
    { full: 'Нар', display: 'Н_р', missing: 'а', emoji: '☀️', options: ['а', 'э', 'о'] },
    { full: 'Гэр', display: 'Г_р', missing: 'э', emoji: '🛖', options: ['э', 'а', 'и'] },
  ];

  const current = words[step % words.length];

  const handlePick = (letter: string) => {
    setSelected(letter);
    if (letter === current.missing) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      onPlaySound(current.full);
      onReward(2, 5);
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-purple-600">Үг гүйцээх</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Дутуу үсгийг нөхөж бүтэн үг болгоно уу!
        </h3>
      </div>

      <div className="text-6xl mb-1">{current.emoji}</div>
      <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
        {current.display}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className={`h-16 rounded-2xl text-2xl font-extrabold border-2 transition-all font-display ${
              selected === opt
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-rose-50 border-rose-500 text-rose-800'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setStep((p) => p + 1);
            setSelected(null);
            setIsCorrect(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах ➔
        </button>
      </div>
    </div>
  );
};

// 7. Letter Order Game
const LetterOrderGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const targetSequence = ['А', 'Б', 'В', 'Г'];
  const [scrambled, setScrambled] = useState(() => ['В', 'А', 'Г', 'Б']);
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handlePick = (char: string, idx: number) => {
    onPlaySound(char);
    const updatedSel = [...selectedSequence, char];
    setSelectedSequence(updatedSel);

    const updatedScrambled = [...scrambled];
    updatedScrambled.splice(idx, 1);
    setScrambled(updatedScrambled);

    if (updatedSel.length === targetSequence.length) {
      if (updatedSel.join('') === targetSequence.join('')) {
        setIsCorrect(true);
        speechService.playSoundEffect('correct');
        fireCelebrationConfetti();
        onReward(3, 10);
      } else {
        setIsCorrect(false);
        speechService.playSoundEffect('wrong');
      }
    }
  };

  const handleReset = () => {
    setScrambled(['В', 'А', 'Г', 'Б']);
    setSelectedSequence([]);
    setIsCorrect(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-indigo-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <span className="text-xs font-bold text-indigo-600">Цагаан толгойн дараалал</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Үсгүүдийг цагаан толгойн зөв дарааллаар нь байрлуулна уу!
        </h3>
      </div>

      {/* Target slots */}
      <div className="flex justify-center gap-2 min-h-[64px] p-2 bg-slate-100 dark:bg-slate-700/50 rounded-2xl border-2 border-dashed border-indigo-200">
        {selectedSequence.map((char, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 font-extrabold text-2xl flex items-center justify-center shadow-sm border border-indigo-200 font-display"
          >
            {char}
          </div>
        ))}
      </div>

      {/* Remaining buttons */}
      <div className="flex justify-center gap-2">
        {scrambled.map((char, i) => (
          <button
            key={i}
            onClick={() => handlePick(char, i)}
            className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform font-display"
          >
            {char}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Дахин эхлэх</span>
        </button>
      </div>
    </div>
  );
};

// 8. Memory Game
const MongolianMemoryGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const basePairs = [
    { key: 'a', char: 'А', emoji: '🍎', word: 'Алим' },
    { key: 'b', char: 'Б', emoji: '⚽', word: 'Бөмбөг' },
    { key: 'm', char: 'М', emoji: '🐎', word: 'Морь' },
    { key: 'n', char: 'Н', emoji: '☀️', word: 'Нар' },
  ];

  interface MemCard {
    id: number;
    content: string;
    pairKey: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [cards, setCards] = useState<MemCard[]>(() => {
    const list: MemCard[] = [];
    basePairs.forEach((p, idx) => {
      list.push({ id: idx * 2, content: p.char, pairKey: p.key, isFlipped: false, isMatched: false });
      list.push({ id: idx * 2 + 1, content: p.emoji, pairKey: p.key, isFlipped: false, isMatched: false });
    });
    return list.sort(() => Math.random() - 0.5);
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCardClick = (id: number) => {
    if (selectedIds.length >= 2) return;
    const clicked = cards.find((c) => c.id === id);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    speechService.playSoundEffect('pop');
    const updated = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(updated);

    const newSel = [...selectedIds, id];
    setSelectedIds(newSel);

    if (newSel.length === 2) {
      const c1 = updated.find((c) => c.id === newSel[0])!;
      const c2 = updated.find((c) => c.id === newSel[1])!;

      if (c1.pairKey === c2.pairKey) {
        setTimeout(() => {
          speechService.playSoundEffect('correct');
          setCards((prev) =>
            prev.map((c) => (c.pairKey === c1.pairKey ? { ...c, isMatched: true } : c))
          );
          setSelectedIds([]);
          onReward(2, 5);
        }, 500);
      } else {
        setTimeout(() => {
          speechService.playSoundEffect('wrong');
          setCards((prev) =>
            prev.map((c) => (newSel.includes(c.id) ? { ...c, isFlipped: false } : c))
          );
          setSelectedIds([]);
        }, 800);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-4 max-w-md mx-auto text-center">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Монгол үсэг ба зургийн ой тогтоолт
      </h3>
      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCardClick(c.id)}
            className={`h-20 rounded-2xl flex items-center justify-center font-bold text-2xl font-display transition-all ${
              c.isFlipped || c.isMatched
                ? 'bg-purple-100 dark:bg-purple-950/60 border-2 border-purple-500 text-purple-900 dark:text-purple-100'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
            }`}
          >
            {c.isFlipped || c.isMatched ? c.content : '🇲🇳'}
          </button>
        ))}
      </div>
    </div>
  );
};

// 9. Daily Practice Game
const DailyPracticeGame: React.FC<{ onReward: (s: number, c: number) => void; onPlaySound: (t: string) => void }> = ({
  onReward,
  onPlaySound,
}) => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const questions = [
    { q: 'Монгол цагаан толгой нийт хэдэн үсэгтэй вэ?', options: ['26', '35', '42'], ans: '35' },
    { q: 'Үндсэн эгшиг хэд байдаг вэ?', options: ['5', '7', '10'], ans: '7' },
    { q: '«Ээж» гэдэг үг ямар үсгээр эхэлдэг вэ?', options: ['Э', 'А', 'И'], ans: 'Э' },
  ];

  const current = questions[step % questions.length];

  const handlePick = (choice: string) => {
    if (choice === current.ans) {
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      if (step < questions.length - 1) {
        setStep((p) => p + 1);
      } else {
        setDone(true);
        onReward(5, 15);
      }
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-5 max-w-md mx-auto text-center">
      <span className="text-xs font-bold text-purple-600">Өдрийн холимог сорил</span>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {current.q}
      </h3>

      <div className="space-y-2">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-purple-100 dark:hover:bg-purple-950/60 font-bold text-sm border border-slate-200 dark:border-slate-700"
          >
            {opt}
          </button>
        ))}
      </div>

      {done && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 font-bold text-sm">
          🎉 Баяр хүргэе! Өдрийн дасгалыг амжилттай дуусгалаа! (+5 ⭐, +15 🪙)
        </div>
      )}
    </div>
  );
};
