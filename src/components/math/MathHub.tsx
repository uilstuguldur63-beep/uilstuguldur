import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Volume2,
  Clock,
  DollarSign,
  Plus,
  Minus,
} from 'lucide-react';
import { mathModules } from '../../data/curriculumData';
import { LessonModule, UserProfile } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { useTranslation } from '../../context/TranslationContext';

interface MathHubProps {
  activeProfile: UserProfile;
  initialModuleId?: string;
  onNavigate: (view: string, extra?: any) => void;
  onCompleteLesson: (moduleId: string) => void;
}

export const MathHub: React.FC<MathHubProps> = ({
  activeProfile,
  initialModuleId,
  onNavigate,
  onCompleteLesson,
}) => {
  const { t, isTranslated } = useTranslation();
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(() => {
    if (initialModuleId) {
      return mathModules.find((m) => m.id === initialModuleId) || null;
    }
    return null;
  });

  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(
    activeProfile.id === 'mom' ? 'intermediate' : 'beginner'
  );

  const handleOpenModule = (mod: LessonModule) => {
    speechService.playSoundEffect('click');
    if (mod.id === 'math-3' || mod.id === 'math-4') {
      onNavigate('drawing', { mode: 'numbers' });
      return;
    }
    setSelectedModule(mod);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">➕</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('Mathematics (20 Modules)', 'Математикийн 20 модуль')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t(
              'Interactive counting, arithmetic, fractions, geometry, and Tugrik (₮) grocery shop.',
              'Тоолох, бодох, бутархай, хэмжилт, Монгол төгрөг (₮) тоолох интерактив хэрэгслүүд.'
            )}
          </p>
        </div>

        {/* Difficulty switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setDifficulty('beginner')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              difficulty === 'beginner'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('Beginner', 'Анхан')}
          </button>
          <button
            onClick={() => setDifficulty('intermediate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              difficulty === 'intermediate'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('Intermediate', 'Дунд')}
          </button>
          <button
            onClick={() => setDifficulty('advanced')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              difficulty === 'advanced'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('Advanced', 'Ахисан')}
          </button>
        </div>
      </div>

      {/* Selected Module Detail or Modules Grid */}
      {selectedModule ? (
        <InteractiveMathModule
          module={selectedModule}
          difficulty={difficulty}
          activeProfile={activeProfile}
          onBack={() => setSelectedModule(null)}
          onComplete={() => {
            onCompleteLesson(selectedModule.id);
            setSelectedModule(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {mathModules.map((mod) => {
            const isCompleted = activeProfile.completedLessons.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => handleOpenModule(mod)}
                className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/60 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500 shadow-sm hover:shadow-md'
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

                  <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {isTranslated ? mod.titleMn : mod.title}
                  </h3>
                  {isTranslated ? (
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {mod.title}
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {mod.titleMn}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {isTranslated
                      ? mod.descriptionMn
                      : `Interactive mathematics lesson on ${mod.title.toLowerCase()}. Tap to practice!`}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>{isCompleted ? t('Review Math', 'Дахин бодох') : t('Solve Math', 'Бодох')}</span>
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

// Interactive Math Exercise Component
interface InteractiveMathModuleProps {
  module: LessonModule;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  activeProfile: UserProfile;
  onBack: () => void;
  onComplete: () => void;
}

const InteractiveMathModule: React.FC<InteractiveMathModuleProps> = ({
  module,
  difficulty,
  activeProfile,
  onBack,
  onComplete,
}) => {
  const { t, isTranslated } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Specific state for module tools:
  // Module 1: Counting objects
  const [clickedCounters, setClickedCounters] = useState<number[]>([]);
  // Module 16: Money Math (Mongolian tögrög ₮)
  const [walletTotal, setWalletTotal] = useState(0);

  // Lesson 1: Counting
  const countTargets = [5, 8, 12];
  const targetCount = countTargets[stepIndex % countTargets.length];

  const handleToggleCounter = (idx: number) => {
    speechService.playSoundEffect('pop');
    setClickedCounters((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Lesson 5: Addition
  const additionProblems = [
    { a: 3, b: 4, ans: 7, explain: '3 + 4 = 7. 3 дээр 4-ийг нэмбэл нийт 7 болно.' },
    { a: 5, b: 6, ans: 11, explain: '5 + 6 = 11. 5 дээр 5-ыг нэмбэл 10, дахин 1-ийг нэмбэл 11.' },
    { a: 12, b: 8, ans: 20, explain: '12 + 8 = 20. 2 дээр 8-ыг нэмбэл 10 болж нийт 20 гарна.' },
  ];
  const currentAddition = additionProblems[stepIndex % additionProblems.length];

  // Lesson 13: Fractions
  const fractionProblems = [
    { fraction: '1/2', name: 'Хагас (Нэгний хоёр хувь)', shaded: 2, total: 4, ans: 2 },
    { fraction: '3/4', name: 'Дөрөвний гурав', shaded: 3, total: 4, ans: 3 },
  ];
  const currentFraction = fractionProblems[stepIndex % fractionProblems.length];
  const [shadedSlices, setShadedSlices] = useState<number[]>([]);

  // Lesson 16: Money Math (Mongolian tögrög ₮)
  const marketItems = [
    { item: 'Шинэхэн улаан алим', price: 1500, emoji: '🍎' },
    { item: 'Амтат сүү', price: 3500, emoji: '🥛' },
    { item: 'Зургийн дэвтэр', price: 5000, emoji: '📒' },
  ];
  const currentItem = marketItems[stepIndex % marketItems.length];

  const handleAddMoney = (amount: number) => {
    speechService.playSoundEffect('pop');
    setWalletTotal((prev) => prev + amount);
  };

  // Lesson 15: Clock
  const clockTargets = [
    { hour: 3, minute: 0, text: '3:00 цаг' },
    { hour: 7, minute: 30, text: '7:30 цаг' },
  ];
  const currentClock = clockTargets[stepIndex % clockTargets.length];

  const handleCheckAnswer = (val: number | string, correctVal: number | string) => {
    setSelectedAnswer(val);
    if (val === correctVal) {
      setIsCorrect(true);
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
    } else {
      setIsCorrect(false);
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-emerald-100 dark:border-slate-700 shadow-md space-y-6">
      {/* Top back bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Math Hub', 'Математикийн цэс рүү буцах')}</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          {isTranslated ? module.titleMn : module.title}
        </span>
      </div>

      {/* Title & Instructions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{module.icon}</span>
          <span>{isTranslated ? module.titleMn : module.title}</span>
        </h2>
        {isTranslated ? (
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {module.title}
          </p>
        ) : (
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {module.titleMn}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          {isTranslated
            ? module.descriptionMn
            : `Interactive mathematics exercise on ${module.title.toLowerCase()}. Solve the problems below!`}
        </p>
      </div>

      {/* Module 1: Counting Objects */}
      {module.id === 'math-1' && (
        <div className="space-y-4 max-w-lg mx-auto text-center py-2">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t(`Tap and count exactly ${targetCount} apples!`, `Яг ${targetCount} ширхэг алим товшиж тоолоорой!`)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('Selected: ', 'Одоо сонгосон: ')}
              <span className="font-bold text-emerald-600 text-sm tabular-nums">{clickedCounters.length}</span> / {targetCount}
            </p>
          </div>

          {/* Interactive Clickable Objects Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            {Array.from({ length: 15 }).map((_, i) => {
              const isSelected = clickedCounters.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleCounter(i)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 scale-110 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  🍎
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                if (clickedCounters.length === targetCount) {
                  setIsCorrect(true);
                  speechService.playSoundEffect('correct');
                  fireCelebrationConfetti();
                } else {
                  setIsCorrect(false);
                  speechService.playSoundEffect('wrong');
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm"
            >
              {t('Check', 'Шалгах')}
            </button>
            <button
              onClick={() => setClickedCounters([])}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              {t('Clear', 'Цэвэрлэх')}
            </button>
          </div>

          {isCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-sm">
              {t(`🎉 Excellent! You counted exactly ${targetCount} apples!`, `🎉 Гайхалтай! ${targetCount} ширхэгийг яг зөв тоолон оллоо!`)}
            </div>
          )}
          {isCorrect === false && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {t('Count does not match yet. Please try again.', 'Таны тоо зөрсөн байна. Дахин тоолоод шалгаарай.')}
            </div>
          )}
        </div>
      )}

      {/* Module 5: Addition (+) */}
      {module.id === 'math-5' && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          {/* Visual Counters Representation */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              <span>{currentAddition.a}</span>
              <span className="text-emerald-600">+</span>
              <span>{currentAddition.b}</span>
              <span className="text-slate-400">=</span>
              <span className="text-purple-600">?</span>
            </div>

            {/* Visual balls */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex gap-1">
                {Array.from({ length: currentAddition.a }).map((_, i) => (
                  <span key={i} className="text-xl">🔵</span>
                ))}
              </div>
              <span className="text-slate-400 font-bold">+</span>
              <div className="flex gap-1">
                {Array.from({ length: currentAddition.b }).map((_, i) => (
                  <span key={i} className="text-xl">🟢</span>
                ))}
              </div>
            </div>

            {/* Step by step Mongolian explanation toggle */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-emerald-700 dark:text-emerald-300 underline font-semibold"
            >
              {showHint
                ? t('Hide Explanation', 'Тайлбарыг нуух')
                : t('💡 Show Explanation', '💡 Монгол тайлбар харах')}
            </button>
            {showHint && (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-emerald-100">
                {isTranslated
                  ? currentAddition.explain
                  : `Adding ${currentAddition.a} and ${currentAddition.b} gives ${currentAddition.ans}. Count all circles together!`}
              </div>
            )}
          </div>

          {/* Multiple choice options */}
          <div className="grid grid-cols-3 gap-3">
            {[currentAddition.ans - 1, currentAddition.ans, currentAddition.ans + 2].map((opt) => (
              <button
                key={opt}
                onClick={() => handleCheckAnswer(opt, currentAddition.ans)}
                className={`p-4 rounded-2xl font-extrabold text-xl border-2 transition-all tabular-nums ${
                  selectedAnswer === opt
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-900 dark:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {isCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-center text-sm">
              {t(`🎉 Correct! ${currentAddition.a} + ${currentAddition.b} = ${currentAddition.ans}!`, `🎉 Зөв бодлоо! ${currentAddition.a} + ${currentAddition.b} = ${currentAddition.ans}!`)}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setSelectedAnswer(null);
                setIsCorrect(null);
                setShowHint(false);
                if (stepIndex < additionProblems.length - 1) {
                  setStepIndex((p) => p + 1);
                } else {
                  onComplete();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
            >
              {t('Next Problem ➔', 'Дараагийн бодлого ➔')}
            </button>
          </div>
        </div>
      )}

      {/* Module 16: Money Math in Mongolian Tögrөг (₮) */}
      {module.id === 'math-16' && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
            <div className="text-4xl">{currentItem.emoji}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t(`Buy: ${currentItem.item}`, `${currentItem.item} худалдан авах`)}
            </h3>
            <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400 tabular-nums">
              {t(`Price: ₮${currentItem.price.toLocaleString()}`, `Үнэ: ₮${currentItem.price.toLocaleString()}`)}
            </div>
            <div className="text-xs text-slate-500">
              {t('Amount Paid: ', 'Таны төлсөн дүн: ')}
              <span className="font-bold text-slate-800 dark:text-white tabular-nums">₮{walletTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Mongolian tögrög banknotes buttons */}
          <div className="text-xs font-bold text-slate-500 text-center">
            {t('Tap banknotes to add cash:', 'Дэвсгэрт дээр дарж мөнгөө тоолон төлнө үү:')}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[500, 1000, 2000, 5000].map((note) => (
              <button
                key={note}
                onClick={() => handleAddMoney(note)}
                className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all tabular-nums"
              >
                +₮{note.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (walletTotal === currentItem.price) {
                  setIsCorrect(true);
                  speechService.playSoundEffect('correct');
                  fireCelebrationConfetti();
                } else if (walletTotal > currentItem.price) {
                  setIsCorrect(false);
                  speechService.playSoundEffect('wrong');
                } else {
                  setIsCorrect(false);
                  speechService.playSoundEffect('wrong');
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm"
            >
              {t('Purchase 🛍️', 'Худалдаж авах 🛍️')}
            </button>
            <button
              onClick={() => {
                setWalletTotal(0);
                setIsCorrect(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              {t('Reset', 'Тэглэх')}
            </button>
          </div>

          {isCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-center text-sm">
              {t(
                `🎉 Perfect! Exactly ₮${currentItem.price.toLocaleString()} paid!`,
                `🎉 Төгс! ₮${currentItem.price.toLocaleString()} яг зөв төлж бараагаа авлаа!`
              )}
            </div>
          )}
          {isCorrect === false && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
              {walletTotal < currentItem.price
                ? t(
                    `Underpaid by ₮${(currentItem.price - walletTotal).toLocaleString()}`,
                    `Дүн дутуу байна: ₮${(currentItem.price - walletTotal).toLocaleString()} дутаж байна.`
                  )
                : t(
                    `Overpaid by ₮${(walletTotal - currentItem.price).toLocaleString()}`,
                    `Илүү төлсөн байна: ₮${(walletTotal - currentItem.price).toLocaleString()} илүү байна.`
                  )}
            </div>
          )}
        </div>
      )}

      {/* Fallback general interactive view for other math modules */}
      {!['math-1', 'math-5', 'math-16'].includes(module.id) && (
        <div className="space-y-4 max-w-lg mx-auto py-2">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 text-center space-y-2">
            <div className="text-3xl">{module.icon}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isTranslated ? module.titleMn : module.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isTranslated ? module.descriptionMn : `Practice and master ${module.title.toLowerCase()}.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">
              {t(
                `Exercise: ${difficulty === 'beginner' ? 'Beginner' : difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}`,
                `Дасгал: ${difficulty === 'beginner' ? 'Анхан шат' : difficulty === 'intermediate' ? 'Дунд шат' : 'Ахисан шат'}`
              )}
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">
              {t('Solve step-by-step and select the correct answer:', 'Бодлогыг алхам алхмаар бодож зөв хариуг сонгоорой:')}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    speechService.playSoundEffect('correct');
                    fireCelebrationConfetti();
                    setIsCorrect(true);
                  }}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 font-bold text-sm text-slate-800 dark:text-white tabular-nums"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                speechService.playSoundEffect('correct');
                fireCelebrationConfetti();
                onComplete();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm"
            >
              {t('Complete Lesson (+3 ⭐, +10 🪙)', 'Бодлогыг дуусгах (+3 ⭐, +10 🪙)')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
