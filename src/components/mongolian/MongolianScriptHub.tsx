import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  PenTool,
  Search,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Scroll,
  Info,
  ChevronRight,
  ChevronLeft,
  Upload,
  ArrowRight,
  Layers,
  Award,
  HelpCircle,
  Play,
  Square,
  Sparkle,
} from 'lucide-react';
import {
  mongolianAlphabetList,
  basicVowelsList,
} from '../../data/mongolianAlphabetData';
import { mongolianModules } from '../../data/curriculumData';
import { MongolianLetter, LessonModule, UserProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { MongolianLetterTracing } from './MongolianLetterTracing';
import { MongolianGames } from './MongolianGames';

interface MongolianScriptHubProps {
  activeProfile: UserProfile;
  onNavigate: (view: string, extra?: any) => void;
}

type TabType = 'alphabet' | 'vowels' | 'tracing' | 'games' | 'traditional';

export const MongolianScriptHub: React.FC<MongolianScriptHubProps> = ({
  activeProfile,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('alphabet');

  // Filter state for alphabet
  const [filterType, setFilterType] = useState<
    'all' | 'basic_vowel' | 'consonant' | 'auxiliary_vowel' | 'sign'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected letter for detail modal or tracing
  const [selectedLetter, setSelectedLetter] = useState<MongolianLetter | null>(
    mongolianAlphabetList[0]
  );
  const [tracingLetter, setTracingLetter] = useState<MongolianLetter>(
    mongolianAlphabetList[0]
  );

  // Audio playing indicator & voice status
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
  const [voiceNotification, setVoiceNotification] = useState<string | null>(null);

  // Traditional Mongolian script state
  const [importedContent, setImportedContent] = useState<any | null>(() =>
    storageService.getImportedMongolianContent()
  );
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showImporter, setShowImporter] = useState(false);

  // Vowel lesson interactive test state
  const [vowelQuizWord, setVowelQuizWord] = useState<{
    word: string;
    vowels: string[];
    meaning: string;
    emoji: string;
  }>({
    word: 'АЛИМ',
    vowels: ['А', 'И'],
    meaning: 'Apple',
    emoji: '🍎',
  });
  const [selectedVowelsInWord, setSelectedVowelsInWord] = useState<string[]>([]);
  const [vowelQuizResult, setVowelQuizResult] = useState<boolean | null>(null);

  // Handlers for Mongolian Audio
  const handlePlaySound = async (text: string) => {
    if (currentlyPlayingAudio === text) {
      speechService.stop();
      setCurrentlyPlayingAudio(null);
      return;
    }

    setCurrentlyPlayingAudio(text);
    const result = await speechService.speakMongolian(text, {
      onVoiceUnavailable: () => {
        setVoiceNotification(
          'Төхөөрөмжид суусан Монгол дуу хоолой олдсонгүй тул системийн фонетик дуудлагыг тоглуулж байна.'
        );
      },
      onEnd: () => {
        setCurrentlyPlayingAudio(null);
      },
      onError: () => {
        setCurrentlyPlayingAudio(null);
      },
    });

    if (!result.hasVoice) {
      setTimeout(() => setVoiceNotification(null), 5000);
    }
  };

  const handleStopAudio = () => {
    speechService.stop();
    setCurrentlyPlayingAudio(null);
  };

  const handleStartTracing = (letter: MongolianLetter) => {
    setTracingLetter(letter);
    setActiveTab('tracing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextTracingLetter = () => {
    const currentIndex = mongolianAlphabetList.findIndex(
      (l) => l.id === tracingLetter.id
    );
    const nextIndex = (currentIndex + 1) % mongolianAlphabetList.length;
    setTracingLetter(mongolianAlphabetList[nextIndex]);
  };

  const handlePrevTracingLetter = () => {
    const currentIndex = mongolianAlphabetList.findIndex(
      (l) => l.id === tracingLetter.id
    );
    const prevIndex =
      (currentIndex - 1 + mongolianAlphabetList.length) % mongolianAlphabetList.length;
    setTracingLetter(mongolianAlphabetList[prevIndex]);
  };

  const handleLetterComplete = (letter: MongolianLetter) => {
    // Reward for handwriting
    storageService.addReward(2, 5);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      storageService.saveImportedMongolianContent(parsed);
      setImportedContent(parsed);
      setImportStatus('Баталгаат монгол бичгийн материал амжилттай хадгалагдлаа!');
      speechService.playSoundEffect('correct');
    } catch (e: any) {
      setImportStatus('Алдаа: JSON формат буруу байна. ' + e.message);
      speechService.playSoundEffect('wrong');
    }
  };

  // Filtered letters for the 35 alphabet grid
  const filteredLetters = mongolianAlphabetList.filter((letter) => {
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'basic_vowel'
        ? letter.isBasicVowel
        : letter.letterType === filterType;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : letter.upper.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.lower.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.nameMn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.exampleWord.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🇲🇳</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Монгол хэл, Цагаан толгой
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            35 үсэг, дуудлага, үндсэн 7 эгшиг, хуруугаар зурах дэвтэр ба монгол бичиг
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('tracing')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>✍️ Үсэг зурах</span>
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>🎮 Тоглоомууд</span>
          </button>
        </div>
      </div>

      {/* Voice Status & Replay Bar when audio is active or fallback */}
      {currentlyPlayingAudio && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-purple-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-6 bg-purple-600 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-3 bg-purple-600 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
            <span className="text-xs font-bold">
              🔊 Дуугарч байна: «{currentlyPlayingAudio}»
            </span>
          </div>
          <button
            onClick={handleStopAudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-50"
          >
            <Square className="w-3 h-3 fill-rose-600" />
            <span>Зогсоох</span>
          </button>
        </div>
      )}

      {voiceNotification && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{voiceNotification}</div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            speechService.playSoundEffect('click');
            setActiveTab('alphabet');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'alphabet'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🇲🇳 35 Үсэг (Цагаан толгой)</span>
        </button>

        <button
          onClick={() => {
            speechService.playSoundEffect('click');
            setActiveTab('vowels');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'vowels'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>📚 Үндсэн 7 Эгшиг</span>
        </button>

        <button
          onClick={() => {
            speechService.playSoundEffect('click');
            setActiveTab('tracing');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'tracing'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>✍️ Үсэг зурах самбар</span>
        </button>

        <button
          onClick={() => {
            speechService.playSoundEffect('click');
            setActiveTab('games');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'games'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🎮 Тоглоомууд (9)</span>
        </button>

        <button
          onClick={() => {
            speechService.playSoundEffect('click');
            setActiveTab('traditional');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'traditional'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>📜 Монгол бичиг (20)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ALL 35 LETTERS IN EXACT CYRILLIC ORDER            */}
      {/* ======================================================== */}
      {activeTab === 'alphabet' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Үсэг эсвэл үгээр хайх..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Бүгд (35)
              </button>
              <button
                onClick={() => setFilterType('basic_vowel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'basic_vowel'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Үндсэн 7 эгшиг
              </button>
              <button
                onClick={() => setFilterType('consonant')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'consonant'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Гийгүүлэгч (22)
              </button>
              <button
                onClick={() => setFilterType('auxiliary_vowel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'auxiliary_vowel'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Туслах эгшиг (4)
              </button>
              <button
                onClick={() => setFilterType('sign')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === 'sign'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Тэмдэг (2)
              </button>
            </div>
          </div>

          {/* Reference Notice for User's Custom Letter Art */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Зурагтын бүтэц:</span> Монгол цагаан толгойн 35 үсгийг албан ёсны дарааллаар нь байрлуулсан бөгөөд таны илгээх баталгаат зураг, үсгийн эх материалууд шууд энд холбогдоход бэлэн кодлогдсон.
            </div>
          </div>

          {/* 35 Letters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {filteredLetters.map((letter) => {
              const isPlaying = currentlyPlayingAudio === letter.upper;
              return (
                <div
                  key={letter.id}
                  className={`group relative rounded-3xl p-4 bg-white dark:bg-slate-800 border-2 transition-all flex flex-col justify-between hover:shadow-md ${
                    letter.isBasicVowel
                      ? 'border-pink-200 dark:border-pink-900/50 hover:border-pink-400'
                      : letter.letterType === 'consonant'
                      ? 'border-sky-100 dark:border-slate-700 hover:border-sky-400'
                      : 'border-slate-100 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  {/* Top Bar: Order & Category Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{letter.order}
                    </span>
                    {letter.isBasicVowel ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                        Эгшиг
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {letter.pronunciationMn}
                      </span>
                    )}
                  </div>

                  {/* Big Letters: Upper & Lower Case */}
                  <div
                    onClick={() => setSelectedLetter(letter)}
                    className="cursor-pointer my-2 text-center"
                  >
                    <div className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-wide group-hover:scale-105 transition-transform">
                      <span>{letter.upper}</span>{' '}
                      <span className="text-3xl text-purple-600 dark:text-purple-400">
                        {letter.lower}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      {letter.nameMn}
                    </div>
                  </div>

                  {/* Example Word */}
                  <div
                    onClick={() => setSelectedLetter(letter)}
                    className="cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center space-y-0.5"
                  >
                    <div className="text-lg">{letter.emoji}</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {letter.exampleWord}
                    </div>
                  </div>

                  {/* Actions: Working 🔊 Сонсох & ✍️ Tracing Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handlePlaySound(letter.upper)}
                      title="Үсгийн дуудлага сонсох"
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Сонсох</span>
                    </button>

                    <button
                      onClick={() => handleStartTracing(letter)}
                      title="Хуруугаар зурж сурах"
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Letter Detail Modal */}
          {selectedLetter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 max-w-md w-full border border-purple-200 dark:border-purple-900/50 shadow-2xl space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Үсэг #{selectedLetter.order}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {selectedLetter.letterType === 'basic_vowel'
                        ? 'Үндсэн 7 эгшиг'
                        : selectedLetter.letterType === 'auxiliary_vowel'
                        ? 'Туслах эгшиг'
                        : selectedLetter.letterType === 'sign'
                        ? 'Тэмдэг үсэг'
                        : 'Гийгүүлэгч үсэг'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                {/* Big Center Display */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-850 border border-purple-100 dark:border-purple-900/40 text-center space-y-2">
                  <div className="text-6xl font-black text-purple-600 dark:text-purple-400 font-display">
                    {selectedLetter.upper} {selectedLetter.lower}
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {selectedLetter.nameMn} · Дуудлага: [{selectedLetter.pronunciationMn}]
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => handlePlaySound(selectedLetter.upper)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 Үсэг сонсох</span>
                    </button>

                    <button
                      onClick={() => handlePlaySound(selectedLetter.exampleWord)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 text-xs font-bold hover:bg-purple-200 transition-all"
                    >
                      <span>Үг сонсох</span>
                    </button>
                  </div>
                </div>

                {/* Example Word & Sentence */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Жишээ үг:</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedLetter.exampleWordTranslationEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <span className="text-2xl">{selectedLetter.emoji}</span>
                    <span>{selectedLetter.exampleWord}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2">
                    {selectedLetter.sampleSentenceMn}
                  </p>
                </div>

                {/* Tracing Guidance Note */}
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    Зурах чиглүүлэгч:
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {selectedLetter.tracingGuide.descriptionMn} ({selectedLetter.tracingGuide.strokeCount} зураас)
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      const cur = selectedLetter;
                      setSelectedLetter(null);
                      handleStartTracing(cur);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>✍️ Хуруугаар зурж бичих</span>
                  </button>

                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                  >
                    Хаах
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: THE SEVEN BASIC VOWELS & VOWEL LEARNING LESSON    */}
      {/* ======================================================== */}
      {activeTab === 'vowels' && (
        <div className="space-y-6">
          {/* Explanation Header Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-sky-500/10 border-2 border-pink-200 dark:border-pink-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                Монгол хэлний ҮНДСЭН 7 ЭГШИГ ҮСЭГ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Монгол хэлэнд нийт <span className="font-bold text-pink-600">Үндсэн 7 эгшиг</span> байдаг:{' '}
              <span className="font-bold text-slate-900 dark:text-white">А, Э, И, О, У, Ө, Ү</span>.
              Эдгээр нь амьсгалын замд ямар нэг саад тотгоргүй, цэвэр хөг аялгуугаар чөлөөтэй дуудагддаг авианууд юм.
            </p>
          </div>

          {/* Large Cards for the 7 Basic Vowels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {basicVowelsList.map((vowel) => {
              const isPlaying = currentlyPlayingAudio === vowel.upper;
              return (
                <div
                  key={vowel.id}
                  className="rounded-3xl p-4 bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-pink-900/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-center"
                >
                  <div className="text-[10px] font-bold text-pink-600 uppercase">
                    Үндсэн эгшиг
                  </div>

                  <div className="my-3">
                    <div className="text-5xl font-black text-pink-600 dark:text-pink-400 font-display">
                      {vowel.upper} {vowel.lower}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                      {vowel.pronunciationMn}
                    </div>
                  </div>

                  <div className="p-2 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-center space-y-0.5 mb-3">
                    <div className="text-2xl">{vowel.emoji}</div>
                    <div className="text-xs font-bold text-pink-900 dark:text-pink-200">
                      {vowel.exampleWord}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => handlePlaySound(vowel.upper)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-pink-600 text-white animate-pulse'
                          : 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 Сонсох</span>
                    </button>

                    <button
                      onClick={() => handleStartTracing(vowel)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>Зурж сурах</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vowel Harmony & Classification Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Эр эгшиг */}
            <div className="rounded-3xl p-5 bg-orange-50/70 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦁</span>
                <h3 className="text-base font-bold text-orange-950 dark:text-orange-200">
                  Эр эгшиг (3)
                </h3>
              </div>
              <div className="text-3xl font-black text-orange-600 font-display">
                А, О, У
              </div>
              <p className="text-xs text-orange-900/80 dark:text-orange-300/80 leading-relaxed">
                Чанга, бүдүүн, эрч хүчтэй дуудагддаг эгшгүүд. Үгийн үндсэнд эр эгшиг орсон бол тухайн үгийн бүх нөхцөл эр эгшигтэй байх зохицолтой.
              </p>
              <div className="text-xs font-mono bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-orange-200 dark:border-orange-900/50 text-orange-800 dark:text-orange-300">
                Жишээ: <strong>А</strong>дуу, <strong>О</strong>дон, <strong>У</strong>ул
              </div>
            </div>

            {/* 2. Эм эгшиг */}
            <div className="rounded-3xl p-5 bg-purple-50/70 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="text-base font-bold text-purple-950 dark:text-purple-200">
                  Эм эгшиг (3)
                </h3>
              </div>
              <div className="text-3xl font-black text-purple-600 font-display">
                Э, Ө, Ү
              </div>
              <p className="text-xs text-purple-900/80 dark:text-purple-300/80 leading-relaxed">
                Зөөлөн, намуун, эелдэг дуудагддаг эгшгүүд. Эм эгшиг орсон үгэнд дандаа эм эгшигтэй дагавар нөхцөл залгадаг дүрэмтэй.
              </p>
              <div className="text-xs font-mono bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 text-purple-800 dark:text-purple-300">
                Жишээ: <strong>Э</strong>эж, <strong>Ө</strong>дөр, <strong>Ү</strong>нэг
              </div>
            </div>

            {/* 3. Саармаг эгшиг */}
            <div className="rounded-3xl p-5 bg-teal-50/70 dark:bg-teal-950/20 border-2 border-teal-200 dark:border-teal-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                <h3 className="text-base font-bold text-teal-950 dark:text-teal-200">
                  Саармаг эгшиг (1)
                </h3>
              </div>
              <div className="text-3xl font-black text-teal-600 font-display">
                И
              </div>
              <p className="text-xs text-teal-900/80 dark:text-teal-300/80 leading-relaxed">
                Эр ч биш, эм ч биш саармаг эгшиг. Эр үгэнд ч орж болно, эм үгэнд ч орж болдог онцлогтой найрсаг эгшиг үсэг юм.
              </p>
              <div className="text-xs font-mono bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-teal-200 dark:border-teal-900/50 text-teal-800 dark:text-teal-300">
                Жишээ: <strong>И</strong>рвэс, Т<strong>и</strong>йм, Тарваг<strong>и</strong>
              </div>
            </div>
          </div>

          {/* Vowel Combinations & Auxiliary Vowels Explanations */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Хос эгшиг ба Туслах эгшгүүд (Яагаад үндсэн 7-д тооцогддоггүй вэ?)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  1. Хос эгшигүүд:
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['АЙ', 'ЭЙ', 'ОЙ', 'УЙ', 'ҮЙ'].map((d) => (
                    <span
                      key={d}
                      onClick={() => handlePlaySound(d)}
                      className="cursor-pointer px-2.5 py-1 rounded-lg bg-pink-100 dark:bg-pink-950 font-mono font-bold text-pink-700 hover:bg-pink-200"
                    >
                      {d} 🔊
                    </span>
                  ))}
                </div>
                <p className="text-slate-500">
                  Хоёр эгшиг нэгдэж нэг агаарын урсгалаар цуг дуудагдах авиаг хос эгшиг гэнэ (жишээ: Цай, Нүүр, Ой, Буй).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  2. Туслах (Ялгах) эгшиг: Я, Е, Ё, Ю, Ы
                </div>
                <p className="text-slate-500">
                  Эдгээр үсэг нь дан эгшиг биш бөгөөд <strong>Й</strong> гийгүүлэгч болон эгшиг (Й+А = Я, Й+О = Ё, Й+У = Ю)-ийн нийлэмж тул үндсэн 7 эгшигт ордоггүй тусгай үүрэгтэй үсгүүд юм.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Vowel Finding Exercise */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-2 border-purple-200 dark:border-purple-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Интерактив дасгал
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Үгэн доторх үндсэн эгшгүүдийг олж товшино уу!
                </h3>
              </div>
              <button
                onClick={() => {
                  const words = [
                    { word: 'АЛИМ', vowels: ['А', 'И'], meaning: 'Apple', emoji: '🍎' },
                    { word: 'НОМ', vowels: ['О'], meaning: 'Book', emoji: '📖' },
                    { word: 'ҮНЭГ', vowels: ['Ү', 'Э'], meaning: 'Fox', emoji: '🦊' },
                    { word: 'НАР', vowels: ['А'], meaning: 'Sun', emoji: '☀️' },
                    { word: 'ӨДӨР', vowels: ['Ө'], meaning: 'Day', emoji: '🌤️' },
                  ];
                  const next = words[Math.floor(Math.random() * words.length)];
                  setVowelQuizWord(next);
                  setSelectedVowelsInWord([]);
                  setVowelQuizResult(null);
                  speechService.playSoundEffect('pop');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Өөр үг сонгох</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/40">
              <div className="text-5xl">{vowelQuizWord.emoji}</div>
              <div className="flex items-center gap-2">
                {vowelQuizWord.word.split('').map((char, idx) => {
                  const isSelected = selectedVowelsInWord.includes(char);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        speechService.playSoundEffect('click');
                        if (selectedVowelsInWord.includes(char)) {
                          setSelectedVowelsInWord(selectedVowelsInWord.filter((c) => c !== char));
                        } else {
                          setSelectedVowelsInWord([...selectedVowelsInWord, char]);
                        }
                      }}
                      className={`w-14 h-16 rounded-2xl text-2xl font-black font-display transition-all ${
                        isSelected
                          ? 'bg-pink-600 text-white shadow-md scale-105'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-pink-100'
                      }`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePlaySound(vowelQuizWord.word)}
                className="p-3 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 hover:bg-purple-200 shadow-sm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Check Button */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  const correct =
                    vowelQuizWord.vowels.every((v) => selectedVowelsInWord.includes(v)) &&
                    selectedVowelsInWord.length === vowelQuizWord.vowels.length;
                  setVowelQuizResult(correct);
                  if (correct) {
                    speechService.playSoundEffect('correct');
                    fireCelebrationConfetti();
                    storageService.addReward(2, 5);
                  } else {
                    speechService.playSoundEffect('wrong');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                Хариуг шалгах
              </button>

              {vowelQuizResult === true && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Маш зөв! Эгшгүүдийг алдаагүй оллоо! (+2 ⭐)</span>
                </span>
              )}
              {vowelQuizResult === false && (
                <span className="text-xs font-bold text-rose-500">
                  Ахин нэг бодоод үзээрэй. Үндсэн 7 эгшиг: А, Э, И, О, У, Ө, Ү
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: INTERACTIVE LETTER DRAWING & HANDWRITING          */}
      {/* ======================================================== */}
      {activeTab === 'tracing' && (
        <div className="space-y-6">
          {/* Quick Letter Picker Carousel */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Зурах үсгээ сонгох (35 үсэг):</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">
                Сонгогдсон: {tracingLetter.upper} {tracingLetter.lower}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {mongolianAlphabetList.map((letObj) => (
                <button
                  key={letObj.id}
                  onClick={() => {
                    speechService.playSoundEffect('click');
                    setTracingLetter(letObj);
                  }}
                  className={`w-10 h-10 shrink-0 rounded-xl text-base font-bold font-display transition-all ${
                    tracingLetter.id === letObj.id
                      ? 'bg-purple-600 text-white shadow-md scale-110'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100'
                  }`}
                >
                  {letObj.upper}
                </button>
              ))}
            </div>
          </div>

          {/* Embedded Interactive Canvas */}
          <MongolianLetterTracing
            currentLetter={tracingLetter}
            onNextLetter={handleNextTracingLetter}
            onPrevLetter={handlePrevTracingLetter}
            onLetterComplete={handleLetterComplete}
            onPlaySound={(t) => handlePlaySound(t)}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: 9 INTERACTIVE GAMES                               */}
      {/* ======================================================== */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <MongolianGames
            onReward={(stars, coins) => storageService.addReward(stars, coins)}
            onPlaySound={(t) => handlePlaySound(t)}
            onNavigateToDrawing={(letter) => {
              setTracingLetter(letter);
              setActiveTab('tracing');
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TRADITIONAL MONGOLIAN SCRIPT (20 MODULES)         */}
      {/* ======================================================== */}
      {activeTab === 'traditional' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Уламжлалт босоо Монгол бичиг
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                20 бэлтгэсэн модуль, босоо зурах урлан, баталгаат материалын сан.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('drawing', { mode: 'mongolian' })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Босоо зурах канвас</span>
              </button>

              <button
                onClick={() => setShowImporter(!showImporter)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Материал оруулах</span>
              </button>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3.5 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Монгол бичгийн хичээлүүдийн бүтцийг бүрэн хангаж 20 модулийг бэлтгэсэн. Хэрэглэгчээс баталгаажсан босоо бичгийн эх материал оруулахад шууд идэвхжин ажиллахаар зохион байгуулагдсан.
            </div>
          </div>

          {/* JSON Importer Drawer */}
          {showImporter && (
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border-2 border-dashed border-amber-300 dark:border-amber-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>Монгол бичгийн материал оруулах</span>
                </h4>
                <span className="text-xs text-slate-400">JSON формат</span>
              </div>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                rows={4}
                placeholder='{ "alphabet": [ { "name": "A", "initial": "...", "medial": "...", "final": "..." } ] }'
                className="w-full p-3 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 text-slate-900 dark:text-white"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={handleImport}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Хадгалах
                </button>
                {importStatus && (
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {importStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 20 Prepared Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {mongolianModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className="group cursor-pointer rounded-2xl p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 hover:border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-amber-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform">
                      {mod.icon}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      #{mod.number}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    {mod.titleMn}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {mod.descriptionMn}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {mod.comingSoonNoteMn}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Module Preview */}
          {selectedModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-lg w-full border border-amber-200 dark:border-slate-700 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedModule.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedModule.titleMn}
                      </h3>
                      <div className="text-xs text-slate-500">
                        Модуль #{selectedModule.number}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center space-y-2 text-xs text-amber-800 dark:text-amber-300">
                  <div className="font-bold text-sm text-amber-900 dark:text-amber-200">
                    {selectedModule.comingSoonNoteMn}
                  </div>
                  <p>
                    Таны нийлүүлэх баталгаат уламжлалт монгол бичгийн үсэг, тиг, эхэн/дунд/адаг хэлбэрүүдийг шууд хүлээн авч харуулахаар бэлтгэгдсэн.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => {
                      setSelectedModule(null);
                      onNavigate('drawing', { mode: 'mongolian' });
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Босоо зурах урланд турших</span>
                  </button>

                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Хаах
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
