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
  Zap,
} from 'lucide-react';
import { mongolianAlphabetList, basicVowelsList } from '../../data/mongolianAlphabetData';
import { MongolianLetter, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { speechService } from '../../services/speechService';
import { GameSession100 } from '../games/GameSession100';
import {
  generateFindLetter100,
  generatePictureWordMatch100,
  generateCaseMatch100,
  generateListenChoose100,
  generateVowelHunt100,
  generateWordMaking100,
  generateLetterOrder100,
  generateMathRace100,
  GameQuestion100,
} from '../../data/gameQuestions100';

interface MongolianGamesProps {
  onReward: (stars: number, coins: number) => void;
  onPlaySound: (text: string) => void;
  onNavigateToDrawing?: (letter: MongolianLetter) => void;
  activeProfile?: UserProfile;
}

export const MongolianGames: React.FC<MongolianGamesProps> = ({
  onReward,
  onPlaySound,
  onNavigateToDrawing,
  activeProfile: propProfile,
}) => {
  const activeProfile = propProfile || storageService.getActiveProfile();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const games = [
    {
      id: 'word-complete',
      title: '1. Үг бүтээх & Дутуу үсэг (Word Making - 100)',
      icon: '🧩',
      desc: activeProfile.id === 'mom'
        ? 'Ээжид зориулсан нийлмэл үгс, үсэг эвлүүлэх, дутуу үсэг нөхөх 100 сорил.'
        : 'Дүүд зориулсан зурагт үг, 3-4 үсэгтэй үг бүтээх, дутуу эгшиг нөхөх 100 сорил.',
      tag: '100 Асуулт',
    },
    {
      id: 'find-letter',
      title: '2. Үсэг таних (Find the letter - 100)',
      icon: '🔍',
      desc: '35 монгол үсгийг том, жижиг хэлбэрээр нь 100 үе шаттайгаар танин олох.',
      tag: '100 Асуулт',
    },
    {
      id: 'match-picture',
      title: '3. Зураг ба үг холбох (Match Picture - 100)',
      icon: '🖼️',
      desc: 'Алим, гэр, дэвтэр гэх мэт 100 зурагт тохирох зөв үгийг сонгох.',
      tag: '100 Асуулт',
    },
    {
      id: 'case-match',
      title: '4. Том, жижиг үсгийн хос (Letter matching - 100)',
      icon: '🔤',
      desc: 'А-а, Б-б, В-в зэрэг том ба жижиг үсгийн зөв хосыг 100 асуултаар шалгах.',
      tag: '100 Асуулт',
    },
    {
      id: 'listen-choose',
      title: '5. Сонсоод таах (Listen & choose - 100)',
      icon: '🎧',
      desc: 'Үсэг, үгийн дуудлагыг анхааралтай сонсоод зөв үсгийг таах 100 сорил.',
      tag: '100 Асуулт',
    },
    {
      id: 'vowel-hunt',
      title: '6. Үндсэн 7 эгшиг агнах (Vowel hunt - 100)',
      icon: '🎯',
      desc: 'А, Э, И, О, У, Ө, Ү үндсэн 7 эгшиг, эр ба эм эгшгийг ялгах 100 асуулт.',
      tag: '100 Асуулт',
    },
    {
      id: 'letter-order',
      title: '7. Үсгийн дараалал (Letter order - 100)',
      icon: '🪜',
      desc: 'Цагаан толгойн 35 үсгийн дарааллаас дутуу үсгийг нөхөх 100 шат.',
      tag: '100 Асуулт',
    },
    {
      id: 'memory-cards',
      title: '8. Ой тогтоолтын үгс (Memory Match - 100)',
      icon: '🃏',
      desc: 'Үсэг ба холбогдох зурагт үгсийг цээжлэн таах 100 хосын сорил.',
      tag: '100 Асуулт',
    },
    {
      id: 'daily-practice',
      title: '9. Өдрийн их сорил (Daily 100 Challenge)',
      icon: '⭐',
      desc: 'Үсэг, эгшиг, тоо, үг бүтээх бүх сэдвийг хослуулсан 100 асуултын их сорил.',
      tag: '100 Асуулт',
    },
  ];

  // Helper to load 100 questions for current game
  const getGameQuestions = (id: string): GameQuestion100[] => {
    switch (id) {
      case 'word-complete':
        return generateWordMaking100(activeProfile.id, activeProfile.level);
      case 'find-letter':
        return generateFindLetter100();
      case 'match-picture':
        return generatePictureWordMatch100();
      case 'case-match':
        return generateCaseMatch100();
      case 'listen-choose':
        return generateListenChoose100();
      case 'vowel-hunt':
        return generateVowelHunt100();
      case 'letter-order':
        return generateLetterOrder100();
      case 'memory-cards':
        return generatePictureWordMatch100();
      case 'daily-practice': {
        const poolA = generateWordMaking100(activeProfile.id, activeProfile.level).slice(0, 30);
        const poolB = generateVowelHunt100().slice(0, 25);
        const poolC = generateFindLetter100().slice(0, 25);
        const poolD = generateMathRace100(activeProfile.id === 'mom', activeProfile.level).slice(0, 20);
        return [...poolA, ...poolB, ...poolC, ...poolD].sort(() => 0.5 - Math.random());
      }
      default:
        return generateFindLetter100();
    }
  };

  const currentGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="space-y-6">
      {selectedGameId && currentGame ? (
        <GameSession100
          gameId={currentGame.id}
          gameTitle={currentGame.title}
          questions={getGameQuestions(currentGame.id)}
          activeProfile={activeProfile}
          onBack={() => {
            speechService.playSoundEffect('click');
            setSelectedGameId(null);
          }}
          onFinish={(res) => {
            onReward(res.score, res.expEarned);
          }}
          onPlaySound={onPlaySound}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎮</span>
                <span>Монгол цагаан толгойн 100 асуулттай тоглоомууд</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Тоглоом бүр яг 100 асуулттай бөгөөд дундаас нь гарсан ч явц автоматаар хадгалагдана.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((g) => (
              <div
                key={g.id}
                onClick={() => {
                  speechService.playSoundEffect('click');
                  setSelectedGameId(g.id);
                }}
                className="group cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 inline-block mb-3 group-hover:scale-110 transition-transform">
                      {g.icon}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {g.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {g.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600">
                  <span>100 Асуулт эхлэх</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
