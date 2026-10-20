import React from 'react';
import { Languages, Sparkles } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { ProfileType } from '../../types';

interface FloatingTranslateButtonProps {
  activeProfileType?: ProfileType;
}

export const FloatingTranslateButton: React.FC<FloatingTranslateButtonProps> = ({
  activeProfileType,
}) => {
  const { isTranslated, toggleTranslation, t } = useTranslation();

  return (
    <aside aria-label="Translate options" className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center">
      <button
        onClick={toggleTranslation}
        title={
          isTranslated
            ? 'Монгол орчуулга асаалттай байна. Англиар харах бол дарна уу.'
            : 'English mode active. Click to translate everything into Mongolian!'
        }
        className={`group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all transform active:scale-95 ${
          isTranslated
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-2 ring-amber-300 ring-offset-2 dark:ring-offset-slate-900 shadow-amber-500/25'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-purple-300 dark:border-purple-600 shadow-purple-500/10 hover:border-purple-500 hover:shadow-md'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 ${
            isTranslated ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col text-left leading-tight">
          <span className="font-extrabold flex items-center gap-1">
            {isTranslated ? '🇲🇳 Орчуулгатай' : '🌐 Translate'}
            {activeProfileType === 'mom' && (
              <span className="hidden sm:inline-block text-[10px] font-medium bg-black/10 dark:bg-white/10 px-1 rounded">
                Mom
              </span>
            )}
          </span>
          <span className="text-[10px] opacity-80 font-normal">
            {isTranslated ? 'Switch to English' : 'Монгол болгох'}
          </span>
        </div>
      </button>
    </aside>
  );
};
