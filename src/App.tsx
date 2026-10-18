import React, { useState, useEffect } from 'react';
import { UserProfile, ProfileType, AppSettings } from './types';
import { storageService } from './services/storageService';
import { speechService } from './services/speechService';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { EnglishHub } from './components/english/EnglishHub';
import { MathHub } from './components/math/MathHub';
import { MongolianScriptHub } from './components/mongolian/MongolianScriptHub';
import { DrawingStudio } from './components/drawing/DrawingStudio';
import { AITeacherChat } from './components/teacher/AITeacherChat';
import { SpeakingLab } from './components/speaking/SpeakingLab';
import { StoryLibrary } from './components/stories/StoryLibrary';
import { VocabularyDictionary } from './components/dictionary/VocabularyDictionary';
import { GrammarSchool } from './components/grammar/GrammarSchool';
import { RoleplayLab } from './components/conversations/RoleplayLab';
import { GameArcade } from './components/games/GameArcade';
import { MimiWorld } from './components/rewards/MimiWorld';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { fireCelebrationConfetti } from './components/common/Confetti';

export default function App() {
  const [allProfiles, setAllProfiles] = useState<Record<ProfileType, UserProfile>>(() =>
    storageService.getProfiles()
  );
  const [activeProfileType, setActiveProfileType] = useState<ProfileType>(() =>
    storageService.getActiveProfileType()
  );
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  const [currentView, setCurrentView] = useState<string>('home');
  const [navigationExtra, setNavigationExtra] = useState<any>(null);

  const [showParentModal, setShowParentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const activeProfile = allProfiles[activeProfileType];

  // Apply dark mode and speech settings
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    speechService.setAccent(settings.voiceAccent);
    speechService.setRate(settings.speechRate);
  }, [settings]);

  const handleSwitchProfile = (type: ProfileType) => {
    speechService.playSoundEffect('star');
    storageService.setActiveProfileType(type);
    setActiveProfileType(type);
    const profs = storageService.getProfiles();
    setAllProfiles(profs);

    const targetProf = profs[type];
    speechService.speakEnglish(
      type === 'sister'
        ? `Welcome, little sister! Let us play and learn!`
        : `Welcome, mom! Ready for conversational English?`
    );
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setAllProfiles((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  const handleNavigate = (view: string, extra?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    setNavigationExtra(extra || null);
    speechService.stop();
  };

  const handleCompleteLesson = (moduleId: string, subject: 'english' | 'math' | 'mongolian' = 'english') => {
    const updated = storageService.markLessonComplete(moduleId, subject);
    handleUpdateProfile(updated);
    speechService.playSoundEffect('star');
    fireCelebrationConfetti();
  };

  const handleReward = (stars: number, coins: number) => {
    const updated = storageService.addReward(stars, coins);
    handleUpdateProfile(updated);
  };

  // Font size scale class
  const fontSizeClass =
    settings.textSize === 'large'
      ? 'text-base sm:text-lg'
      : settings.textSize === 'medium'
      ? 'text-[15px] sm:text-base'
      : 'text-sm sm:text-base';

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors ${fontSizeClass}`}
    >
      {/* Top Bar Header */}
      <Header
        activeProfile={activeProfile}
        allProfiles={allProfiles}
        onSwitchProfile={handleSwitchProfile}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenParentArea={() => setShowParentModal(true)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {currentView === 'home' && (
          <HomeScreen
            activeProfile={activeProfile}
            onSwitchProfile={handleSwitchProfile}
            onNavigate={handleNavigate}
            onOpenParentArea={() => setShowParentModal(true)}
          />
        )}

        {currentView === 'english' && (
          <EnglishHub
            activeProfile={activeProfile}
            initialModuleId={navigationExtra?.moduleId}
            onNavigate={handleNavigate}
            onCompleteLesson={(id) => handleCompleteLesson(id, 'english')}
          />
        )}

        {currentView === 'math' && (
          <MathHub
            activeProfile={activeProfile}
            initialModuleId={navigationExtra?.moduleId}
            onNavigate={handleNavigate}
            onCompleteLesson={(id) => handleCompleteLesson(id, 'math')}
          />
        )}

        {currentView === 'mongolian' && (
          <MongolianScriptHub
            activeProfile={activeProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'drawing' && (
          <DrawingStudio
            activeProfile={activeProfile}
            initialMode={navigationExtra?.mode || 'free'}
            onProfileUpdated={handleUpdateProfile}
          />
        )}

        {currentView === 'teacher' && (
          <AITeacherChat activeProfile={activeProfile} />
        )}

        {currentView === 'speaking' && (
          <SpeakingLab
            activeProfile={activeProfile}
            onCompleteExercise={() => handleReward(2, 5)}
          />
        )}

        {currentView === 'stories' && (
          <StoryLibrary
            activeProfile={activeProfile}
            onCompleteStory={() => handleReward(5, 15)}
          />
        )}

        {currentView === 'dictionary' && (
          <VocabularyDictionary
            activeProfile={activeProfile}
            onProfileUpdated={handleUpdateProfile}
          />
        )}

        {currentView === 'grammar' && (
          <GrammarSchool
            activeProfile={activeProfile}
            onCompleteLesson={() => handleReward(3, 10)}
          />
        )}

        {currentView === 'conversations' && (
          <RoleplayLab
            activeProfile={activeProfile}
            onCompleteRoleplay={() => handleReward(3, 10)}
          />
        )}

        {currentView === 'games' && (
          <GameArcade
            activeProfile={activeProfile}
            onReward={handleReward}
          />
        )}

        {currentView === 'world' && (
          <MimiWorld
            activeProfile={activeProfile}
            onProfileUpdated={handleUpdateProfile}
          />
        )}
      </main>

      {/* Mobile-first bottom navigation bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Parent Area Modal */}
      {showParentModal && (
        <ParentDashboard
          activeProfile={activeProfile}
          allProfiles={allProfiles}
          onSwitchProfile={handleSwitchProfile}
          onClose={() => setShowParentModal(false)}
          onUpdateSettings={handleUpdateSettings}
          settings={settings}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
