import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  Trophy,
  Star,
  Zap,
  HelpCircle,
  Layers,
  BookOpen,
} from 'lucide-react';
import {
  UserProfile,
  GameSessionResult,
  MistakeItem,
  InProgressGameSession,
  getDifficultyStage,
  getExpRequiredForLevel,
} from '../../types';
import { GameQuestion100 } from '../../data/gameQuestions100';
import { storageService } from '../../services/storageService';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface GameSession100Props {
  gameId: string;
  gameTitle: string;
  questions: GameQuestion100[];
  activeProfile: UserProfile;
  onFinish: (result: GameSessionResult) => void;
  onBack: () => void;
  onPlaySound: (text: string) => void;
}

export const GameSession100: React.FC<GameSession100Props> = ({
  gameId,
  gameTitle,
  questions,
  activeProfile,
  onFinish,
  onBack,
  onPlaySound,
}) => {
  const isMom = activeProfile.id === 'mom';
  const stage = getDifficultyStage(activeProfile.level);

  // Resume check
  const savedSession = storageService.getInProgressGame(gameId);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (savedSession && savedSession.currentIndex < 100) {
      return savedSession.currentIndex;
    }
    return 0;
  });

  const [score, setScore] = useState<number>(() => savedSession?.score || 0);
  const [correctCount, setCorrectCount] = useState<number>(() => savedSession?.correctCount || 0);
  const [incorrectCount, setIncorrectCount] = useState<number>(() => savedSession?.incorrectCount || 0);
  const [expEarned, setExpEarned] = useState<number>(() => savedSession?.expEarned || 0);
  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => savedSession?.mistakes || []);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedResult, setCompletedResult] = useState<GameSessionResult | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  // Scramble tiles state for word scramble
  const currentQ = questions[Math.min(currentIndex, questions.length - 1)];
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<number[]>([]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowHint(false);
    setBuiltWord([]);
    setUsedTileIndices([]);
  }, [currentIndex]);

  // Save in-progress progress automatically
  useEffect(() => {
    if (!isCompleted && currentIndex < 100) {
      const inProg: InProgressGameSession = {
        gameId,
        gameTitle,
        currentIndex,
        score,
        correctCount,
        incorrectCount,
        expEarned,
        mistakes,
        savedAt: new Date().toISOString(),
      };
      storageService.saveInProgressGame(inProg);
    }
  }, [currentIndex, score, correctCount, incorrectCount, expEarned, mistakes, isCompleted, gameId, gameTitle]);

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(opt);
    checkAnswer(opt);
  };

  const handleTileClick = (letter: string, tileIndex: number) => {
    if (isAnswerChecked) return;
    if (usedTileIndices.includes(tileIndex)) return;

    speechService.playSoundEffect('pop');
    const newBuilt = [...builtWord, letter];
    const newUsed = [...usedTileIndices, tileIndex];
    setBuiltWord(newBuilt);
    setUsedTileIndices(newUsed);

    // If assembled word has same length as target answer, auto check
    if (newBuilt.join('').length === currentQ.answer.length) {
      const assembled = newBuilt.join('');
      setSelectedAnswer(assembled);
      checkAnswer(assembled);
    }
  };

  const handleTileBackspace = () => {
    if (isAnswerChecked || builtWord.length === 0) return;
    speechService.playSoundEffect('click');
    setBuiltWord((prev) => prev.slice(0, -1));
    setUsedTileIndices((prev) => prev.slice(0, -1));
  };

  const checkAnswer = (chosen: string) => {
    const isCorrect = chosen.trim().toUpperCase() === currentQ.answer.trim().toUpperCase();
    setIsAnswerChecked(true);
    setIsCorrectCurrent(isCorrect);

    if (isCorrect) {
      speechService.playSoundEffect('correct');
      setScore((prev) => prev + 10);
      setExpEarned((prev) => prev + 5);
      setCorrectCount((prev) => prev + 1);

      // Micro EXP reward in storage
      storageService.addExp(5);
    } else {
      speechService.playSoundEffect('wrong');
      setIncorrectCount((prev) => prev + 1);

      const mistake: MistakeItem = {
        id: `mstk-${Date.now()}-${currentIndex}`,
        gameId,
        gameTitle,
        question: currentQ.prompt,
        userAnswer: chosen,
        correctAnswer: currentQ.answer,
        explanation: currentQ.explanation,
        timestamp: new Date().toISOString(),
      };

      setMistakes((prev) => [...prev, mistake]);
      storageService.recordMistake(mistake);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= 100) {
      // Completed all 100 questions!
      finishGame();
    } else {
      speechService.playSoundEffect('click');
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const finishGame = () => {
    setIsCompleted(true);
    storageService.clearInProgressGame(gameId);

    const finalCorrect = correctCount + (isCorrectCurrent ? 0 : 0);
    const finalIncorrect = 100 - finalCorrect;
    const finalScore = score;
    // 100 questions completion bonus (+100 EXP)
    const totalExp = expEarned + 100;

    const res = storageService.saveCompletedGameSession({
      gameId,
      gameTitle,
      totalQuestions: 100,
      score: finalScore,
      correctCount: finalCorrect,
      incorrectCount: finalIncorrect,
      percentage: Math.round((finalCorrect / 100) * 100),
      expEarned: totalExp,
      mistakes,
    });

    if (res.leveledUp) {
      setLevelUpInfo({ oldLevel: res.oldLevel, newLevel: res.newLevel });
    }

    const sessionRecord: GameSessionResult = {
      id: 'sess-' + Date.now(),
      gameId,
      gameTitle,
      date: new Date().toISOString(),
      totalQuestions: 100,
      score: finalScore,
      correctCount: finalCorrect,
      incorrectCount: finalIncorrect,
      percentage: Math.round((finalCorrect / 100) * 100),
      expEarned: totalExp,
      levelAtStart: res.oldLevel,
      levelAtEnd: res.newLevel,
      mistakes,
    };

    setCompletedResult(sessionRecord);
    speechService.playSoundEffect('tada');
    fireCelebrationConfetti();
    onFinish(sessionRecord);
  };

  const handleRestart = () => {
    storageService.clearInProgressGame(gameId);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setExpEarned(0);
    setMistakes([]);
    setIsCompleted(false);
    setCompletedResult(null);
    setLevelUpInfo(null);
  };

  // -------------------------------------------------------------
  // RESULTS SCREEN AFTER QUESTION 100
  // -------------------------------------------------------------
  if (isCompleted && completedResult) {
    const pct = completedResult.percentage;
    const pass = pct >= 60;

    return (
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 sm:p-8 border border-purple-200 dark:border-slate-700 shadow-xl max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95">
        <div className="inline-block p-4 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-5xl">
          {pass ? '🏆' : '⭐'}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            100 Асуулттай Сорил Амжилттай Дууслаа!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
            {gameTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Нийт 100 асуултад бүрэн хариулж, мэдлэг чадвараа сорилоо.
          </p>
        </div>

        {/* Level up banner if achieved */}
        {levelUpInfo && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-bold text-sm shadow-md animate-bounce flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-800" />
            <span>
              БАЯР ХҮРГЭЕ! ТА ТҮВШИН АХИЛАА: Түвшин {levelUpInfo.oldLevel} ➔ Түвшин {levelUpInfo.newLevel}! (+100 Бонус EXP)
            </span>
          </div>
        )}

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <div className="text-xs text-slate-400">Оноо</div>
            <div className="text-2xl font-black text-purple-600 font-display">
              {completedResult.score}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
            <div className="text-xs text-emerald-600">Зөв хариулт</div>
            <div className="text-2xl font-black text-emerald-600 font-display">
              {completedResult.correctCount} / 100
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50">
            <div className="text-xs text-rose-500">Алдаа</div>
            <div className="text-2xl font-black text-rose-500 font-display">
              {completedResult.incorrectCount} / 100
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
            <div className="text-xs text-amber-600">Авсан EXP</div>
            <div className="text-2xl font-black text-amber-600 font-display flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-amber-500" />
              <span>+{completedResult.expEarned}</span>
            </div>
          </div>
        </div>

        {/* Analysis: Strong points & improvement areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Сайн эзэмшсэн хэсэг:</span>
            </div>
            <p className="text-emerald-800/90 dark:text-emerald-300/90">
              {pct >= 80
                ? 'Үгийн сан, дүрмийн хэрэглээ болон дуудлагыг өндөр түвшинд эзэмшсэн байна.'
                : 'Асуултуудын үндсэн суурь ойлголтуудыг амжилттай таньж хариуллаа.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1">
            <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span>Давтах зөвлөгөө:</span>
            </div>
            <p className="text-purple-800/90 dark:text-purple-300/90">
              {completedResult.mistakes.length > 0
                ? `Гарсан ${completedResult.mistakes.length} алдааг "Алдаагаа хянах" товчоор дахин нэг харж тогтоогоорой.`
                : 'Бүх 100 асуултад төгс хариуллаа! Дараагийн шинэ түвшин рүү шилжихэд бэлэн боллоо.'}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          {completedResult.mistakes.length > 0 && (
            <button
              onClick={() => setShowMistakesModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>📝 Алдаагаа хянах ({completedResult.mistakes.length})</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Шинээр дахин тоглох</span>
          </button>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 transition-all"
          >
            Цэс рүү буцах
          </button>
        </div>

        {/* Mistake Review Drawer / Modal */}
        {showMistakesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 border border-purple-200 dark:border-slate-700 shadow-2xl text-left">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📝</span>
                  <span>Алдаагаа нягтлан давтах ({completedResult.mistakes.length})</span>
                </h3>
                <button
                  onClick={() => setShowMistakesModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {completedResult.mistakes.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      #{idx + 1}. {m.question}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="text-rose-600 font-semibold line-through">
                        Таны сонгосон: {m.userAnswer || 'Хоосон'}
                      </span>
                      <span className="text-slate-400">➔</span>
                      <span className="text-emerald-600 font-bold">
                        Зөв хариу: {m.correctAnswer}
                      </span>
                    </div>
                    {m.explanation && (
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] italic pt-1 border-t border-slate-100 dark:border-slate-700">
                        Тайлбар: {m.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMistakesModal(false)}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm hover:bg-purple-700"
              >
                Ойлголоо, цонхыг хаах
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE 100-QUESTION PLAYING SCREEN
  // -------------------------------------------------------------
  const progressPercent = Math.round(((currentIndex + 1) / 100) * 100);

  return (
    <div className="bg-white dark:bg-slate-850 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-md max-w-xl mx-auto space-y-5">
      {/* Top Bar with Question 1 of 100 & Live Stats */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Буцах</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-bold font-mono">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            Асуулт {currentIndex + 1} / 100
          </span>
          <span className="text-amber-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>+{expEarned} EXP</span>
          </span>
          <span className="text-emerald-600">✓ {correctCount}</span>
        </div>
      </div>

      {/* Progress Bar (0% to 100%) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Явц: {progressPercent}%</span>
          <span>{100 - (currentIndex + 1)} асуулт үлдсэн</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-sky-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-purple-50/70 to-white dark:from-slate-800 dark:to-slate-850 border border-purple-100 dark:border-slate-700 text-center space-y-3">
        {currentQ.imageEmoji && (
          <div className="text-5xl">{currentQ.imageEmoji}</div>
        )}

        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
          {currentQ.prompt}
        </h3>

        {currentQ.promptMn && currentQ.promptMn !== currentQ.prompt && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentQ.promptMn}
          </p>
        )}

        {/* Audio Button */}
        {currentQ.audioText && (
          <div className="pt-1">
            <button
              onClick={() => onPlaySound(currentQ.audioText || '')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm hover:bg-purple-700 active:scale-95 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>🔊 Сонсох</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------- */}
      {/* INTERACTIVE QUESTION INPUTS                              */}
      {/* ------------------------------------------------------- */}

      {/* Case A: Word Scramble Interactive Letter Tiles */}
      {currentQ.type === 'word_scramble' && currentQ.scrambledLetters && (
        <div className="space-y-4">
          {/* Assembled Word Display */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-purple-200 dark:border-purple-800 min-h-[58px] flex items-center justify-center gap-2">
            {builtWord.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Доорх үсгүүдийг дарж үгээ бүтээгээрэй
              </span>
            ) : (
              builtWord.map((letter, idx) => (
                <span
                  key={idx}
                  className="w-9 h-11 rounded-xl bg-purple-600 text-white font-black text-xl flex items-center justify-center font-display shadow-sm animate-in zoom-in-75"
                >
                  {letter}
                </span>
              ))
            )}
          </div>

          {/* Scrambled Clickable Letter Tiles */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentQ.scrambledLetters.map((letter, tileIdx) => {
              const isUsed = usedTileIndices.includes(tileIdx);
              return (
                <button
                  key={tileIdx}
                  disabled={isUsed || isAnswerChecked}
                  onClick={() => handleTileClick(letter, tileIdx)}
                  className={`w-11 h-12 rounded-2xl text-xl font-extrabold font-display transition-all ${
                    isUsed
                      ? 'opacity-20 scale-90 bg-slate-200 dark:bg-slate-700'
                      : 'bg-white dark:bg-slate-700 border-2 border-purple-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm hover:border-purple-500 hover:scale-105 active:scale-95'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Action to undo last letter */}
          {builtWord.length > 0 && !isAnswerChecked && (
            <div className="flex justify-center">
              <button
                onClick={handleTileBackspace}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                ⌫ Сүүлчийн үсгийг арилгах
              </button>
            </div>
          )}
        </div>
      )}

      {/* Case B: Standard Multiple Choice Options (4 options) */}
      {(currentQ.type !== 'word_scramble' || isAnswerChecked) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            let btnStyle =
              'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-purple-400 hover:bg-purple-50/50';

            if (isAnswerChecked) {
              if (opt.toUpperCase() === currentQ.answer.toUpperCase()) {
                btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md font-bold';
              } else if (selectedAnswer?.toUpperCase() === opt.toUpperCase()) {
                btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-md font-bold';
              } else {
                btnStyle = 'opacity-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-2xl border-2 text-sm sm:text-base font-bold transition-all flex items-center justify-between text-left active:scale-95 ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswerChecked && opt.toUpperCase() === currentQ.answer.toUpperCase() && (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                )}
                {isAnswerChecked && selectedAnswer?.toUpperCase() === opt.toUpperCase() && opt.toUpperCase() !== currentQ.answer.toUpperCase() && (
                  <XCircle className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint Accordion */}
      {!isAnswerChecked && (
        <div className="pt-1">
          {showHint ? (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Зөвлөгөө: {currentQ.hint}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mx-auto hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>💡 Зөвлөгөө харах</span>
            </button>
          )}
        </div>
      )}

      {/* Answer Feedback & Next Button */}
      {isAnswerChecked && (
        <div className="space-y-3 pt-2 animate-in fade-in">
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 ${
              isCorrectCurrent
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200'
            }`}
          >
            {isCorrectCurrent ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                {isCorrectCurrent ? 'Маш сайн, зөв хариуллаа! (+10 Оноо, +5 EXP)' : `Зөв хариу нь: «${currentQ.answer}»`}
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                {currentQ.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentIndex + 1 >= 100 ? 'Дүнг харах (100-р асуулт дууслаа) ➔' : 'Дараагийн асуулт ➔'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
