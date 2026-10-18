import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Search,
  Star,
  Play,
} from 'lucide-react';
import { englishModules } from '../../data/curriculumData';
import { LessonModule, UserProfile } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { storageService } from '../../services/storageService';

interface EnglishHubProps {
  activeProfile: UserProfile;
  initialModuleId?: string;
  onNavigate: (view: string, extra?: any) => void;
  onCompleteLesson: (moduleId: string) => void;
}

export const EnglishHub: React.FC<EnglishHubProps> = ({
  activeProfile,
  initialModuleId,
  onNavigate,
  onCompleteLesson,
}) => {
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(() => {
    if (initialModuleId) {
      return englishModules.find((m) => m.id === initialModuleId) || null;
    }
    return null;
  });

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'basics' | 'vocabulary' | 'practice'>('all');

  const filteredModules = englishModules.filter((m) => {
    if (activeTabFilter === 'all') return true;
    if (activeTabFilter === 'basics') return ['eng-1', 'eng-2', 'eng-3', 'eng-5', 'eng-6'].includes(m.id);
    if (activeTabFilter === 'vocabulary') return ['eng-4', 'eng-7', 'eng-8', 'eng-9', 'eng-10', 'eng-11'].includes(m.id);
    if (activeTabFilter === 'practice') return ['eng-12', 'eng-13', 'eng-14', 'eng-15', 'eng-16', 'eng-17', 'eng-18', 'eng-19', 'eng-20'].includes(m.id);
    return true;
  });

  const handleOpenModule = (mod: LessonModule) => {
    speechService.playSoundEffect('click');
    if (mod.id === 'eng-14') {
      onNavigate('grammar');
      return;
    }
    if (mod.id === 'eng-18') {
      onNavigate('conversations');
      return;
    }
    if (mod.id === 'eng-19') {
      onNavigate('stories');
      return;
    }
    if (mod.id === 'eng-3' || mod.id === 'eng-2') {
      onNavigate('drawing', { mode: 'letters' });
      return;
    }
    setSelectedModule(mod);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇬🇧</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Англи хэлний 20 модуль
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Англи багшийн цэвэр дуудлага, зурагт дасгал, үсэг бичилт, харилцан яриа.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTabFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Бүгд (20)
          </button>
          <button
            onClick={() => setActiveTabFilter('basics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTabFilter === 'basics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Үсэг & Тоо
          </button>
          <button
            onClick={() => setActiveTabFilter('vocabulary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTabFilter === 'vocabulary'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Үгсийн сан
          </button>
          <button
            onClick={() => setActiveTabFilter('practice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTabFilter === 'practice'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Дадлага & Дүрэм
          </button>
        </div>
      </div>

      {/* Detail Active Module View */}
      {selectedModule ? (
        <InteractiveEnglishModule
          module={selectedModule}
          activeProfile={activeProfile}
          onBack={() => setSelectedModule(null)}
          onComplete={() => {
            onCompleteLesson(selectedModule.id);
            setSelectedModule(null);
          }}
        />
      ) : (
        /* Modules Grid (20 working modules) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredModules.map((mod) => {
            const isCompleted = activeProfile.completedLessons.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => handleOpenModule(mod)}
                className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-purple-50/60 dark:bg-slate-800/80 border-purple-200 dark:border-purple-900/50 hover:border-purple-400'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform">
                      {mod.icon}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        #{mod.number}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {mod.title}
                  </h3>
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    {mod.titleMn}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {mod.descriptionMn}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>{isCompleted ? 'Дахин давтах' : 'Эхлэх'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Interactive Module Component for English
interface InteractiveEnglishModuleProps {
  module: LessonModule;
  activeProfile: UserProfile;
  onBack: () => void;
  onComplete: () => void;
}

const InteractiveEnglishModule: React.FC<InteractiveEnglishModuleProps> = ({
  module,
  activeProfile,
  onBack,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [userInputText, setUserInputText] = useState('');
  const [scrambleLetters, setScrambleLetters] = useState<string[]>([]);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);

  // Sound playback for English pronunciation
  const speak = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text);
  };

  // Lesson 1: Alphabet Interactive Phonics
  const alphabetData = [
    { letter: 'Aa', word: 'apple', phonetic: '/ˈæp.əl/', mn: 'Алим', emoji: '🍎', sample: 'An apple is red and sweet.' },
    { letter: 'Bb', word: 'book', phonetic: '/bʊk/', mn: 'Ном', emoji: '📖', sample: 'We read a book together.' },
    { letter: 'Cc', word: 'cat', phonetic: '/kæt/', mn: 'Муур', emoji: '🐱', sample: 'The cat has a hat.' },
    { letter: 'Dd', word: 'duck', phonetic: '/dʌk/', mn: 'Нугас', emoji: '🦆', sample: 'The little duck swims.' },
    { letter: 'Ee', word: 'egg', phonetic: '/eɡ/', mn: 'Өндөг', emoji: '🥚', sample: 'An egg is round and white.' },
    { letter: 'Ff', word: 'fish', phonetic: '/fɪʃ/', mn: 'Загас', emoji: '🐟', sample: 'The fish swims in water.' },
    { letter: 'Gg', word: 'guitar', phonetic: '/ɡɪˈtɑːr/', mn: 'Гитар', emoji: '🎸', sample: 'Play a song on the guitar.' },
    { letter: 'Hh', word: 'hand', phonetic: '/hænd/', mn: 'Гар', emoji: '✋', sample: 'Clap your hands together.' },
  ];

  // Colors lesson data
  const colorsData = [
    { name: 'Red', hex: '#EF4444', mn: 'Улаан', item: 'Red Apple', emoji: '🍎' },
    { name: 'Blue', hex: '#3B82F6', mn: 'Цэнхэр', item: 'Blue Sky', emoji: '🌊' },
    { name: 'Yellow', hex: '#EAB308', mn: 'Шар', item: 'Yellow Sun', emoji: '☀️' },
    { name: 'Green', hex: '#10B981', mn: 'Ногоон', item: 'Green Tree', emoji: '🌲' },
    { name: 'Purple', hex: '#A855F7', mn: 'Нил ягаан', item: 'Purple Grapes', emoji: '🍇' },
    { name: 'Orange', hex: '#F97316', mn: 'Улбар шар', item: 'Orange Carrot', emoji: '🥕' },
    { name: 'Pink', hex: '#EC4899', mn: 'Ягаан', item: 'Pink Flower', emoji: '🌸' },
  ];

  // Spelling activity data (e.g. module 12)
  const spellingTargets = [
    { target: 'DUCK', hintMn: 'Нугас', emoji: '🦆' },
    { target: 'BOOK', hintMn: 'Ном', emoji: '📖' },
    { target: 'FROG', hintMn: 'Мэлхий', emoji: '🐸' },
    { target: 'STAR', hintMn: 'Од', emoji: '⭐' },
  ];

  const currentSpelling = spellingTargets[currentStep % spellingTargets.length];

  // Initialize scrambled letters when step changes
  React.useEffect(() => {
    if (module.id === 'eng-12') {
      const letters = currentSpelling.target.split('').sort(() => Math.random() - 0.5);
      setScrambleLetters(letters);
      setAssembledWord([]);
      setIsAnswerCorrect(null);
    }
  }, [currentStep, module.id]);

  const handleLetterClick = (letter: string, index: number) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(letter);
    const updatedAssembled = [...assembledWord, letter];
    setAssembledWord(updatedAssembled);
    const updatedScramble = [...scrambleLetters];
    updatedScramble.splice(index, 1);
    setScrambleLetters(updatedScramble);

    if (updatedAssembled.length === currentSpelling.target.length) {
      if (updatedAssembled.join('') === currentSpelling.target) {
        setIsAnswerCorrect(true);
        speechService.playSoundEffect('correct');
        fireCelebrationConfetti();
        speechService.speakEnglish(`Excellent! ${currentSpelling.target}`);
      } else {
        setIsAnswerCorrect(false);
        speechService.playSoundEffect('wrong');
      }
    }
  };

  const handleResetSpelling = () => {
    const letters = currentSpelling.target.split('').sort(() => Math.random() - 0.5);
    setScrambleLetters(letters);
    setAssembledWord([]);
    setIsAnswerCorrect(null);
  };

  // Sentence builder data (Module 13)
  const sentenceTargets = [
    { parts: ['I', 'go', 'to', 'school'], correct: 'I go to school.', mn: 'Би сургуульд явдаг.' },
    { parts: ['The', 'cat', 'has', 'a', 'hat'], correct: 'The cat has a hat.', mn: 'Муур малгайтай.' },
    { parts: ['We', 'love', 'our', 'family'], correct: 'We love our family.', mn: 'Бид гэр бүлдээ хайртай.' },
  ];
  const currentSentence = sentenceTargets[currentStep % sentenceTargets.length];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  React.useEffect(() => {
    if (module.id === 'eng-13') {
      setAvailableWords([...currentSentence.parts].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setIsAnswerCorrect(null);
    }
  }, [currentStep, module.id]);

  const handleAddWordToSentence = (word: string, idx: number) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(word);
    const updatedSelected = [...selectedWords, word];
    setSelectedWords(updatedSelected);
    const updatedAvailable = [...availableWords];
    updatedAvailable.splice(idx, 1);
    setAvailableWords(updatedAvailable);

    if (updatedSelected.length === currentSentence.parts.length) {
      if (updatedSelected.join(' ') + '.' === currentSentence.correct) {
        setIsAnswerCorrect(true);
        speechService.playSoundEffect('correct');
        fireCelebrationConfetti();
        speechService.speakEnglish(currentSentence.correct);
      } else {
        setIsAnswerCorrect(false);
        speechService.playSoundEffect('wrong');
      }
    }
  };

  // Generic Quiz checking for Quizzes module (17)
  const quizQuestions = [
    {
      q: 'Which animal says "quack quack"?',
      options: ['Duck', 'Lion', 'Cat'],
      correct: 'Duck',
      hintMn: '"Quack quack" дуугардаг амьтан аль нь вэ?',
    },
    {
      q: 'What color is an apple?',
      options: ['Red', 'Blue', 'Black'],
      correct: 'Red',
      hintMn: 'Алим ямар өнгөтэй байдаг вэ?',
    },
    {
      q: 'Which one is in the classroom?',
      options: ['Whiteboard', 'Elephant', 'Airplane'],
      correct: 'Whiteboard',
      hintMn: 'Ангид байдаг зүйл аль нь вэ?',
    },
  ];
  const currentQuiz = quizQuestions[currentStep % quizQuestions.length];

  const handleCheckQuizAnswer = (opt: string) => {
    setSelectedAnswer(opt);
    speechService.speakEnglish(opt);
    if (opt === currentQuiz.correct) {
      setIsAnswerCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      speechService.speakEnglish(`Correct! Great job! ${opt}`);
    } else {
      setIsAnswerCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-6">
      {/* Top breadcrumb navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Бүх хичээл рүү буцах</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            {module.title}
          </span>
        </div>
      </div>

      {/* Module Title & Written Mongolian instructions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{module.icon}</span>
            <span>{module.title}</span>
          </h2>
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
            {module.titleMn}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {module.descriptionMn}
          </p>
        </div>

        <button
          onClick={() => speak(module.title)}
          title="Hear English pronunciation"
          className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-colors shrink-0"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Content switcher based on Module ID */}
      {/* 1. English Alphabet (eng-1) */}
      {module.id === 'eng-1' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {alphabetData.map((item, idx) => (
              <div
                key={item.letter}
                onClick={() => speak(`${item.letter}. ${item.word}. ${item.sample}`)}
                className="group cursor-pointer rounded-2xl p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all text-center"
              >
                <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
                  {item.letter}
                </div>
                <div className="text-3xl my-2 group-hover:scale-125 transition-transform">
                  {item.emoji}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                  {item.word}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {item.phonetic}
                </div>
                <div className="text-xs text-purple-500 font-medium mt-1">
                  {item.mn}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-xs text-purple-800 dark:text-purple-200 flex items-center justify-between">
            <span>💡 Картыг товшиж англи авиа, үг, жишээ өгүүлбэрийг сонсоорой!</span>
            <button
              onClick={() => {
                speechService.playSoundEffect('correct');
                fireCelebrationConfetti();
                onComplete();
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
            >
              Дуусгах & Од авах ⭐
            </button>
          </div>
        </div>
      )}

      {/* 5. Colors (eng-5) */}
      {module.id === 'eng-5' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorsData.map((c) => (
              <div
                key={c.name}
                onClick={() => speak(`${c.name}. ${c.item}.`)}
                className="cursor-pointer rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all text-center bg-slate-50 dark:bg-slate-700/40"
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto shadow-inner flex items-center justify-center text-2xl"
                  style={{ backgroundColor: c.hex }}
                >
                  {c.emoji}
                </div>
                <div className="text-base font-bold text-slate-800 dark:text-white mt-2">
                  {c.name}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {c.mn}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  {c.item}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                speechService.playSoundEffect('correct');
                fireCelebrationConfetti();
                onComplete();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm"
            >
              Хичээлийг дуусгах (+3 ⭐, +10 🪙)
            </button>
          </div>
        </div>
      )}

      {/* 12. Spelling Practice (eng-12) */}
      {module.id === 'eng-12' && (
        <div className="space-y-5 text-center max-w-lg mx-auto py-2">
          <div className="text-6xl mb-2">{currentSpelling.emoji}</div>
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Монгол утга: <span className="text-purple-600 font-bold">{currentSpelling.hintMn}</span>
          </div>

          {/* Assembled Word Slots */}
          <div className="flex justify-center gap-2 min-h-[56px] p-2 bg-slate-100 dark:bg-slate-700/50 rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800">
            {assembledWord.length === 0 ? (
              <span className="text-xs text-slate-400 self-center">
                Доорх үсгүүдийг дарж үг бүтээгээрэй
              </span>
            ) : (
              assembledWord.map((l, i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 font-extrabold text-xl flex items-center justify-center shadow-sm border border-purple-200 dark:border-purple-700 animate-in zoom-in-75"
                >
                  {l}
                </div>
              ))
            )}
          </div>

          {/* Scrambled Letters Options */}
          <div className="flex justify-center gap-2">
            {scrambleLetters.map((l, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(l, idx)}
                className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                {l}
              </button>
            ))}
          </div>

          {isAnswerCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              🎉 Маш сайн! Зөв бичлээ: {currentSpelling.target}!
            </div>
          )}

          {isAnswerCorrect === false && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
              Дахин оролдоод үзээрэй! Үсгийн дарааллаа шалгаарай.
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetSpelling}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Дахин эхлэх</span>
            </button>

            <button
              onClick={() => {
                if (currentStep < spellingTargets.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                  onComplete();
                }
              }}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              Дараагийн үг ➔
            </button>
          </div>
        </div>
      )}

      {/* 13. Sentence Builder (eng-13) */}
      {module.id === 'eng-13' && (
        <div className="space-y-5 text-center max-w-xl mx-auto py-2">
          <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            Монгол утга: {currentSentence.mn}
          </div>

          {/* Constructed Sentence Box */}
          <div className="min-h-[64px] p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border-2 border-purple-200 dark:border-purple-800 flex flex-wrap gap-2 items-center justify-center">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-slate-400">
                Доорх үгсийг товшиж өгүүлбэр бүтээгээрэй
              </span>
            ) : (
              selectedWords.map((w, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm shadow-sm border border-purple-200"
                >
                  {w}
                </span>
              ))
            )}
          </div>

          {/* Available Word Blocks */}
          <div className="flex flex-wrap justify-center gap-2">
            {availableWords.map((w, idx) => (
              <button
                key={idx}
                onClick={() => handleAddWordToSentence(w, idx)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-sm active:scale-95 transition-transform"
              >
                {w}
              </button>
            ))}
          </div>

          {isAnswerCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              ✨ Төгс! Өгүүлбэр: "{currentSentence.correct}"
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setAvailableWords([...currentSentence.parts].sort(() => Math.random() - 0.5));
                setSelectedWords([]);
                setIsAnswerCorrect(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Шинэчлэх</span>
            </button>

            <button
              onClick={() => {
                if (currentStep < sentenceTargets.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                  onComplete();
                }
              }}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
            >
              Дараагийн дасгал ➔
            </button>
          </div>
        </div>
      )}

      {/* 17. English Quizzes (eng-17) */}
      {module.id === 'eng-17' && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600">
                Асуулт #{currentStep + 1} / {quizQuestions.length}
              </span>
              <button
                onClick={() => speak(currentQuiz.q)}
                className="text-purple-600 hover:text-purple-700 p-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {currentQuiz.q}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              💡 {currentQuiz.hintMn}
            </p>
          </div>

          <div className="space-y-2">
            {currentQuiz.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleCheckQuizAnswer(opt)}
                className={`w-full p-3.5 rounded-2xl text-left font-bold text-sm flex items-center justify-between border-2 transition-all ${
                  selectedAnswer === opt
                    ? isAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-purple-300 text-slate-800 dark:text-slate-100'
                }`}
              >
                <span>{opt}</span>
                <Volume2 className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
                if (currentStep < quizQuestions.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                  onComplete();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
            >
              Дараагийн асуулт ➔
            </button>
          </div>
        </div>
      )}

      {/* Fallback general activity view for remaining modules (Numbers, Animals, Food, etc.) */}
      {!['eng-1', 'eng-5', 'eng-12', 'eng-13', 'eng-17'].includes(module.id) && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-800/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-bold text-sky-900 dark:text-sky-200">
                Интерактив дасгал ба сонсох хичээл
              </div>
              <div className="text-xs text-sky-700 dark:text-sky-300">
                Англи багшийн дуудлагыг сонсож, давтан хэлээрэй.
              </div>
            </div>
            <button
              onClick={() => speak(module.title)}
              className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Сонсох</span>
            </button>
          </div>

          {/* Quick practice card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => speak(`Welcome to ${module.title}. Let us learn step by step!`)}
              className="cursor-pointer p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                1. Сонсож давтах
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Товшиж англиар сонсоод даган давтан хэлээрэй.
              </p>
            </div>

            <div
              onClick={() => speak('Great job practicing English today!')}
              className="cursor-pointer p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                2. Баталгаажуулах
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Дасгалыг амжилттай дуусгаж од, зоос цуглуулаарай.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                speechService.playSoundEffect('correct');
                fireCelebrationConfetti();
                onComplete();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm"
            >
              Хичээлийг дуусгах (+3 ⭐, +10 🪙)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
