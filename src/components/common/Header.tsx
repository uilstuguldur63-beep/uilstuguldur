import React from 'react';
import { Sparkles, Moon, Sun, Settings, Volume2, Users } from 'lucide-react';
import { UserProfile, ProfileType, AppSettings } from '../../types';

interface HeaderProps {
  activeProfile: UserProfile;
  allProfiles: Record<ProfileType, UserProfile>;
  onSwitchProfile: (type: ProfileType) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  onOpenParentArea: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  allProfiles,
  onSwitchProfile,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenParentArea,
  currentView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-purple-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (One line, clean wordmark) */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            <span className="text-xl">🦉</span>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-display whitespace-nowrap">
              Миний дүү бас ээж
            </div>
            <div className="hidden sm:block text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              Суръя, зуръя, бодъё, хамтдаа хөгжицгөөе!
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean single-line links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('english')}
            className={`whitespace-nowrap transition-colors hover:text-purple-600 ${
              currentView === 'english' ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-0.5' : ''
            }`}
          >
            🇬🇧 Англи хэл
          </button>
          <button
            onClick={() => onNavigate('math')}
            className={`whitespace-nowrap transition-colors hover:text-sky-600 ${
              currentView === 'math' ? 'text-sky-600 font-semibold border-b-2 border-sky-600 pb-0.5' : ''
            }`}
          >
            ➕ Математик
          </button>
          <button
            onClick={() => onNavigate('mongolian')}
            className={`whitespace-nowrap transition-colors hover:text-yellow-600 ${
              currentView === 'mongolian' ? 'text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-0.5' : ''
            }`}
          >
            🇲🇳 Монгол хэл (35 үсэг)
          </button>
          <button
            onClick={() => onNavigate('teacher')}
            className={`whitespace-nowrap transition-colors hover:text-pink-600 ${
              currentView === 'teacher' ? 'text-pink-600 font-semibold border-b-2 border-pink-600 pb-0.5' : ''
            }`}
          >
            ✨ Багш Мими
          </button>
          <button
            onClick={() => onNavigate('drawing')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 ${
              currentView === 'drawing' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            🎨 Зургийн урлан
          </button>
        </nav>

        {/* Zone 3: Active Profile, Stars, Coins & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Stars & Coins counters */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
            <span className="flex items-center text-xs sm:text-sm font-bold text-amber-500 tabular-nums">
              ⭐ {activeProfile.stars}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center text-xs sm:text-sm font-bold text-yellow-600 dark:text-yellow-400 tabular-nums">
              🪙 {activeProfile.coins}
            </span>
          </div>

          {/* Quick Profile Switcher Button */}
          <div className="relative">
            <button
              onClick={() => onSwitchProfile(activeProfile.id === 'sister' ? 'mom' : 'sister')}
              title={`Одоо: ${activeProfile.displayNameMn}. Солих бол дарна уу.`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
            >
              <span className="text-base">{activeProfile.avatar}</span>
              <span className="hidden sm:inline">{activeProfile.displayNameMn}</span>
              <span className="text-[10px] bg-white/20 px-1 rounded">солих</span>
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            title={settings.darkMode ? 'Гэгээлэг горим' : 'Харанхуй горим'}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings / Parent area */}
          <button
            onClick={onOpenSettings}
            title="Тохиргоо"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
