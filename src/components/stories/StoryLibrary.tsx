import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { Story, UserProfile } from '../../types';
import { englishStories } from '../../data/storiesData';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface StoryLibraryProps {
  activeProfile: UserProfile;
  onCompleteStory: (storyId: string) => void;
}

export const StoryLibrary: React.FC<StoryLibraryProps> = ({ activeProfile, onCompleteStory }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [pageIndex, setPageIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'Бүх үлгэрүүд' },
    { id: 'animals', label: 'Амьтдын ертөнц' },
    { id: 'friendship', label: 'Үерхэл нөхөрлөл' },
    { id: 'nature', label: 'Байгаль дэлхий' },
  ];

  const filteredStories = englishStories.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  const handleOpenStory = (story: Story) => {
    speechService.playSoundEffect('click');
    setSelectedStory(story);
    setPageIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setIsReadingMode(true);

    // Read first sentence aloud
    if (story.pages[0]) {
      speechService.speakEnglish(story.pages[0].englishText);
    }
  };

  const handleSpeakSentence = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text);
  };

  const handleSpeakWord = (word: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(word);
  };

  const handleNextPage = () => {
    if (!selectedStory) return;
    if (pageIndex < selectedStory.pages.length - 1) {
      const nextIdx = pageIndex + 1;
      setPageIndex(nextIdx);
      speechService.playSoundEffect('click');
      handleSpeakSentence(selectedStory.pages[nextIdx].englishText);
    } else {
      // Reached quiz
      setPageIndex(selectedStory.pages.length);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      const prevIdx = pageIndex - 1;
      setPageIndex(prevIdx);
      speechService.playSoundEffect('click');
      if (selectedStory && selectedStory.pages[prevIdx]) {
        handleSpeakSentence(selectedStory.pages[prevIdx].englishText);
      }
    }
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    speechService.playSoundEffect('click');
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!selectedStory) return;
    setQuizSubmitted(true);
    let correctCount = 0;
    selectedStory.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) correctCount++;
    });

    if (correctCount >= 2) {
      speechService.playSoundEffect('star');
      fireCelebrationConfetti();
      speechService.speakEnglish('Hooray! You completed the story quiz with flying colors!');
      onCompleteStory(selectedStory.id);
    } else {
      speechService.playSoundEffect('wrong');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* If in Reading Mode */}
      {selectedStory && isReadingMode ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-3xl mx-auto">
          {/* Top navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setIsReadingMode(false);
                speechService.stop();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Үлгэрийн жагсаалт руу буцах</span>
            </button>

            {/* Translation toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                showTranslation
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Монгол орчуулга: {showTranslation ? 'Нээлттэй' : 'Хаалттай'}</span>
            </button>
          </div>

          {/* If reading Story Pages */}
          {pageIndex < selectedStory.pages.length ? (
            (() => {
              const page = selectedStory.pages[pageIndex];
              return (
                <div className="space-y-6">
                  {/* Page indicator & emoji illustration banner */}
                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      Хуудас {pageIndex + 1} / {selectedStory.pages.length}
                    </span>
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-5xl shadow-inner border border-purple-100 dark:border-purple-800">
                      {page.emoji}
                    </div>
                  </div>

                  {/* English Text Box */}
                  <div className="p-6 rounded-3xl bg-purple-50/50 dark:bg-slate-700/40 border-2 border-purple-100 dark:border-purple-900/40 space-y-4 text-center">
                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                      {page.englishText}
                    </p>

                    {/* Character speech callout if exists */}
                    {page.characterSpeech && (
                      <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-600 text-sm font-semibold text-purple-900 dark:text-purple-200 shadow-sm">
                        🗣️ <span className="text-purple-600 font-bold">{page.characterSpeech.speaker}:</span> "{page.characterSpeech.line}"
                      </div>
                    )}

                    {/* Written Mongolian Translation */}
                    {showTranslation && (
                      <div className="pt-3 border-t border-purple-100 dark:border-slate-600 text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                        {page.mongolianTranslation}
                      </div>
                    )}

                    {/* Tap to hear individual words */}
                    <div className="pt-3">
                      <div className="text-[11px] font-bold text-slate-400 mb-2">
                        Үг бүрийн дуудлагыг сонсох:
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {page.keyWords.map((kw, i) => (
                          <button
                            key={i}
                            onClick={() => handleSpeakWord(kw)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-100 flex items-center gap-1 active:scale-95"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{kw}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Replay full sentence audio */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleSpeakSentence(page.englishText)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Өгүүлбэрийг дахин сонсох</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation footer */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={pageIndex === 0}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Өмнөх хуудас</span>
                    </button>

                    <button
                      onClick={handleNextPage}
                      className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                    >
                      <span>
                        {pageIndex === selectedStory.pages.length - 1 ? 'Сорил өгөх ➔' : 'Дараах хуудас'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            /* Story Quiz at the end */
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-3xl">🏆</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Үлгэр ойлгосон эсэхээ шалгах сорил
                </h3>
                <p className="text-xs text-slate-500">
                  Зөв хариултуудыг сонгож сорилоо амжилттай дуусгаарай!
                </p>
              </div>

              <div className="space-y-4">
                {selectedStory.quiz.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="text-xs font-bold text-purple-600">
                      Асуулт #{qIdx + 1}:
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = quizAnswers[qIdx] === optIdx;
                        const isRight = quizSubmitted && optIdx === q.correctIndex;
                        const isWrong = quizSubmitted && isChosen && optIdx !== q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(qIdx, optIdx)}
                            disabled={quizSubmitted}
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

                    {quizSubmitted && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                        💡 {q.explanationMn}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  onClick={() => setPageIndex(0)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Үлгэрийг дахин унших</span>
                </button>

                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < selectedStory.quiz.length}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-40"
                  >
                    Сорилоо дуусгах (+5 ⭐, +15 🪙)
                  </button>
                ) : (
                  <button
                    onClick={() => setIsReadingMode(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Баяр хүргэе! Номын сан руу буцах
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Stories Gallery Grid */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📖</span>
                <span>Англи үлгэрийн номын сан (English Stories)</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Цэвэр англи дуу хоолойтой, өгүүлбэр бүрийг товшиж сонсдог үлгэрүүд.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeCategory === c.id
                      ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStories.map((s) => (
              <div
                key={s.id}
                onClick={() => handleOpenStory(s)}
                className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 p-5 border-2 border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 group-hover:scale-110 transition-transform">
                      {s.coverEmoji}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                      {s.pages.length} хуудас
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {s.title}
                  </h3>
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    {s.titleMn}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {s.descriptionMn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>Унших & Сонсох</span>
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
