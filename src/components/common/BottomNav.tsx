import React from 'react';
import { Home, BookOpen, Calculator, Scroll, Gamepad2, Sparkles } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t('Home', 'Эхлэл'), icon: Home, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'english', label: t('English', 'Англи хэл'), icon: BookOpen, color: 'text-sky-600 dark:text-sky-400' },
    { id: 'math', label: t('Math', 'Математик'), icon: Calculator, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'mongolian', label: t('Mongolian', 'Монгол хэл'), icon: Scroll, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'games', label: t('Games', 'Тоглоом'), icon: Gamepad2, color: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-pb">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center h-full py-1 text-center group active:scale-95 transition-transform"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-purple-100 dark:bg-purple-950/60 scale-110' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? tab.color : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full px-1 ${
                  isActive
                    ? 'text-purple-700 dark:text-purple-300 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
