import React from 'react';
import {
  BookOpen,
  Calculator,
  Scroll,
  MessageCircle,
  Mic,
  Palette,
  Gamepad2,
  BookMarked,
  Layers,
  Award,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, ProfileType } from '../../types';
import { MimiMascot } from '../common/MimiMascot';
import { speechService } from '../../services/speechService';
import { useTranslation } from '../../context/TranslationContext';

interface HomeScreenProps {
  activeProfile: UserProfile;
  onSwitchProfile: (type: ProfileType) => void;
  onNavigate: (view: string, extra?: any) => void;
  onOpenParentArea: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeProfile,
  onSwitchProfile,
  onNavigate,
  onOpenParentArea,
}) => {
  const { t, isTranslated } = useTranslation();
  const [isSpeakingGreeting, setIsSpeakingGreeting] = React.useState(false);

  const isSister = activeProfile.id === 'sister';

  const greetingEn = isSister
    ? 'Hello little star! Let us play, draw, and learn English!'
    : 'Welcome back! Ready for practical conversation and mental math?';

  const greetingMn = isSister
    ? 'Сайн уу, бяцхан одон минь! Хамтдаа тоглож, зурж, англи хэл сурцгаая!'
    : 'Тавтай морил! Өнөөдрийн ярианы дадлага, тоо бодолтдоо бэлэн үү?';

  const handleMimiGreeting = () => {
    speechService.playSoundEffect('pop');
    setIsSpeakingGreeting(true);
    speechService.speakEnglish(greetingEn, {
      onEnd: () => setIsSpeakingGreeting(false),
      onError: () => setIsSpeakingGreeting(false),
    });
  };

  const recommendedActivity = isSister
    ? {
        title: t('Letter Tracing (A–Z)', 'Үсэг дагуулж зурах (A–Z)'),
        view: 'english',
        moduleId: 'eng-2',
        tag: t('Next Lesson', 'Дараагийн хичээл'),
        icon: '✍️',
        desc: t("Let's trace the letter A with your finger!", 'Хуруугаараа A үсгийг дагуулан зурж сурцгаая!'),
      }
    : {
        title: t('Daily English Conversations', 'Өдөр тутмын харилцан яриа'),
        view: 'conversations',
        tag: t('Recommended', 'Санал болгох'),
        icon: '💬',
        desc: t('Practical dialogues for shopping, ordering, and meeting people.', 'Дэлгүүрт худалдаа хийх, танилцах бодит ярианы дадлага.'),
      };

  const roleDescription = isSister
    ? t('Beginner (Level 2) · Picture Lessons · Fun Exercises', 'Анхан шат (Level 2) · Зурагт хичээл · Хөгжилтэй дасгал')
    : t('Advanced (Level 5) · Conversational English · Grammar · Word Building', 'Ахисан түвшин (Level 5) · Ярианы англи хэл · Дүрэм · Үг бүтээх');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Hero Welcome Banner with Mascot Mimi */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 text-white p-5 sm:p-7 shadow-xl shadow-purple-900/10">
        {/* Background glow discs */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-yellow-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            {/* Active profile badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-100 border border-white/20">
              <span className="text-base">{activeProfile.avatar}</span>
              <span>
                {t(`Learner: ${activeProfile.displayName}`, `Суралцагч: ${activeProfile.displayNameMn}`)}
              </span>
              <span className="text-yellow-300">
                · {t(`Level ${activeProfile.level}`, `Түвшин ${activeProfile.level}`)}
              </span>
              <span className="text-amber-200">· {activeProfile.exp} EXP</span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] text-white">
                {activeProfile.id === 'mom'
                  ? t('Advanced (Lvl 5+)', 'Ахисан (Lvl 5+)')
                  : t('Beginner (Lvl 2+)', 'Анхан (Lvl 2+)')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-balance">
              {t('“Learn, Draw, Think, and Grow Together!”', '“Суръя, зуръя, бодъё, хамтдаа хөгжицгөөе!”')}
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
              {roleDescription}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <button
                onClick={() => onNavigate('teacher')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>{t('Chat with Teacher Mimi', 'Багш Мимитэй ярилцах')}</span>
              </button>

              <button
                onClick={handleMimiGreeting}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold backdrop-blur-sm transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{t('Listen to Mimi', 'Мимиг сонсох')}</span>
              </button>
            </div>
          </div>

          {/* Animated Mascot Mimi with speech bubble */}
          <div className="shrink-0 cursor-pointer" onClick={handleMimiGreeting}>
            <MimiMascot
              size="lg"
              mood={isSpeakingGreeting ? 'celebrating' : 'happy'}
              isSpeaking={isSpeakingGreeting}
              speechBubbleText={greetingEn}
              speechBubbleTranslation={isTranslated ? greetingMn : undefined}
              equippedHat={activeProfile.equippedHat}
              equippedAccessory={activeProfile.equippedAccessory}
              onSpeak={handleMimiGreeting}
            />
          </div>
        </div>
      </div>

      {/* Continue Learning / Recommended Next Activity */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-2xl shrink-0 border border-amber-200 dark:border-amber-900/60">
            {recommendedActivity.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {recommendedActivity.tag}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500">{t('Continue', 'Үргэлжлүүлэх')}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {recommendedActivity.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {recommendedActivity.desc}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(recommendedActivity.view, { moduleId: recommendedActivity.moduleId })}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95 transition-all"
        >
          <span>{t('Start', 'Эхлэх')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Large Subject Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('Core 3 Subjects', 'Үндсэн 3 хичээл')}</span>
            <span className="text-xs font-normal text-slate-400">· {t('60 Interactive Modules', '60 интерактив модуль')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. English */}
          <div
            onClick={() => onNavigate('english')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-850 p-6 border-2 border-sky-100 hover:border-sky-300 dark:border-slate-700 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🇬🇧
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                {t('20 Lessons', '20 Хичээл')}
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                {t('ENGLISH LANGUAGE', 'АНГЛИ ХЭЛ')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  'Alphabet, letter tracing, vocabulary words, real dialogues, grammar, and audio stories.',
                  'Цагаан толгой, үсэг бичилт, зурагт үгс, харилцан яриа, дүрэм, англи дуу хоолойтой үлгэрүүд.'
                )}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-sky-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>{t('Explore Lessons', 'Хичээл үзэх')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Math */}
          <div
            onClick={() => onNavigate('math')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50 to-white dark:from-slate-800 dark:to-slate-850 p-6 border-2 border-emerald-100 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {t('20 Modules', '20 Модуль')}
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {t('MATHEMATICS', 'МАТЕМАТИК')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  'Counting, addition, subtraction, multiplication, geometry, time, and Tugrik (₮) currency store.',
                  'Тоолох, нэмэх, хасах, үржүүлэх, геометр дүрс, цаг хугацаа, Монгол төгрөг (₮) тоолох дэлгүүр.'
                )}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{t('Solve Math', 'Бодлого бодох')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Mongolian Language & Alphabet */}
          <div
            onClick={() => onNavigate('mongolian')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 to-white dark:from-slate-800 dark:to-slate-850 p-6 border-2 border-amber-100 hover:border-amber-300 dark:border-slate-700 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🇲🇳
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                {t('35 Letters · 7 Vowels', '35 Үсэг · 7 Эгшиг')}
              </span>
            </div>
            <div className="mt-4 space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                {t('MONGOLIAN SCRIPT & ALPHABET', 'МОНГОЛ ХЭЛ, ЦАГААН ТОЛГОЙ')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  '35 letters with audio, 7 basic vowels, finger writing workbook, fun quizzes, and traditional script.',
                  '35 үсэг, дуудлага сонсох, үндсэн 7 эгшиг, хуруугаар бичих дэвтэр, сонирхолтой тоглоомууд ба монгол бичиг.'
                )}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>{t('Learn Alphabet', 'Хичээл үзэх')}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Hubs Grid (Interactive Centers) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">
          {t('Interactive Learning Hubs', 'Сургалтын интерактив төвүүд')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* AI Teacher */}
          <button
            onClick={() => onNavigate('teacher')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              ✨
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('AI English Teacher', 'Багш Мими')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Chat in English with Mimi', 'Мимитэй англиар ярилцах')}</div>
          </button>

          {/* Speaking Lab */}
          <button
            onClick={() => onNavigate('speaking')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              🎙️
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Speaking Lab', 'Ярианы лаборатори')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Pronunciation & repeat practice', 'Дуудлага, давтан хэлэх')}</div>
          </button>

          {/* Drawing Studio */}
          <button
            onClick={() => onNavigate('drawing')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-pink-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              🎨
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Drawing Studio', 'Зургийн урлан')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Finger drawing & canvas studio', 'Хуруугаар зурах урлан')}</div>
          </button>

          {/* Stories */}
          <button
            onClick={() => onNavigate('stories')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              📖
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('English Stories', 'Англи үлгэрүүд')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Audio stories & comprehension', 'Аудио үлгэр, ойлгох асуулт')}</div>
          </button>

          {/* Vocabulary Dictionary */}
          <button
            onClick={() => onNavigate('dictionary')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              📚
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Vocabulary Dictionary', 'Үгсийн сан')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Search dictionary & flashcards', 'Хайлттай толь бичиг, флаш карт')}</div>
          </button>

          {/* Grammar School */}
          <button
            onClick={() => onNavigate('grammar')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              📘
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Grammar School', 'Дүрмийн танхим')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Grammar rules with explanations', 'Монгол тайлбартай дүрэм')}</div>
          </button>

          {/* Educational Games */}
          <button
            onClick={() => onNavigate('games')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              🎮
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Games Arcade', 'Тоглоомын төв')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Word puzzles & math race', 'Үг эвлүүлэх, ой тогтоолт')}</div>
          </button>

          {/* Rewards & World */}
          <button
            onClick={() => onNavigate('world')}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-yellow-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t("Mimi's World", 'Мимигийн ертөнц')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Rewards, outfits & badges', 'Шагнал, малгай, ертөнц')}</div>
          </button>

          {/* Parent Area */}
          <button
            onClick={onOpenParentArea}
            className="flex flex-col items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-200 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('Parent Area', 'Эцэг эхийн булан')}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t('Progress & settings', 'Ахиц дэвшил, тохиргоо')}</div>
          </button>
        </div>
      </div>
    </div>
  );
};
