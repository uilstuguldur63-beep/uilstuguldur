import React, { useState } from 'react';
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
  Zap,
} from 'lucide-react';
import { UserProfile, GameSessionResult } from '../../types';
import { speechService } from '../../services/speechService';
import { GameSession100 } from './GameSession100';
import {
  generateWordMaking100,
  generateMathRace100,
  generateListenChoose100,
  generatePictureWordMatch100,
  generateFindLetter100,
  GameQuestion100,
} from '../../data/gameQuestions100';
import { dictionaryWords } from '../../data/dictionaryData';

interface GameArcadeProps {
  activeProfile: UserProfile;
  onReward: (stars: number, coins: number) => void;
}

export const GameArcade: React.FC<GameArcadeProps> = ({ activeProfile, onReward }) => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const isMom = activeProfile.id === 'mom';

  const arcadeGames = [
    {
      id: 'word-maker',
      title: '1. Үг бүтээх лаборатори (Word Making Lab - 100)',
      icon: '🧩',
      desc: isMom
        ? 'Ээжид зориулсан нийлмэл үгс, үсэг эвлүүлэх, зөв бичих 100 сорил.'
        : 'Дүүд зориулсан хөөрхөн үсгүүдийг эвлүүлж үг бүтээх 100 сорил.',
      tag: '100 Асуулт',
      color: 'from-purple-50 to-white dark:from-slate-800 dark:to-slate-850 border-purple-200',
    },
    {
      id: 'math-race',
      title: '2. Хурдан бодох уралдаан (Math Race - 100)',
      icon: '🏎️',
      desc: isMom
        ? '2 оронтой тооны нэмэх, хасах, үржүүлэх, хуваах 100 бодлого.'
        : 'Энгийн тоо нэмэх, хасах 100 хөгжилтэй бодлого.',
      tag: '100 Бодлого',
      color: 'from-emerald-50 to-white dark:from-slate-800 dark:to-slate-850 border-emerald-200',
    },
    {
      id: 'feed-mimi',
      title: '3. Мимиг хооллох (Feed Mimi - 100)',
      icon: '🍎',
      desc: 'Асуултад зөв хариулж Мимид амттай жимс өгөх 100 үе шаттай тоглоом.',
      tag: '100 Асуулт',
      color: 'from-pink-50 to-white dark:from-slate-800 dark:to-slate-850 border-pink-200',
    },
    {
      id: 'listen-guess',
      title: '4. Сонсоод таах (Listen & Guess - 100)',
      icon: '🎧',
      desc: 'Багш Мимигийн дуудлагыг сонсоод зөв хариуг сонгох 100 сорил.',
      tag: '100 Асуулт',
      color: 'from-sky-50 to-white dark:from-slate-800 dark:to-slate-850 border-sky-200',
    },
    {
      id: 'memory',
      title: '5. Ой тогтоолтын карт (Memory Match - 100)',
      icon: '🃏',
      desc: 'Англи, монгол үг болон зургийг хосоор нь тааруулан олох 100 шат.',
      tag: '100 Хос',
      color: 'from-amber-50 to-white dark:from-slate-800 dark:to-slate-850 border-amber-200',
    },
  ];

  const getArcadeQuestions = (gameId: string): GameQuestion100[] => {
    switch (gameId) {
      case 'word-maker':
        return generateWordMaking100(activeProfile.id, activeProfile.level);
      case 'math-race':
        return generateMathRace100(isMom, activeProfile.level);
      case 'listen-guess':
        return generateListenChoose100();
      case 'feed-mimi': {
        // Feed mimi: 100 food & vocabulary questions
        const words = dictionaryWords;
        const qList: GameQuestion100[] = [];
        for (let i = 0; i < 100; i++) {
          const item = words[i % words.length];
          const wrong = words
            .filter((w) => w.id !== item.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((w) => w.word);
          const options = [item.word, ...wrong].sort(() => 0.5 - Math.random());

          qList.push({
            id: `fm-${i + 1}`,
            type: 'pick_option',
            prompt: `Мимид «${item.emoji} ${item.mongolianMeaning}» өгөхийн тулд зөв англи үгийг сонгоорой!`,
            promptMn: `Монгол утга: ${item.mongolianMeaning}`,
            imageEmoji: item.emoji,
            audioText: item.word,
            options,
            answer: item.word,
            hint: `Дуудлага: ${item.phonetic} · Англи: "${item.exampleEn}"`,
            explanation: `${item.emoji} бол англиар «${item.word}» (${item.mongolianMeaning}) юм!`,
          });
        }
        return qList;
      }
      case 'memory':
      default:
        return generatePictureWordMatch100();
    }
  };

  const selectedGame = arcadeGames.find((g) => g.id === selectedGameId);

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
            Бүх тоглоом 100 бүтэн асуулттай бөгөөд оноо, EXP болон алдаагаа хянах системтэй.
          </p>
        </div>
      </div>

      {selectedGameId && selectedGame ? (
        <GameSession100
          gameId={selectedGame.id}
          gameTitle={selectedGame.title}
          questions={getArcadeQuestions(selectedGame.id)}
          activeProfile={activeProfile}
          onBack={() => {
            speechService.playSoundEffect('click');
            setSelectedGameId(null);
          }}
          onFinish={(res) => {
            onReward(res.score, res.expEarned);
          }}
          onPlaySound={(t) => {
            if (/[\u0400-\u04FF]/.test(t)) {
              speechService.speakMongolian(t);
            } else {
              speechService.speakEnglish(t);
            }
          }}
        />
      ) : (
        /* Game Selection Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {arcadeGames.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                speechService.playSoundEffect('click');
                setSelectedGameId(game.id);
              }}
              className="cursor-pointer rounded-3xl p-5 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-slate-100 hover:border-purple-400 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-4xl p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/60 inline-block mb-3 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-purple-600">
                <span>100 Асуулт эхлэх</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
