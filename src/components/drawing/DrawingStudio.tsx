import React, { useRef, useState, useEffect } from 'react';
import {
  Palette,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Save,
  Download,
  Image as ImageIcon,
  Check,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { UserProfile, SavedDrawing } from '../../types';
import { storageService } from '../../services/storageService';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface DrawingStudioProps {
  activeProfile: UserProfile;
  initialMode?: 'free' | 'letters' | 'numbers' | 'shapes' | 'mongolian';
  onProfileUpdated: (updated: UserProfile) => void;
}

export const DrawingStudio: React.FC<DrawingStudioProps> = ({
  activeProfile,
  initialMode = 'free',
  onProfileUpdated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#8B5CF6'); // Purple default
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<'free' | 'letters' | 'numbers' | 'shapes' | 'mongolian'>(
    initialMode
  );
  const [guideIndex, setGuideIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>(activeProfile.savedDrawings || []);

  // Undo & Redo stacks
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const colors = [
    '#8B5CF6', // Purple
    '#0EA5E9', // Sky Blue
    '#EAB308', // Yellow
    '#EC4899', // Pink
    '#10B981', // Green
    '#F97316', // Orange
    '#EF4444', // Red
    '#1E293B', // Charcoal Slate
  ];

  // Guides
  const letterGuides = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'S'];
  const numberGuides = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const shapeGuides = [
    { name: 'Circle', nameMn: 'Дугуй', char: '◯' },
    { name: 'Square', nameMn: 'Дөрвөлжин', char: '□' },
    { name: 'Triangle', nameMn: 'Гурвалжин', char: '△' },
    { name: 'Star', nameMn: 'Од', char: '★' },
  ];

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = Math.min(parent.clientWidth, 800);
    const height = Math.min(window.innerHeight * 0.55, 500);

    canvas.width = width;
    canvas.height = height;

    drawBackgroundAndGuide(canvas);
    saveState();
  }, [activeWorkspace, guideIndex]);

  const drawBackgroundAndGuide = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Workspace specific guides
    if (activeWorkspace === 'letters') {
      const letter = letterGuides[guideIndex % letterGuides.length];
      ctx.save();
      ctx.font = 'bold 220px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.28)';
      ctx.lineWidth = 4;
      ctx.strokeText(letter, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    } else if (activeWorkspace === 'numbers') {
      const num = numberGuides[guideIndex % numberGuides.length];
      ctx.save();
      ctx.font = 'bold 220px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.28)';
      ctx.lineWidth = 4;
      ctx.strokeText(num, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    } else if (activeWorkspace === 'shapes') {
      const shape = shapeGuides[guideIndex % shapeGuides.length];
      ctx.save();
      ctx.font = 'bold 200px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.28)';
      ctx.lineWidth = 4;
      ctx.strokeText(shape.char, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    } else if (activeWorkspace === 'mongolian') {
      // Traditional Mongolian script vertical grid lines (босоо шугам)
      ctx.save();
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      // Center line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 20);
      ctx.lineTo(canvas.width / 2, canvas.height - 20);
      ctx.stroke();

      // Top-to-bottom arrow indication
      ctx.fillStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('▼ Дээрээс доош урсгалтай босоо тиг ▼', canvas.width / 2, 24);
      ctx.restore();
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, dataUrl];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  // Drawing event handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth = isEraser ? brushSize * 2.5 : brushSize;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
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

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadState(history[newIndex]);
      speechService.playSoundEffect('click');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadState(history[newIndex]);
      speechService.playSoundEffect('click');
    }
  };

  const loadState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleClear = () => {
    speechService.playSoundEffect('pop');
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBackgroundAndGuide(canvas);
    saveState();
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const newDrawing: SavedDrawing = {
      id: 'draw-' + Date.now(),
      title: `${activeProfile.displayNameMn} бүтээл - ${new Date().toLocaleDateString()}`,
      category: activeWorkspace === 'mongolian' ? 'mongolian' : activeWorkspace === 'numbers' ? 'math' : 'english',
      dataUrl,
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = storageService.saveDrawing(newDrawing);
    setSavedDrawings(updated.savedDrawings || []);
    onProfileUpdated(updated);

    speechService.playSoundEffect('star');
    fireCelebrationConfetti();
    speechService.speakEnglish('Wonderful artwork! Saved to your gallery!');
  };

  const handleDeleteDrawing = (id: string) => {
    speechService.playSoundEffect('click');
    const updated = storageService.deleteDrawing(id);
    setSavedDrawings(updated.savedDrawings || []);
    onProfileUpdated(updated);
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-8">
      {/* Top Controls & Workspace Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span>
            <span>Зургийн урлан (Drawing Studio)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Хуруугаараа үсэг дагуулах, тоо бичих, дүрс зурах, уран бүтээл хадгалах урлан.
          </p>
        </div>

        {/* Gallery button */}
        <button
          onClick={() => setShowGallery(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors self-start sm:self-auto"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Бүтээлийн сан ({savedDrawings.length})</span>
        </button>
      </div>

      {/* Workspace Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'free', label: 'Чөлөөт зураг', icon: '🎨' },
          { id: 'letters', label: 'Англи үсэг дагуулах', icon: '🔤' },
          { id: 'numbers', label: 'Тоо дагуулах', icon: '🔢' },
          { id: 'shapes', label: 'Геометр дүрс', icon: '🔷' },
          { id: 'mongolian', label: 'Монгол бичгийн тиг', icon: '📜' },
        ].map((ws) => (
          <button
            key={ws.id}
            onClick={() => {
              setActiveWorkspace(ws.id as any);
              speechService.playSoundEffect('click');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeWorkspace === ws.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{ws.icon}</span>
            <span>{ws.label}</span>
          </button>
        ))}

        {/* Guide Navigator for Letters/Numbers/Shapes */}
        {activeWorkspace !== 'free' && activeWorkspace !== 'mongolian' && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                setGuideIndex((prev) => Math.max(0, prev - 1));
                speechService.playSoundEffect('click');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              ◀ Өмнөх
            </button>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {activeWorkspace === 'letters' && letterGuides[guideIndex % letterGuides.length]}
              {activeWorkspace === 'numbers' && numberGuides[guideIndex % numberGuides.length]}
              {activeWorkspace === 'shapes' && shapeGuides[guideIndex % shapeGuides.length].nameMn}
            </span>
            <button
              onClick={() => {
                setGuideIndex((prev) => prev + 1);
                speechService.playSoundEffect('click');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              Дараах ▶
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        {/* Toolbars */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          {/* Colors palette */}
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCurrentColor(c);
                  setIsEraser(false);
                  speechService.playSoundEffect('click');
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform ${
                  currentColor === c && !isEraser
                    ? 'scale-125 ring-2 ring-purple-400 ring-offset-2'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}

            {/* Eraser */}
            <button
              onClick={() => {
                setIsEraser(true);
                speechService.playSoundEffect('click');
              }}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                isEraser
                  ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-400 text-purple-700'
                  : 'bg-slate-50 dark:bg-slate-700 border-slate-200 text-slate-600'
              }`}
              title="Баллуур"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Brush size slider */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Хэмжээ:</span>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-purple-600"
            />
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 w-6">
              {brushSize}
            </span>
          </div>

          {/* Action buttons (Undo, Redo, Clear, Save) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Буцаах"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Давтах"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              title="Цэвэрлэх"
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveDrawing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Хадгалах (+2 ⭐)</span>
            </button>
          </div>
        </div>

        {/* The actual Canvas */}
        <div className="relative w-full flex items-center justify-center bg-white rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-inner">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            className="touch-none cursor-crosshair block max-w-full"
          />
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-purple-100 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🖼️</span>
                <span>{activeProfile.displayNameMn} - Зургийн үзэсгэлэн</span>
              </h3>
              <button
                onClick={() => setShowGallery(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                ✕
              </button>
            </div>

            {savedDrawings.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="text-4xl">🎨</div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Одоогоор хадгалсан зураг алга байна.
                </div>
                <p className="text-xs text-slate-400">
                  Зургийн урланд дуртай зургаа зураад "Хадгалах" товчийг дарж цуглуулаарай!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedDrawings.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2.5"
                  >
                    <div className="w-full h-40 bg-white rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                      <img
                        src={d.dataUrl}
                        alt={d.title}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {d.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{d.createdAt}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={d.dataUrl}
                          download={`drawing-${d.id}.png`}
                          title="Татаж авах"
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-slate-600 hover:text-purple-600"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteDrawing(d.id)}
                          title="Устгах"
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
