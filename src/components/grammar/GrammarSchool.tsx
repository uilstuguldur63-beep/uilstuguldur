import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, GrammarLesson } from '../../types';
import { grammarLessons } from '../../data/grammarData';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface GrammarSchoolProps {
  activeProfile: UserProfile;
  onCompleteLesson: () => void;
}

export const GrammarSchool: React.FC<GrammarSchoolProps> = ({
  activeProfile,
  onCompleteLesson,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleSpeak = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    speechService.playSoundEffect('click');
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedLesson) return;
    setIsQuizSubmitted(true);
    let correct = 0;
    selectedLesson.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) correct++;
    });

    if (correct === selectedLesson.quiz.length) {
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
      speechService.speakEnglish('Outstanding work! Grammar mastered!');
      onCompleteLesson();
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📘</span>
            <span>Дүрмийн сургууль (Grammar School)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Дүрмийн монгол бичгэн тайлбар, англи дуут жишээ, интерактив шалгалт.
          </p>
        </div>
      </div>

      {selectedLesson ? (
        /* Detailed Lesson View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-3xl mx-auto">
          {/* Back button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setSelectedLesson(null);
                setQuizAnswers({});
                setIsQuizSubmitted(false);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Бүх дүрмийн жагсаалт руу буцах</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              {selectedLesson.title}
            </span>
          </div>

          {/* Lesson Title & Summary */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedLesson.titleMn}
            </h2>
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
              {selectedLesson.title}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedLesson.summaryMn}
            </p>
          </div>

          {/* Written Mongolian Rule Explanation */}
          <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2">
            <div className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>📖</span>
              <span>Дүрмийн монгол тайлбар:</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-950 dark:text-purple-100 whitespace-pre-line leading-relaxed">
              {selectedLesson.ruleExplanationMn}
            </p>
          </div>

          {/* Spoken English Examples */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Жишээ өгүүлбэрүүд (Товшиж англиар сонсох):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedLesson.examples.map((ex, i) => (
                <div
                  key={i}
                  onClick={() => handleSpeak(ex.en)}
                  className="cursor-pointer p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-all flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {ex.en}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {ex.mn}
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Practice Quiz */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Дүрмийн сорил шалгалт</span>
            </div>

            {selectedLesson.quiz.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="text-xs font-bold text-purple-600">
                  Асуулт #{qIdx + 1}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">
                  {q.question}
                </div>

                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = quizAnswers[qIdx] === optIdx;
                    const isRight = isQuizSubmitted && optIdx === q.correctIndex;
                    const isWrong = isQuizSubmitted && isChosen && optIdx !== q.correctIndex;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        disabled={isQuizSubmitted}
                        className={`w-full p-3 rounded-xl text-left text-xs font-bold border transition-all ${
                          isRight
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : isWrong
                            ? 'bg-rose-50 border-rose-500 text-rose-800'
                            : isChosen
                            ? 'bg-purple-100 border-purple-500 text-purple-900'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isQuizSubmitted && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    💡 {q.explanationMn}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end pt-2">
              {!isQuizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-40"
                >
                  Шалгах & Хичээл дуусгах (+3 ⭐, +10 🪙)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedLesson(null);
                    setQuizAnswers({});
                    setIsQuizSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Бүх дүрэм рүү буцах
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lessons Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grammarLessons.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                speechService.playSoundEffect('click');
                setSelectedLesson(g);
              }}
              className="cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 inline-block mb-3 group-hover:scale-110 transition-transform">
                  📘
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {g.titleMn}
                </h3>
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                  {g.title}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {g.summaryMn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>Дүрэм үзэх</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
