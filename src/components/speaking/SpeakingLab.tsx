import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Award,
  Play,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { useTranslation } from '../../context/TranslationContext';

interface SpeakingLabProps {
  activeProfile: UserProfile;
  onCompleteExercise: () => void;
}

export const SpeakingLab: React.FC<SpeakingLabProps> = ({ activeProfile, onCompleteExercise }) => {
  const { t, isTranslated } = useTranslation();
  const [activeTab, setActiveTab] = useState<'repeat' | 'listening' | 'pronunciation'>('repeat');
  const [speechSpeed, setSpeechSpeed] = useState<0.75 | 1.0>(1.0);
  const [accent, setAccent] = useState<'en-US' | 'en-GB'>('en-US');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [typedFallback, setTypedFallback] = useState('');
  const [listenChosen, setListenChosen] = useState<string | null>(null);
  const [isListenCorrect, setIsListenCorrect] = useState<boolean | null>(null);

  // 1. Repeat-After-Me Phrases
  const repeatPhrases = [
    {
      phrase: 'Good morning, teacher!',
      mnHint: 'Өглөөний мэнд, багш аа!',
      words: ['Good', 'morning', 'teacher'],
      difficulty: 'Easy',
    },
    {
      phrase: 'My favourite colour is blue.',
      mnHint: 'Миний дуртай өнгө бол цэнхэр.',
      words: ['My', 'favourite', 'colour', 'is', 'blue'],
      difficulty: 'Easy',
    },
    {
      phrase: 'Can I have an apple, please?',
      mnHint: 'Би нэг алим авч болох уу, гуйж байна?',
      words: ['Can', 'I', 'have', 'an', 'apple', 'please'],
      difficulty: 'Medium',
    },
    {
      phrase: 'The little rabbit hops across the green grass.',
      mnHint: 'Бяцхан туулай ногоон зүлгэн дээгүүр дэгдэнэ.',
      words: ['The', 'little', 'rabbit', 'hops', 'across', 'the', 'green', 'grass'],
      difficulty: 'Hard',
    },
  ];

  // 2. Listening Comprehension Questions
  const listeningExercises = [
    {
      audioPhrase: 'The yellow duck is swimming in the pond.',
      question: 'Which animal is swimming?',
      options: ['A rabbit', 'A duck', 'A horse'],
      correct: 'A duck',
      mnHint: 'Усанд сэлж буй амьтан аль нь вэ?',
    },
    {
      audioPhrase: 'Please put your red pencil on the table.',
      question: 'Where should you put the pencil?',
      options: ['Under the chair', 'On the table', 'In the bag'],
      correct: 'On the table',
      mnHint: 'Харандааг хаана тавихыг хүссэн бэ?',
    },
    {
      audioPhrase: 'There are five juicy strawberries in the bowl.',
      question: 'How many strawberries are there?',
      options: ['Three', 'Five', 'Ten'],
      correct: 'Five',
      mnHint: 'Нийт хэдэн гүзээлзгэнэ байсан бэ?',
    },
  ];

  const currentRepeat = repeatPhrases[currentIndex % repeatPhrases.length];
  const currentListening = listeningExercises[currentIndex % listeningExercises.length];

  const handlePlayAudio = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text, { rate: speechSpeed, accent });
  };

  const handleStartRecognition = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Таны хөтөч дуу таних систем дэмжээгүй тул доорх бичих талбарт хариултаа бичиж шалгаарай!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = accent;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsRecording(true);
        speechService.playSoundEffect('pop');
      };

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setRecognizedText(text);
        evaluatePronunciation(text, currentRepeat.phrase);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      rec.start();
    } catch {
      setIsRecording(false);
    }
  };

  const evaluatePronunciation = (userSpoken: string, targetPhrase: string) => {
    const cleanSpoken = userSpoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = targetPhrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    const targetWords = cleanTarget.split(' ');
    const spokenWords = cleanSpoken.split(' ');

    let matches = 0;
    targetWords.forEach((tw) => {
      if (spokenWords.includes(tw)) matches++;
    });

    const score = Math.round((matches / targetWords.length) * 100);
    setMatchScore(score);

    if (score >= 70) {
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      speechService.speakEnglish('Terrific pronunciation! Well done!');
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎙️</span>
            <span>Сонсох & Ярих төв (Speaking & Listening Lab)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Англи багшийн дуудлага, үг бүрээр давтах, сонсоод зөв хариуг сонгох төв.
          </p>
        </div>

        {/* Accent and Speed controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Accent toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => {
                setAccent('en-US');
                speechService.playSoundEffect('click');
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                accent === 'en-US' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' : 'text-slate-500'
              }`}
            >
              🇺🇸 American
            </button>
            <button
              onClick={() => {
                setAccent('en-GB');
                speechService.playSoundEffect('click');
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                accent === 'en-GB' ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' : 'text-slate-500'
              }`}
            >
              🇬🇧 British
            </button>
          </div>

          {/* Speed toggle */}
          <button
            onClick={() => {
              setSpeechSpeed(speechSpeed === 1.0 ? 0.75 : 1.0);
              speechService.playSoundEffect('click');
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold"
          >
            {speechSpeed === 1.0 ? '1.0x Хэвийн' : '0.75x Удаан'}
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('repeat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'repeat'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🗣️</span>
          <span>Давтан хэлэх (Repeat-after-me)</span>
        </button>

        <button
          onClick={() => setActiveTab('listening')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'listening'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <span>🎧</span>
          <span>Сонсох дасгал (Listening comprehension)</span>
        </button>
      </div>

      {/* Tab 1: Repeat After Me */}
      {activeTab === 'repeat' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-2xl mx-auto text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              Дасгал #{currentIndex + 1} · {currentRepeat.difficulty}
            </span>
            <div className="text-xs text-slate-400 mt-2">
              Англи багшийн өгүүлбэрийг сонсоод яг адил дуудлагаар даган хэлээрэй.
            </div>
          </div>

          {/* Main Phrase Card */}
          <div className="p-6 rounded-3xl bg-purple-50/60 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 space-y-4">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
              "{currentRepeat.phrase}"
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
              💡 {currentRepeat.mnHint}
            </div>

            {/* Word-by-word replay buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {currentRepeat.words.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePlayAudio(w)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-purple-100 shadow-sm flex items-center gap-1 active:scale-95"
                  title="Товшиж тухайн үгийн дуудлагыг сонсох"
                >
                  <Volume2 className="w-3 h-3 text-purple-600" />
                  <span>{w}</span>
                </button>
              ))}
            </div>

            {/* Full sentence listen button */}
            <div className="pt-2">
              <button
                onClick={() => handlePlayAudio(currentRepeat.phrase)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Бүтэн өгүүлбэрийг сонсох</span>
              </button>
            </div>
          </div>

          {/* Speaking Practice Action */}
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleStartRecognition}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                  isRecording
                    ? 'bg-rose-500 scale-110 animate-pulse ring-4 ring-rose-200'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 active:scale-95'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <span className="text-xs font-semibold text-slate-500">
                {isRecording ? 'Сонсож байна... Англиар хэлнэ үү!' : 'Микрофон дээр дарж дуугаа бичүүлнэ үү'}
              </span>
            </div>

            {/* Evaluation Result */}
            {recognizedText && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="text-slate-500">
                  Таны хэлсэн: <span className="font-bold text-slate-900 dark:text-white">"{recognizedText}"</span>
                </div>
                {matchScore !== null && (
                  <div className="flex items-center justify-center gap-1 font-bold text-sm">
                    <span>Тохирол:</span>
                    <span className={matchScore >= 70 ? 'text-emerald-600' : 'text-amber-500'}>
                      {matchScore}%
                    </span>
                    {matchScore >= 70 ? ' 🌟 Шилдэг дуудлага!' : ' 👏 Дахин нэг удаа давтаад үзээрэй!'}
                  </div>
                )}
              </div>
            )}

            {/* Typed Fallback */}
            <div className="pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typedFallback) {
                    evaluatePronunciation(typedFallback, currentRepeat.phrase);
                  }
                }}
                className="flex items-center gap-2 max-w-sm mx-auto"
              >
                <input
                  type="text"
                  value={typedFallback}
                  onChange={(e) => setTypedFallback(e.target.value)}
                  placeholder="Эсвэл энд гараас бичиж шалгах..."
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold"
                >
                  Шалгах
                </button>
              </form>
            </div>
          </div>

          {/* Navigation to next phrase */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
                setRecognizedText('');
                setMatchScore(null);
              }}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ◀ Өмнөх
            </button>
            <button
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setRecognizedText('');
                setMatchScore(null);
                onCompleteExercise();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <span>Дараагийн өгүүлбэр</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Listening Comprehension */}
      {activeTab === 'listening' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-sky-100 dark:border-slate-700 shadow-md space-y-6 max-w-xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
              Сонсоод хариулах #{currentIndex + 1}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentListening.question}
            </h3>
            <p className="text-xs text-slate-500">
              💡 {currentListening.mnHint}
            </p>

            <button
              onClick={() => handlePlayAudio(currentListening.audioPhrase)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Англи эхийг сонсох</span>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentListening.options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setListenChosen(opt);
                  handlePlayAudio(opt);
                  if (opt === currentListening.correct) {
                    setIsListenCorrect(true);
                    speechService.playSoundEffect('correct');
                    fireCelebrationConfetti();
                  } else {
                    setIsListenCorrect(false);
                    speechService.playSoundEffect('wrong');
                  }
                }}
                className={`w-full p-4 rounded-2xl text-left font-bold text-sm border-2 transition-all flex items-center justify-between ${
                  listenChosen === opt
                    ? isListenCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-100'
                }`}
              >
                <span>{opt}</span>
                <Volume2 className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          {isListenCorrect === true && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-center text-sm">
              🎉 Маш сайн! Зөв сонсож хариуллаа!
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setListenChosen(null);
                setIsListenCorrect(null);
                onCompleteExercise();
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
            >
              Дараагийн дасгал ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
