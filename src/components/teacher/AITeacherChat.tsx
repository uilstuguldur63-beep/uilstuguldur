import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Languages,
  HelpCircle,
  CheckCircle2,
  Square,
  Calculator,
  BookOpen,
  Puzzle,
  Lightbulb,
} from 'lucide-react';
import { UserProfile, getDifficultyStage } from '../../types';
import { MimiMascot } from '../common/MimiMascot';
import { speechService } from '../../services/speechService';
import { sendTeacherMessage, TeacherResponse } from '../../services/geminiService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { storageService } from '../../services/storageService';
import { useTranslation } from '../../context/TranslationContext';

interface ChatMessage {
  id: string;
  sender: 'mimi' | 'user';
  text: string;
  language?: 'mn' | 'en';
  subtitle?: string;
  mongolianHint?: string;
  encouragement?: string;
  suggestedReplies?: string[];
  timestamp: string;
}

interface AITeacherChatProps {
  activeProfile: UserProfile;
}

export const AITeacherChat: React.FC<AITeacherChatProps> = ({ activeProfile }) => {
  const { t, isTranslated } = useTranslation();
  const isMom = activeProfile.id === 'mom';
  const stage = getDifficultyStage(activeProfile.level);

  // Language mode: 'auto' | 'mn' | 'en'
  const [languageMode, setLanguageMode] = useState<'auto' | 'mn' | 'en'>('auto');

  // Load chat messages per profile so Mom and Sister conversations remain separate and preserved
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const storageKey = `miniidvv_chat_history_${activeProfile.id}`;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore error
        }
      }
    }

    // Dynamic initial greeting that differs by learner and translation state
    const initialGreeting = isMom
      ? isTranslated
        ? {
            text: `Сайн байна уу! Би таны ухаалаг туслагч багш Мими байна (Түвшин ${activeProfile.level} - ${stage.stageMn}). Англи хэлний өдөр тутмын яриа, дүрмийн онцлог, математикийн бодлого эсвэл үг бүтээх сорилын алинаас нь эхлэх үү? Та монголоор ч, англиар ч бичиж болно шүү.`,
            lang: 'mn' as const,
            sub: `Hello! I am your bilingual tutor Mimi (Level ${activeProfile.level}). What would you like to explore today: practical conversation, grammar, math or word puzzles?`,
            hint: 'Монгол болон Англи хэлний аль алинаар нь харилцах боломжтой.',
            suggestions: [
              'Дэлгүүрт болон ресторанд хэрэглэх яриа заагаач',
              'Математикийн бодлого бодъё',
              'Үг бүтээх таавар таая',
            ],
          }
        : {
            text: `Hello! I am your friendly AI tutor Mimi (Level ${activeProfile.level} - ${stage.stage}). What would you like to explore today: daily English conversations, grammar rules, math problems, or word building? You can chat in English or Mongolian!`,
            lang: 'en' as const,
            sub: `Сайн байна уу! Би таны багш Мими байна. Англи яриа, дүрэм, тоо, үг бүтээх талаар хүссэн зүйлээ асуугаарай!`,
            hint: 'Feel free to chat in English or Mongolian at any time.',
            suggestions: [
              'Teach me daily shopping & restaurant dialogue',
              'Let us solve a math puzzle',
              'Practice word building and vocabulary',
            ],
          }
      : isTranslated
      ? {
          text: `Сайн уу, бяцхан дүү минь! Багш Мими нь чамдаа туслахад үргэлж бэлэн (Түвшин ${activeProfile.level} - ${stage.stageMn})! Гоё зурагтай үгс сурах уу, хөөрхөн амьтдын нэр цээжлэх үү, эсвэл тоо тоолж тоглох уу?`,
          lang: 'mn' as const,
          sub: `Hello sweet learner! I am Mimi. Would you like to learn words with pictures, animal names or count numbers?`,
          hint: 'Асуух зүйлээ монголоор эсвэл англиар бичээрэй.',
          suggestions: ['Өнгөнүүдийг зааж өгөөч 🎨', '1-ээс 10 хүртэл хамт тоолъё 🔢', 'Хөөрхөн амьтдын нэр 🐱'],
        }
      : {
          text: `Hello little star! Teacher Mimi is here to help you learn and play (Level ${activeProfile.level} - ${stage.stage})! Would you like to explore colorful words, learn animal names, or count numbers with me?`,
          lang: 'en' as const,
          sub: `Сайн уу бяцхан одон минь! Мими багш нь чамдаа үг, тоо, үсэг сурахад туслахад бэлэн байна!`,
          hint: 'You can write in English or Mongolian.',
          suggestions: ['Teach me fun colors 🎨', 'Count 1 to 10 with me 🔢', 'Cute animal names 🐱'],
        };

    return [
      {
        id: 'msg-init-' + Date.now(),
        sender: 'mimi',
        text: initialGreeting.text,
        language: initialGreeting.lang,
        subtitle: initialGreeting.sub,
        mongolianHint: initialGreeting.hint,
        encouragement: isTranslated
          ? 'Би тантай суралцахдаа үргэлж баяртай байдаг!'
          : 'I am always delighted to learn with you!',
        suggestedReplies: initialGreeting.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [speechRate, setSpeechRate] = useState<0.75 | 1.0>(1.0);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Save conversation history per profile so switching profiles or views doesn't lose context
  useEffect(() => {
    const storageKey = `miniidvv_chat_history_${activeProfile.id}`;
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    }
  }, [messages, activeProfile.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Audio speech handling: strictly checks language and uses correct voice
  const handleSpeakText = (msgId: string, text: string, lang?: 'mn' | 'en') => {
    if (currentlySpeakingId === msgId) {
      speechService.stop();
      setCurrentlySpeakingId(null);
      return;
    }

    speechService.playSoundEffect('click');
    setCurrentlySpeakingId(msgId);

    const isCyrillic = /[\u0400-\u04FF]/.test(text);
    const targetLang = lang === 'mn' || isCyrillic ? 'mn' : 'en';

    if (targetLang === 'mn') {
      speechService.speakMongolian(text, {
        rate: speechRate,
        onEnd: () => setCurrentlySpeakingId(null),
        onError: () => setCurrentlySpeakingId(null),
      });
    } else {
      speechService.speakEnglish(text, {
        rate: speechRate,
        onEnd: () => setCurrentlySpeakingId(null),
        onError: () => setCurrentlySpeakingId(null),
      });
    }
  };

  const handleStopAudio = () => {
    speechService.stop();
    setCurrentlySpeakingId(null);
  };

  const handleClearHistory = () => {
    speechService.playSoundEffect('pop');
    const storageKey = `miniidvv_chat_history_${activeProfile.id}`;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }

    const resetMsg: ChatMessage = {
      id: 'msg-fresh-' + Date.now(),
      sender: 'mimi',
      text: isMom
        ? `Шинэ яриаг эхлүүллээ. Танд юугаар туслах вэ? Англи хэл, дүрэм, тоо, эсвэл үг бүтээх сорил уу?`
        : `Шинэ яриа эхэллээ! Мими багшаасаа юу ч хамаагүй асуугаарай бяцхан найз минь!`,
      language: 'mn',
      subtitle: `Starting a fresh chat! What would you like to learn now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: isMom
        ? ['Англи өдөр тутмын хэллэгүүд', '15 * 8 хэд вэ?', 'Зөв бичих дүрмээс асууя']
        : ['Би мууранд дуртай', 'Алим гэж яаж бичих вэ?', '10 хүртэл тоолъё'],
    };
    setMessages([resetMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    speechService.playSoundEffect('click');
    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Send conversation history so Mimi has memory and never repeats answers
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.sender === 'mimi' ? 'model' : 'user',
        content: m.text,
      }));

      const teacherRes: TeacherResponse = await sendTeacherMessage(
        text,
        activeProfile.id,
        activeProfile.level,
        languageMode,
        historyPayload
      );

      const mimiMsg: ChatMessage = {
        id: 'mim-' + Date.now(),
        sender: 'mimi',
        text: teacherRes.speechText,
        language: teacherRes.language,
        subtitle: teacherRes.subtitle,
        mongolianHint: teacherRes.mongolianHint,
        encouragement: teacherRes.encouragement,
        suggestedReplies: teacherRes.suggestedReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mimiMsg]);
      setIsLoading(false);

      // Award small EXP for asking thoughtful questions
      storageService.addExp(5);
    } catch (err) {
      setIsLoading(false);
      const errorMsg: ChatMessage = {
        id: 'mim-err-' + Date.now(),
        sender: 'mimi',
        text: 'Уучлаарай, сүлжээнд бага зэрэг саатал гарлаа. Гэхдээ би таныг сонсож байна. Дахин оролдоно уу!',
        language: 'mn',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="shrink-0 p-1.5 rounded-2xl bg-white/10 backdrop-blur-md">
            <MimiMascot
              size="sm"
              mood={isLoading ? 'thinking' : currentlySpeakingId ? 'talking' : 'happy'}
              isSpeaking={!!currentlySpeakingId}
              equippedHat={activeProfile.equippedHat}
              equippedAccessory={activeProfile.equippedAccessory}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-display">
                {t('Teacher Mimi (Bilingual Tutor)', 'Багш Мими (Ухаалаг Туслагч)')}
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-yellow-300">
                {t(`Level ${activeProfile.level} · ${stage.stage}`, `Түвшин ${activeProfile.level} · ${stage.stageMn}`)}
              </span>
            </div>
            <p className="text-xs text-purple-100/90 mt-0.5">
              {isMom
                ? t(
                    'Conversational English, grammar, word building & math for Mom',
                    'Ээжид зориулсан ярианы англи хэл, дүрэм, үг бүтээх ба тоо бодлого'
                  )
                : t(
                    'Friendly helper, picture words, letters & numbers for Little Sister',
                    'Дүүд зориулсан эелдэг туслагч, зурагт үгс, үсэг ба тоо'
                  )}
            </p>
          </div>
        </div>

        {/* Controls: Language Selector & Clear Chat */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <button
              onClick={() => {
                speechService.playSoundEffect('click');
                setLanguageMode('auto');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                languageMode === 'auto'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-100 hover:text-white'
              }`}
            >
              {t('Auto', 'Автомат')}
            </button>
            <button
              onClick={() => {
                speechService.playSoundEffect('click');
                setLanguageMode('mn');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                languageMode === 'mn'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-100 hover:text-white'
              }`}
            >
              🇲🇳 {t('Mongolian', 'Монгол')}
            </button>
            <button
              onClick={() => {
                speechService.playSoundEffect('click');
                setLanguageMode('en');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                languageMode === 'en'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-100 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            title={t('Start new conversation', 'Шинэ яриа эхлүүлэх')}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all text-xs font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('New Chat', 'Шинэ яриа')}</span>
          </button>
        </div>
      </div>

      {/* Suggested Topic Starter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-semibold shrink-0">{t('Topic Ideas:', 'Сэдэв сонгох:')}</span>
        <button
          onClick={() => handleSendMessage(isMom ? (isTranslated ? 'Өдөр тутмын хэрэглээний яриа дадлагажъя' : 'Let us practice daily shopping conversation') : (isTranslated ? 'Хөөрхөн амьтдын нэрийг англиар заагаач' : 'Teach me cute animal names in English'))}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 font-medium hover:bg-purple-50 transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isMom ? t('🇬🇧 Daily Conversation', '🇬🇧 Өдөр тутмын яриа') : t('🐱 Animal Names', '🐱 Амьтдын нэрс')}</span>
        </button>
        <button
          onClick={() => handleSendMessage(isMom ? (isTranslated ? '125 + 75 хэд вэ? Бас үржүүлэх бодлого өгөөч' : 'What is 125 + 75? Give me a mental math problem.') : (isTranslated ? '5 дээр 3-ыг нэмбэл хэд болох вэ?' : 'What is 5 plus 3? Let us count together.'))}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-medium hover:bg-sky-50 transition-colors flex items-center gap-1.5"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t('➕ Math Problem', '➕ Математикийн бодлого')}</span>
        </button>
        <button
          onClick={() => handleSendMessage(isMom ? (isTranslated ? 'Эрдэм гэдэг үгнээс үг бүтээх дасгал хийе' : 'Give me a word-making puzzle') : (isTranslated ? 'Цагаан толгойн үндсэн 7 эгшиг юу вэ?' : 'What are the vowels in English and Mongolian?'))}
          className="shrink-0 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 text-pink-700 dark:text-pink-300 font-medium hover:bg-pink-50 transition-colors flex items-center gap-1.5"
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>{isMom ? t('🧩 Word Building', '🧩 Үг бүтээх дасгал') : t('📚 Vowels Lesson', '📚 Үндсэн 7 эгшиг')}</span>
        </button>
      </div>

      {/* Main Messages Container */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-h-[380px] max-h-[540px] overflow-y-auto">
        {messages.map((msg) => {
          const isMimi = msg.sender === 'mimi';
          const isPlayingThis = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isMimi ? 'justify-start' : 'justify-end'}`}
            >
              {isMimi && (
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0 text-base">
                  🦉
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 space-y-2 shadow-sm ${
                  isMimi
                    ? 'bg-purple-50/80 dark:bg-slate-800 border border-purple-100 dark:border-purple-900/30 text-slate-800 dark:text-slate-100'
                    : 'bg-purple-600 text-white rounded-tr-sm'
                }`}
              >
                {/* Message Header with Audio and Language Badge */}
                {isMimi && (
                  <div className="flex items-center justify-between gap-2 border-b border-purple-100 dark:border-slate-700/60 pb-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                      <span>Мими Багш</span>
                      {msg.language && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-200/70 dark:bg-purple-900/60 text-[10px] uppercase">
                          {msg.language}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleSpeakText(msg.id, msg.text, msg.language)}
                      title="Дуудлага сонсох"
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                        isPlayingThis
                          ? 'bg-purple-600 text-white animate-pulse'
                          : 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {isPlayingThis ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isPlayingThis ? 'Зогсоох' : 'Сонсох'}</span>
                    </button>
                  </div>
                )}

                {/* Main Speech Content */}
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Subtitle / Translation */}
                {isMimi && msg.subtitle && msg.subtitle !== msg.text && (
                  <div className="pt-1.5 border-t border-purple-100/60 dark:border-slate-700/40 text-xs text-slate-500 dark:text-slate-400 italic">
                    💡 {msg.subtitle}
                  </div>
                )}

                {/* Helpful Tip / Grammar Hint */}
                {isMimi && msg.mongolianHint && (
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{msg.mongolianHint}</span>
                  </div>
                )}

                {/* Encouragement */}
                {isMimi && msg.encouragement && (
                  <div className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold">
                    ✨ {msg.encouragement}
                  </div>
                )}

                {/* Dynamic Suggested Replies */}
                {isMimi && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700/80 border border-purple-200 dark:border-slate-600 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-100 transition-colors text-left"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
                    isMimi ? 'text-slate-400' : 'text-purple-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0">
              🦉
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>Мими багш бодож хариулж байна...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form with Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 shadow-md focus-within:border-purple-500 transition-colors"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            isMom
              ? 'Англи, монгол, математик, үг бүтээх талаар асуугаарай...'
              : 'Мими багшаасаа юу ч хамаагүй асуугаарай (тоо, үг, үсэг)...'
          }
          className="flex-1 px-3 py-2 text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold disabled:opacity-40 shadow-sm active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
