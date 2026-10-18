import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Mic,
  MicOff,
  Languages,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { MimiMascot } from '../common/MimiMascot';
import { speechService } from '../../services/speechService';
import { sendTeacherMessage, TeacherResponse } from '../../services/geminiService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface ChatMessage {
  id: string;
  sender: 'mimi' | 'user';
  text: string;
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const isSister = activeProfile.id === 'sister';
    const initEn = isSister
      ? 'Hello little star! I am your English teacher Mimi! What is your favourite colour?'
      : 'Hello! I am your English teacher Mimi. Welcome to our speaking practice! What would you like to talk about today?';
    const initMn = isSister
      ? 'Сайн уу, бяцхан одон минь! Би бол англи хэлний багш Мими. Чиний дуртай өнгө юу вэ?'
      : 'Сайн байна уу! Би таны англи хэлний багш Мими байна. Өнөөдөр юуны тухай ярилцмаар байна вэ?';

    return [
      {
        id: 'msg-init',
        sender: 'mimi',
        text: initEn,
        subtitle: initEn,
        mongolianHint: initMn,
        encouragement: 'Welcome! You are doing awesome!',
        suggestedReplies: isSister
          ? ['I like blue.', 'I like red and yellow.', 'My favourite color is pink!']
          : ['Let us practice daily conversation.', 'Can you help me with ordering food?', 'I want to improve my grammar.'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingMimi, setIsSpeakingMimi] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [speechRate, setSpeechRate] = useState<0.75 | 1.0>(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial greeting speak
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'mimi') {
      speechService.speakEnglish(messages[0].text, {
        rate: speechRate,
        onEnd: () => setIsSpeakingMimi(false),
      });
      setIsSpeakingMimi(true);
    }
  }, []);

  const handleSpeakText = (text: string) => {
    speechService.playSoundEffect('pop');
    setIsSpeakingMimi(true);
    speechService.speakEnglish(text, {
      rate: speechRate,
      onEnd: () => setIsSpeakingMimi(false),
      onError: () => setIsSpeakingMimi(false),
    });
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
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'mimi' ? 'model' : 'user',
        content: m.text,
      }));

      const teacherRes: TeacherResponse = await sendTeacherMessage(
        text,
        activeProfile.id,
        historyPayload
      );

      const mimiMsg: ChatMessage = {
        id: 'mim-' + Date.now(),
        sender: 'mimi',
        text: teacherRes.speechText,
        subtitle: teacherRes.subtitle,
        mongolianHint: teacherRes.mongolianHint,
        encouragement: teacherRes.encouragement,
        suggestedReplies: teacherRes.suggestedReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mimiMsg]);
      setIsLoading(false);

      // Mimi speaks aloud in English only
      handleSpeakText(teacherRes.speechText);
      fireCelebrationConfetti();
    } catch (err) {
      setIsLoading(false);
      const fallbackEn = 'Good effort! Keep practicing speaking in English. You are doing great!';
      const mimiMsg: ChatMessage = {
        id: 'mim-err-' + Date.now(),
        sender: 'mimi',
        text: fallbackEn,
        subtitle: fallbackEn,
        mongolianHint: 'Сайн оролдлоо! Англиар үргэлжлүүлэн яриад байгаарай.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mimiMsg]);
      handleSpeakText(fallbackEn);
    }
  };

  // Optional microphone recognition
  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Таны хөтөч дээр дуу хоолой таних систем дэмжигдээгүй байна. Доорх талбарт бичиж оролцоорой!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        speechService.playSoundEffect('pop');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputVal(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[820px] bg-white dark:bg-slate-800 rounded-3xl border border-purple-100 dark:border-slate-700 shadow-md overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold">Багш Мими (AI English Teacher)</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-slate-900">
                English Voice Only
              </span>
            </div>
            <p className="text-xs text-purple-100">
              Суралцагч: {activeProfile.displayNameMn} · Эелдэг найрсаг англи яриа
            </p>
          </div>
        </div>

        {/* Speed & Hint Toggles */}
        <div className="flex items-center gap-2">
          {/* Rate button */}
          <button
            onClick={() => {
              const next = speechRate === 1.0 ? 0.75 : 1.0;
              setSpeechRate(next);
              speechService.playSoundEffect('click');
            }}
            title="Дуудлагын хурд"
            className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
          >
            {speechRate === 1.0 ? '1.0x Хэвийн' : '0.75x Удаан'}
          </button>

          {/* Mongolian hints toggle */}
          <button
            onClick={() => setShowHints(!showHints)}
            title="Монгол бичгэн тайлбарыг асаах / унтраах"
            className={`p-1.5 rounded-xl transition-colors ${
              showHints ? 'bg-yellow-400 text-slate-900' : 'bg-white/20 text-white'
            }`}
          >
            <Languages className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60 dark:bg-slate-900/40">
        {messages.map((m) => {
          const isMimi = m.sender === 'mimi';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isMimi ? 'justify-start' : 'justify-end'}`}
            >
              {isMimi && (
                <div className="shrink-0 pt-1">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-lg">
                    🦉
                  </div>
                </div>
              )}

              <div className={`space-y-1.5 max-w-[85%] sm:max-w-md ${isMimi ? 'items-start' : 'items-end'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-3xl shadow-sm text-sm ${
                    isMimi
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-purple-100 dark:border-slate-700 rounded-tl-sm'
                      : 'bg-purple-600 text-white rounded-tr-sm font-medium'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Written Mongolian hint (if enabled) */}
                  {isMimi && showHints && m.mongolianHint && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-purple-700 dark:text-purple-300">
                      💡 {m.mongolianHint}
                    </div>
                  )}

                  {/* Encouragement note */}
                  {isMimi && m.encouragement && (
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{m.encouragement}</span>
                    </div>
                  )}
                </div>

                {/* Subtitle / Word Replay button for Mimi messages */}
                {isMimi && (
                  <div className="flex items-center gap-2 px-1">
                    <button
                      onClick={() => handleSpeakText(m.text)}
                      className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Англиар дахин сонсох</span>
                    </button>
                    <span className="text-slate-300 text-[10px]">·</span>
                    <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                  </div>
                )}

                {/* Suggested Reply Chips */}
                {isMimi && m.suggestedReplies && m.suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(reply)}
                        className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition-all text-left"
                      >
                        💬 {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isMimi && (
                <div className="shrink-0 pt-1">
                  <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    {activeProfile.avatar}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 p-2">
            <span className="animate-spin text-base">⏳</span>
            <span>Багш Мими хариултаа бэлтгэж байна...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Optional Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            title={isRecording ? 'Бичлэгийг зогсоох' : 'Англиар микрофоноор ярих'}
            className={`p-3 rounded-2xl transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-100'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your English response or choose a chip..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-all shadow-md active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
