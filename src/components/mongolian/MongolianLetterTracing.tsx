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
} from 'lucide-react';
import { MongolianLetter } from '../../types';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

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

  const displayChar = letterCase === 'upper' ? currentLetter.upper : currentLetter.lower;

  // Redraw canvas with guidelines and dotted letter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const size = Math.min(parent.clientWidth, 380);
    canvas.width = size;
    canvas.height = size;

    drawGuide(canvas);
    setHistory([canvas.toDataURL()]);
    setHasDrawn(false);
    setCompleted(false);
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
      ctx.moveTo(20, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    });

    // Dotted large letter guide in the center
    ctx.save();
    ctx.font = 'bold 220px "Plus Jakarta Sans", sans-serif';
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

  const handlePointerUp = () => {
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
    if (onLetterComplete) {
      onLetterComplete(currentLetter);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-5 max-w-lg mx-auto text-center">
      {/* Letter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
            {currentLetter.upper} {currentLetter.lower}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            {currentLetter.nameMn}
          </span>
        </div>

        {/* Case Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
          <button
            onClick={() => setLetterCase('upper')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              letterCase === 'upper' ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Том ({currentLetter.upper})
          </button>
          <button
            onClick={() => setLetterCase('lower')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              letterCase === 'lower' ? 'bg-white dark:bg-slate-800 text-purple-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Жижиг ({currentLetter.lower})
          </button>
        </div>
      </div>

      {/* Tracing Stroke Advice */}
      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 text-left flex items-start gap-2">
        <span className="text-base">✍️</span>
        <div>
          <span className="font-bold">Бичих заавар ({currentLetter.tracingGuide.strokeCount} зураас):</span>{' '}
          {currentLetter.tracingGuide.descriptionMn}
        </div>
      </div>

      {/* Touch Drawing Area with touch-action: none */}
      <div className="relative mx-auto w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-inner bg-white select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full touch-none cursor-crosshair block"
          style={{ touchAction: 'none' }}
        />

        {/* Floating audio button */}
        {onPlaySound && (
          <button
            onClick={() => onPlaySound(currentLetter.upper)}
            title="Үсгийн дуудлага сонсох"
            className="absolute top-3 right-3 p-2.5 rounded-full bg-purple-600 text-white shadow-md hover:bg-purple-700 active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Color and Tool Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* Color buttons */}
        <div className="flex items-center gap-1.5">
          {['#8B5CF6', '#38BDF8', '#10B981', '#EC4899', '#F97316'].map((color) => (
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

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            title="Буцаах"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            title="Арилгах"
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

      {/* Completion Banner */}
      {completed && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Маш сайн! Та «{currentLetter.upper}» үсгийг хичээнгүй сайхан зурлаа! (+2 ⭐)</span>
        </div>
      )}

      {/* Prev / Next Letter Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={onPrevLetter}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Өмнөх үсэг</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          #{currentLetter.order} / 35
        </span>

        <button
          onClick={onNextLetter}
          className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
        >
          <span>Дараагийн үсэг</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
