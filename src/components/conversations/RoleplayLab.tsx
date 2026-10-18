import React, { useState } from 'react';
import {
  MessageCircle,
  Volume2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Play,
} from 'lucide-react';
import { UserProfile, ConversationScenario } from '../../types';
import { conversationScenarios } from '../../data/conversationsData';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface RoleplayLabProps {
  activeProfile: UserProfile;
  onCompleteRoleplay: () => void;
}

export const RoleplayLab: React.FC<RoleplayLabProps> = ({
  activeProfile,
  onCompleteRoleplay,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOpenScenario = (s: ConversationScenario) => {
    speechService.playSoundEffect('click');
    setSelectedScenario(s);
    setCurrentStep(0);
    setFeedback(null);

    // Speak initial line
    if (s.dialogue[0]) {
      speechService.speakEnglish(s.dialogue[0].english);
    }
  };

  const handleSpeak = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text);
  };

  const handleUserChoice = (option: { text: string; isBest: boolean; feedbackEn: string }) => {
    speechService.playSoundEffect('click');
    speechService.speakEnglish(option.text);
    setFeedback(option.feedbackEn);

    if (option.isBest) {
      speechService.playSoundEffect('correct');
      fireCelebrationConfetti();
    }

    setTimeout(() => {
      if (selectedScenario && currentStep < selectedScenario.dialogue.length - 1) {
        const nextIdx = currentStep + 1;
        setCurrentStep(nextIdx);
        setFeedback(null);
        speechService.speakEnglish(selectedScenario.dialogue[nextIdx].english);
      }
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💬</span>
            <span>Бодит амьдралын харилцан яриа (Role-Play)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Англиар танилцах, дэлгүүрт худалдаа хийх, сургууль дээр ярилцах бодит дадлага.
          </p>
        </div>
      </div>

      {selectedScenario ? (
        /* Dialogue Simulator */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border border-purple-100 dark:border-slate-700 shadow-md space-y-6 max-w-2xl mx-auto">
          {/* Back button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setSelectedScenario(null);
                speechService.stop();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ярианы жагсаалт руу буцах</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              {selectedScenario.title}
            </span>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-4xl">{selectedScenario.icon}</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedScenario.titleMn}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedScenario.situationMn}
              </p>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 pt-2">
              {selectedScenario.dialogue.slice(0, currentStep + 1).map((item, idx) => {
                const isCurrent = idx === currentStep;
                return (
                  <div key={idx} className="space-y-3">
                    {/* Character speech bubble */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl shrink-0">
                        🦉
                      </div>
                      <div className="flex-1 p-4 rounded-3xl rounded-tl-sm bg-purple-50/70 dark:bg-slate-700/50 border border-purple-100 dark:border-slate-600 space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                            {item.speaker}
                          </span>
                          <button
                            onClick={() => handleSpeak(item.english)}
                            className="text-purple-600 hover:text-purple-700 p-1"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                          "{item.english}"
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          💡 {item.mongolian}
                        </p>
                      </div>
                    </div>

                    {/* If current step has user options */}
                    {isCurrent && item.userOptions && (
                      <div className="pl-12 space-y-2 pt-1 animate-in fade-in">
                        <div className="text-xs font-bold text-slate-500">
                          {activeProfile.displayNameMn}, таны англи хариулт:
                        </div>
                        <div className="space-y-2">
                          {item.userOptions.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleUserChoice(opt)}
                              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 border-2 border-purple-100 dark:border-slate-600 hover:border-purple-400 shadow-sm transition-all flex items-center justify-between active:scale-98"
                            >
                              <span>💬 "{opt.text}"</span>
                              <Volume2 className="w-4 h-4 text-purple-400" />
                            </button>
                          ))}
                        </div>
                        {feedback && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                            ✨ {feedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* If finished all steps */}
            {currentStep >= selectedScenario.dialogue.length - 1 && (
              <div className="pt-4 text-center space-y-3">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  🎉 Баяр хүргэе! Та энэхүү бодит яриаг амжилттай дуусгалаа!
                </div>
                <button
                  onClick={() => {
                    onCompleteRoleplay();
                    setSelectedScenario(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Дуусгах & Буцах (+3 ⭐, +10 🪙)
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Scenarios list */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conversationScenarios.map((s) => (
            <div
              key={s.id}
              onClick={() => handleOpenScenario(s)}
              className="cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-4xl p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 inline-block mb-3 group-hover:scale-110 transition-transform">
                  {s.icon}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {s.titleMn}
                </h3>
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                  {s.title}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {s.situationMn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>Ярилцаж эхлэх</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
