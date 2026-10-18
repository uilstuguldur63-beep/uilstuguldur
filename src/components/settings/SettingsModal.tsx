import React from 'react';
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  Type,
  Languages,
  Check,
  RotateCcw,
} from 'lucide-react';
import { AppSettings } from '../../types';
import { speechService } from '../../services/speechService';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleTestSpeech = (accent: 'en-US' | 'en-GB', rate: number) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(
      accent === 'en-US'
        ? 'Hello! This is the American English teacher voice.'
        : 'Good day! This is the British English teacher voice.',
      { accent, rate }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-purple-100 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Аппликейшны тохиргоо (Settings)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            ✕
          </button>
        </div>

        {/* 1. Appearance / Dark Mode */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {settings.darkMode ? (
              <Moon className="w-5 h-5 text-purple-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Харанхуй горим (Dark Mode)
              </div>
              <div className="text-[11px] text-slate-500">
                {settings.darkMode ? 'Харанхуй горим идэвхтэй' : 'Гэгээлэг өнгө төрх'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              onUpdateSettings({ darkMode: !settings.darkMode });
              speechService.playSoundEffect('click');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.darkMode ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md transform" />
          </button>
        </div>

        {/* 2. Text Size */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Type className="w-4 h-4 text-purple-600" />
            <span>Үсгийн хэмжээ (Text Size)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Хэвийн' },
              { id: 'medium', label: 'Дунд (+)' },
              { id: 'large', label: 'Том (++)' },
            ].map((ts) => (
              <button
                key={ts.id}
                onClick={() => {
                  onUpdateSettings({ textSize: ts.id as any });
                  speechService.playSoundEffect('click');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  settings.textSize === ts.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {ts.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. AI Voice Accent & Speed (Strict English only) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Багшийн англи дуу хоолой (English Voice)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300">
              English Only
            </span>
          </div>

          {/* Accent choice */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onUpdateSettings({ voiceAccent: 'en-US' });
                handleTestSpeech('en-US', settings.speechRate);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                settings.voiceAccent === 'en-US'
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>🇺🇸 American English</span>
            </button>

            <button
              onClick={() => {
                onUpdateSettings({ voiceAccent: 'en-GB' });
                handleTestSpeech('en-GB', settings.speechRate);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                settings.voiceAccent === 'en-GB'
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>🇬🇧 British English</span>
            </button>
          </div>

          {/* Speed choice */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">Ярих хурд:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateSettings({ speechRate: 0.75 });
                  handleTestSpeech(settings.voiceAccent, 0.75);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  settings.speechRate === 0.75
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 border text-slate-600'
                }`}
              >
                0.75x Удаан
              </button>
              <button
                onClick={() => {
                  onUpdateSettings({ speechRate: 1.0 });
                  handleTestSpeech(settings.voiceAccent, 1.0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  settings.speechRate === 1.0
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-800 border text-slate-600'
                }`}
              >
                1.0x Хэвийн
              </button>
            </div>
          </div>
        </div>

        {/* 4. Subtitles & Hints Toggles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                Англи хадмал бичиг (Subtitles)
              </div>
              <div className="text-[10px] text-slate-400">
                Багшийн ярьсан үгсийг дэлгэцэнд харуулах
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ showSubtitles: !settings.showSubtitles })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                settings.showSubtitles ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                Монгол бичгэн зөвлөмж, тайлбар (Written Hints)
              </div>
              <div className="text-[10px] text-slate-400">
                Ойлгоход дэмжлэг болох монгол бичвэрийг харуулах
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ showMongolianHints: !settings.showMongolianHints })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                settings.showMongolianHints ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform" />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
          >
            Хадгалаад хаах
          </button>
        </div>
      </div>
    </div>
  );
};
