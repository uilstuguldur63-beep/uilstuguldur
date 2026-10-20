import React from 'react';
import { Sparkles, Moon, Sun, Settings, Volume2, Users, Languages } from 'lucide-react';
import { UserProfile, ProfileType, AppSettings } from '../../types';
import { speechService } from '../../services/speechService';

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
  const isTranslated = !!settings.showTranslation;

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
              {isTranslated ? 'Миний дүү бас ээж' : 'My Sister & Mom'}
            </div>
            <div className="hidden sm:block text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              {isTranslated
                ? 'Суръя, зуръя, бодъё, хамтдаа хөгжицгөөе!'
                : "Let's learn, draw, think, and grow together!"}
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
            {isTranslated ? '🇬🇧 Англи хэл' : '🇬🇧 English'}
          </button>
          <button
            onClick={() => onNavigate('math')}
            className={`whitespace-nowrap transition-colors hover:text-sky-600 ${
              currentView === 'math' ? 'text-sky-600 font-semibold border-b-2 border-sky-600 pb-0.5' : ''
            }`}
          >
            {isTranslated ? '➕ Математик' : '➕ Mathematics'}
          </button>
          <button
            onClick={() => onNavigate('mongolian')}
            className={`whitespace-nowrap transition-colors hover:text-yellow-600 ${
              currentView === 'mongolian' ? 'text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-0.5' : ''
            }`}
          >
            {isTranslated ? '🇲🇳 Монгол хэл (35 үсэг)' : '🇲🇳 Mongolian (35 Letters)'}
          </button>
          <button
            onClick={() => onNavigate('teacher')}
            className={`whitespace-nowrap transition-colors hover:text-pink-600 ${
              currentView === 'teacher' ? 'text-pink-600 font-semibold border-b-2 border-pink-600 pb-0.5' : ''
            }`}
          >
            {isTranslated ? '✨ Багш Мими' : '✨ Teacher Mimi'}
          </button>
          <button
            onClick={() => onNavigate('drawing')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 ${
              currentView === 'drawing' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-0.5' : ''
            }`}
          >
            {isTranslated ? '🎨 Зургийн урлан' : '🎨 Drawing Studio'}
          </button>
        </nav>

        {/* Zone 3: Active Profile, Translate Button, Level, EXP, Stars, Coins & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Translate Toggle for Mom */}
          <button
            onClick={() => {
              speechService.playSoundEffect('click');
              onUpdateSettings({ showTranslation: !settings.showTranslation });
            }}
            title={
              isTranslated
                ? 'Монгол орчуулга асаалттай. Буцааж англиар харах бол энд дарна уу.'
                : 'English mode. Press to translate into Mongolian!'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isTranslated
                ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300 shadow-md animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isTranslated ? '🇲🇳 Орчуулга: Асаалттай' : '🌐 Translate to Mongolian'}
            </span>
            <span className="sm:hidden">
              {isTranslated ? '🇲🇳 MN' : '🌐 Translate'}
            </span>
          </button>

          {/* Level & EXP indicator */}
          <div className="hidden md:flex flex-col items-end text-[11px] font-mono leading-tight">
            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
              <span className="text-purple-600 dark:text-purple-400">
                {isTranslated ? `Түвшин ${activeProfile.level}` : `Level ${activeProfile.level}`}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-500">⚡ {activeProfile.exp} EXP</span>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((activeProfile.exp / (100 + (activeProfile.level - 1) * 50)) * 100))}%`,
                }}
              />
            </div>
          </div>

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
              title={`Switch profile: ${activeProfile.displayName} (Level ${activeProfile.level})`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
            >
              <span className="text-base">{activeProfile.avatar}</span>
              <span className="hidden sm:inline">
                {isTranslated ? activeProfile.displayNameMn : activeProfile.displayName}
              </span>
              <span className="text-[10px] bg-white/20 px-1 rounded">
                {isTranslated ? `Түвшин ${activeProfile.level}` : `Lvl ${activeProfile.level}`}
              </span>
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            title={settings.darkMode ? 'Light mode' : 'Dark mode'}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings / Parent area */}
          <button
            onClick={onOpenSettings}
            title={isTranslated ? 'Тохиргоо' : 'Settings'}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
