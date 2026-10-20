import React, { useRef, useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Award,
} from 'lucide-react';
import { MongolianLetter } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { storageService } from '../../services/storageService';

interface MongolianLetterTracingProps {
  currentLetter: MongolianLetter;
  onNextLetter?: () => void;
  onPrevLetter?: () => void;
  onLetterComplete?: (letter: MongolianLetter) => void;
  onPlaySound?: (text: string) => void;
}

export const MongolianLetterTracing: React.FC<MongolianLetterTracingProps> = ({
  currentLetter,
  onNextLetter,
  onPrevLetter,
  onLetterComplete,
  onPlaySound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [letterCase, setLetterCase] = useState<'upper' | 'lower'>('upper');
  const [brushColor, setBrushColor] = useState('#8B5CF6'); // Purple
  const [brushSize, setBrushSize] = useState(14);
  const [history, setHistory] = useState<string[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const displayChar = letterCase === 'upper' ? currentLetter.upper : currentLetter.lower;

  // Redraw canvas with guidelines and dotted letter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const size = Math.min(parent.clientWidth || 360, 360);
    canvas.width = size;
    canvas.height = size;

    drawGuide(canvas);
    setHistory([canvas.toDataURL()]);
    setHasDrawn(false);
    setCompleted(false);
    setFeedbackText(null);
  }, [currentLetter, letterCase]);

  const drawGuide = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Soft clean paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pedagogical notebook guidelines (3 horizontal lines)
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    const topY = canvas.height * 0.22;
    const midY = canvas.height * 0.5;
    const botY = canvas.height * 0.78;

    [topY, midY, botY].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(canvas.width - 15, y);
      ctx.stroke();
    });

    // Dotted large letter guide in the center
    ctx.save();
    ctx.font = 'bold 200px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.28)';
    ctx.lineWidth = 4;
    ctx.strokeText(displayChar, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setHasDrawn(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setHistory((prev) => [...prev, canvas.toDataURL()]);
      }
    }
  };

  const handleClear = () => {
    speechService.playSoundEffect('pop');
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawGuide(canvas);
    setHistory([canvas.toDataURL()]);
    setHasDrawn(false);
    setCompleted(false);
    setFeedbackText(null);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      speechService.playSoundEffect('click');
      const newHistory = history.slice(0, -1);
      const lastState = newHistory[newHistory.length - 1];
      setHistory(newHistory);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = lastState;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const handleCheckAndSubmit = () => {
    if (!hasDrawn) return;
    setCompleted(true);
    speechService.playSoundEffect('correct');
    fireCelebrationConfetti();

    // Educational feedback
    const feedbacks = [
      `Маш сайн! Та «${displayChar}» үсгийн зурлагыг дэвтрийн шугаманд гайхалтай тохируулан хичээнгүй зурлаа!`,
      `Гайхалтай бичлэг! Гарын хөдөлгөөн уян налархай, зурлагын чиглэл маш зөв байна!`,
      `Үлгэр жишээ сайхан зурагдлаа! Одоо дараагийн үсгийг туршаад үзээрэй!`,
    ];
    setFeedbackText(feedbacks[Math.floor(Math.random() * feedbacks.length)]);

    // Award EXP
    storageService.addExp(10);

    if (onLetterComplete) {
      onLetterComplete(currentLetter);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-5 max-w-4xl mx-auto">
      {/* Top Header: Letter Name & Case Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-display">
            {currentLetter.upper} {currentLetter.lower}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {currentLetter.nameMn}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                #{currentLetter.order} / 35
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Дуудлага: [{currentLetter.pronunciationMn}]
            </div>
          </div>
        </div>

        {/* Case Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-700 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setLetterCase('upper')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              letterCase === 'upper'
                ? 'bg-white dark:bg-slate-850 text-purple-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Том ({currentLetter.upper})
          </button>
          <button
            onClick={() => setLetterCase('lower')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              letterCase === 'lower'
                ? 'bg-white dark:bg-slate-850 text-purple-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Жижиг ({currentLetter.lower})
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Reference Letter beside Drawing Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* LEFT COLUMN: Reference Letter Display beside Drawing Area */}
        <div className="md:col-span-5 rounded-3xl p-5 bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-850 border-2 border-purple-100 dark:border-slate-700 text-center space-y-4">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Үсгийн загвар эх (Reference)
          </div>

          {/* Large Clean Reference Letter */}
          <div className="py-2">
            <span className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white font-display select-none">
              {displayChar}
            </span>
          </div>

          {/* Sound & Word */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 space-y-1">
            <div className="text-3xl">{currentLetter.emoji}</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {currentLetter.exampleWord}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentLetter.exampleWordTranslationEn}
            </div>
          </div>

          {/* Pronounce Button */}
          <button
            onClick={() => {
              if (onPlaySound) {
                onPlaySound(displayChar);
              } else {
                speechService.speakMongolian(displayChar);
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>«{displayChar}» дуудлагыг сонсох</span>
          </button>

          {/* Stroke Advice */}
          <div className="p-3 bg-purple-50/80 dark:bg-purple-950/40 rounded-2xl border border-purple-200/60 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 text-left space-y-1">
            <div className="font-bold flex items-center gap-1">
              <span>✍️ Зурлагын дараалал:</span>
              <span className="text-purple-600">({currentLetter.tracingGuide.strokeCount} зурлага)</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {currentLetter.tracingGuide.descriptionMn}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Touch Canvas for Finger Tracing */}
        <div className="md:col-span-7 space-y-4">
          <div className="relative mx-auto w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden border-2 border-purple-300 dark:border-purple-800 shadow-inner bg-white select-none">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full touch-none cursor-crosshair block"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Colors & Action Buttons */}
          <div className="flex items-center justify-between gap-2 max-w-[360px] mx-auto">
            {/* Color swatches */}
            <div className="flex items-center gap-1.5">
              {['#8B5CF6', '#38BDF8', '#10B981', '#EC4899', '#F97316', '#1E293B'].map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    brushColor === color ? 'scale-125 ring-2 ring-purple-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Tools */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                title="Буцаах (Undo)"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                title="Цэвэрлэх (Clear)"
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCheckAndSubmit}
                disabled={!hasDrawn}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-40 transition-all active:scale-95"
              >
                {completed ? 'Дуусгалаа ✓' : 'Шалгах'}
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {feedbackText && (
            <div className="max-w-[360px] mx-auto p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{feedbackText} (+10 EXP)</div>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Letter Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onPrevLetter}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Өмнөх үсэг</span>
        </button>

        <span className="text-xs text-slate-400 font-mono font-bold">
          35 Үсгийн дараалал
        </span>

        <button
          onClick={onNextLetter}
          className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
        >
          <span>Дараагийн үсэг</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
