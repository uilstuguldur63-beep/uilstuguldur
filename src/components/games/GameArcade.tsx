import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Award,
  ChevronRight,
  ArrowLeft,
  Heart,
  Clock,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface GameArcadeProps {
  activeProfile: UserProfile;
  onReward: (stars: number, coins: number) => void;
}

export const GameArcade: React.FC<GameArcadeProps> = ({ activeProfile, onReward }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎮</span>
            <span>Тоглоомын төв (Game Arcade)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Үг цээжлэх, ой тогтоолт, Мимиг хооллох, хурдан тоо бодох хөгжилтэй тоглоомууд.
          </p>
        </div>
      </div>

      {selectedGame ? (
        <div>
          <button
            onClick={() => {
              setSelectedGame(null);
              speechService.stop();
            }}
            className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Бүх тоглоом руу буцах</span>
          </button>

          {selectedGame === 'memory' && (
            <MemoryCardGame onReward={onReward} />
          )}

          {selectedGame === 'listen-guess' && (
            <ListenAndGuessGame onReward={onReward} />
          )}

          {selectedGame === 'feed-mimi' && (
            <FeedMimiGame onReward={onReward} />
          )}

          {selectedGame === 'addition-race' && (
            <AdditionRaceGame onReward={onReward} />
          )}
        </div>
      ) : (
        /* Game selection grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Memory Match */}
          <div
            onClick={() => {
              speechService.playSoundEffect('click');
              setSelectedGame('memory');
            }}
            className="cursor-pointer rounded-3xl p-5 bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-purple-100 hover:border-purple-400 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/60 inline-block mb-3 group-hover:scale-110 transition-transform">
                🃏
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Ой тогтоолтын карт (Memory Match)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Англи үг болон зургийг хосоор нь тааруулан олох сонгодог тоглоом.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-purple-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-purple-600">
              <span>Тоглох</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Listen & Guess */}
          <div
            onClick={() => {
              speechService.playSoundEffect('click');
              setSelectedGame('listen-guess');
            }}
            className="cursor-pointer rounded-3xl p-5 bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-sky-100 hover:border-sky-400 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/60 inline-block mb-3 group-hover:scale-110 transition-transform">
                🎧
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Сонсоод таа (Listen & Guess)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Багш Мими англи үг хэлэхэд зөв зургийг сонгох чадвар шалгах тоглоом.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-sky-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-sky-600">
              <span>Тоглох</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Feed Mimi */}
          <div
            onClick={() => {
              speechService.playSoundEffect('click');
              setSelectedGame('feed-mimi');
            }}
            className="cursor-pointer rounded-3xl p-5 bg-gradient-to-b from-pink-50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-pink-100 hover:border-pink-400 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl p-3 rounded-2xl bg-pink-100 dark:bg-pink-950/60 inline-block mb-3 group-hover:scale-110 transition-transform">
                🍎
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 transition-colors">
                Мимиг хооллох (Feed Mimi)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Англи эсвэл тооны асуултад зөв хариулж Мимид амттай жимс өгөх тоглоом.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-pink-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-pink-600">
              <span>Тоглох</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Addition Race */}
          <div
            onClick={() => {
              speechService.playSoundEffect('click');
              setSelectedGame('addition-race');
            }}
            className="cursor-pointer rounded-3xl p-5 bg-gradient-to-b from-emerald-50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-emerald-100 hover:border-emerald-400 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-4xl p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 inline-block mb-3 group-hover:scale-110 transition-transform">
                ⚡
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Хурдны нэмэлт (Addition Race)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Хугацаатай цээж тоо бодох хурдан дасгал.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Тоглох</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 1. Memory Match Game
const MemoryCardGame: React.FC<{ onReward: (stars: number, coins: number) => void }> = ({ onReward }) => {
  interface Card {
    id: number;
    content: string;
    type: 'word' | 'emoji';
    pairKey: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const basePairs = [
    { key: 'cat', word: 'Cat', emoji: '🐱' },
    { key: 'apple', word: 'Apple', emoji: '🍎' },
    { key: 'book', word: 'Book', emoji: '📖' },
    { key: 'duck', word: 'Duck', emoji: '🦆' },
    { key: 'sun', word: 'Sun', emoji: '☀️' },
    { key: 'car', word: 'Car', emoji: '🚗' },
  ];

  const generateShuffledCards = () => {
    const list: Card[] = [];
    basePairs.forEach((pair, idx) => {
      list.push({
        id: idx * 2,
        content: pair.word,
        type: 'word',
        pairKey: pair.key,
        isFlipped: false,
        isMatched: false,
      });
      list.push({
        id: idx * 2 + 1,
        content: pair.emoji,
        type: 'emoji',
        pairKey: pair.key,
        isFlipped: false,
        isMatched: false,
      });
    });
    return list.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<Card[]>(generateShuffledCards);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);

  const handleCardClick = (id: number) => {
    if (selectedIds.length >= 2) return;
    const clicked = cards.find((c) => c.id === id);
    if (!clicked || clicked.isFlipped || clicked.isMatched) return;

    speechService.playSoundEffect('pop');
    if (clicked.type === 'word') {
      speechService.speakEnglish(clicked.content);
    }

    const updated = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setCards(updated);

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const card1 = updated.find((c) => c.id === newSelected[0])!;
      const card2 = updated.find((c) => c.id === newSelected[1])!;

      if (card1.pairKey === card2.pairKey) {
        // Matched!
        setTimeout(() => {
          speechService.playSoundEffect('correct');
          setCards((prev) =>
            prev.map((c) =>
              c.pairKey === card1.pairKey ? { ...c, isMatched: true } : c
            )
          );
          setSelectedIds([]);
          const newTotal = matchesCount + 1;
          setMatchesCount(newTotal);

          if (newTotal === basePairs.length) {
            speechService.playSoundEffect('star');
            fireCelebrationConfetti();
            speechService.speakEnglish('Hooray! Memory cards all matched!');
            onReward(3, 10);
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          speechService.playSoundEffect('wrong');
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedIds([]);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setSelectedIds([]);
    setMatchesCount(0);
    speechService.playSoundEffect('click');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-5 max-w-xl mx-auto text-center">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
          Олсон хос: {matchesCount} / {basePairs.length}
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Дахин эхлэх</span>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCardClick(c.id)}
            className={`h-24 rounded-2xl flex items-center justify-center font-bold transition-all transform ${
              c.isFlipped || c.isMatched
                ? 'bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-400 text-purple-900 dark:text-purple-100 shadow-sm'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow hover:scale-105'
            }`}
          >
            {c.isFlipped || c.isMatched ? (
              <span className={c.type === 'emoji' ? 'text-4xl' : 'text-sm font-bold'}>
                {c.content}
              </span>
            ) : (
              <span className="text-2xl">⭐</span>
            )}
          </button>
        ))}
      </div>

      {matchesCount === basePairs.length && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-800 dark:text-emerald-300 font-bold text-sm">
          🎉 Баяр хүргэе! Бүх картуудыг амжилттай таалаа! (+3 ⭐, +10 🪙)
        </div>
      )}
    </div>
  );
};

// 2. Listen & Guess Game
const ListenAndGuessGame: React.FC<{ onReward: (stars: number, coins: number) => void }> = ({ onReward }) => {
  const rounds = [
    { targetWord: 'apple', prompt: 'Listen to the word and find it:', options: ['🍎', '🍌', '🚗', '🐱'], correctEmoji: '🍎' },
    { targetWord: 'duck', prompt: 'Listen and pick the duck:', options: ['🐶', '🦆', '🐘', '📖'], correctEmoji: '🦆' },
    { targetWord: 'pencil', prompt: 'Where is the pencil?', options: ['✂️', '✏️', '🥛', '🍞'], correctEmoji: '✏️' },
    { targetWord: 'tree', prompt: 'Which one is a tree?', options: ['🌲', '🌧️', '⭐', '🎈'], correctEmoji: '🌲' },
  ];

  const [roundIdx, setRoundIdx] = useState(0);
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const current = rounds[roundIdx % rounds.length];

  const playAudio = () => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(current.targetWord);
  };

  useEffect(() => {
    playAudio();
  }, [roundIdx]);

  const handlePick = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (emoji === current.correctEmoji) {
      setIsAnswered(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      speechService.speakEnglish(`Yes! ${current.targetWord}!`);
      onReward(2, 5);
    } else {
      setIsAnswered(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-sky-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
          Үе {roundIdx + 1} / {rounds.length}
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Англиар сонсоод зөв зургийг сонгоно уу!
        </h3>
      </div>

      <button
        onClick={playAudio}
        className="w-20 h-20 mx-auto rounded-3xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
        title="Англи үгийг сонсох"
      >
        <Volume2 className="w-10 h-10" />
      </button>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {current.options.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handlePick(emoji)}
            className={`h-24 rounded-2xl text-4xl flex items-center justify-center border-2 transition-all ${
              selectedEmoji === emoji
                ? isAnswered
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-rose-50 border-rose-500'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-sky-400'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            setRoundIdx((p) => p + 1);
            setIsAnswered(null);
            setSelectedEmoji(null);
          }}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
        >
          Дараах үг ➔
        </button>
      </div>
    </div>
  );
};

// 3. Feed Mimi Game
const FeedMimiGame: React.FC<{ onReward: (stars: number, coins: number) => void }> = ({ onReward }) => {
  const [mimiHappy, setMimiHappy] = useState(false);
  const [fedCount, setFedCount] = useState(0);

  const questions = [
    { q: 'What is 2 + 3?', options: [4, 5, 6], ans: 5, treat: '🍓' },
    { q: 'What color is the sun?', options: ['Blue', 'Yellow', 'Black'], ans: 'Yellow', treat: '🍎' },
    { q: 'What is 10 - 4?', options: [6, 7, 5], ans: 6, treat: '🧁' },
  ];

  const [qIdx, setQIdx] = useState(0);
  const currentQ = questions[qIdx % questions.length];

  const handleAnswer = (choice: any) => {
    if (choice === currentQ.ans) {
      speechService.playSoundEffect('correct');
      setMimiHappy(true);
      setFedCount((p) => p + 1);
      fireCelebrationConfetti();
      speechService.speakEnglish('Yummy! Thank you for the delicious treat!');
      onReward(2, 5);

      setTimeout(() => {
        setMimiHappy(false);
        setQIdx((p) => p + 1);
      }, 1500);
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-pink-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Мимиг амттанаар хооллох (Feed Mimi)
        </h3>
        <p className="text-xs text-slate-500">
          Өгсөн амттан: <span className="font-bold text-pink-600">{fedCount}</span> ширхэг
        </p>
      </div>

      {/* Mimi Eating Animation State */}
      <div className={`transition-transform duration-300 ${mimiHappy ? 'scale-110' : ''}`}>
        <div className="text-7xl mb-2">{mimiHappy ? '😋' : '🦉'}</div>
        <div className="text-sm font-bold text-pink-600">
          {mimiHappy ? 'Мими: "Маш амттай байна, баярлалаа!"' : 'Мими амттан идэхийг хүсэж байна!'}
        </div>
      </div>

      {/* Question */}
      <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 space-y-3">
        <div className="text-base font-bold text-slate-900 dark:text-white">
          {currentQ.q}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-800 font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-pink-100 shadow-sm active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Addition Race Game
const AdditionRaceGame: React.FC<{ onReward: (stars: number, coins: number) => void }> = ({ onReward }) => {
  const [score, setScore] = useState(0);
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(3);

  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
  };

  const currentAns = num1 + num2;

  const handlePick = (ans: number) => {
    if (ans === currentAns) {
      speechService.playSoundEffect('correct');
      setScore((p) => p + 1);
      fireCelebrationConfetti();
      onReward(1, 3);
      generateProblem();
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-emerald-100 dark:border-slate-700 shadow-md space-y-6 max-w-md mx-auto text-center">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-600">Хурдны дасгал</span>
        <span className="text-sm font-bold text-slate-800 dark:text-white">
          Оноо: <span className="text-emerald-600 tabular-nums">{score}</span>
        </span>
      </div>

      <div className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums py-4">
        {num1} + {num2} = ?
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[currentAns - 1, currentAns, currentAns + 2].map((opt) => (
          <button
            key={opt}
            onClick={() => handlePick(opt)}
            className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xl shadow-md active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
