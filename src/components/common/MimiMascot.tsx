import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface MimiMascotProps {
  mood?: 'happy' | 'talking' | 'thinking' | 'celebrating' | 'proud' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubbleText?: string;
  speechBubbleTranslation?: string;
  isSpeaking?: boolean;
  equippedHat?: string;
  equippedAccessory?: string;
  onSpeak?: () => void;
  className?: string;
}

export const MimiMascot: React.FC<MimiMascotProps> = ({
  mood = 'happy',
  size = 'md',
  speechBubbleText,
  speechBubbleTranslation,
  isSpeaking = false,
  equippedHat,
  equippedAccessory,
  onSpeak,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      {speechBubbleText && (
        <div className="relative mb-3 max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-3.5 shadow-md border-2 border-purple-200 dark:border-purple-800/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-200 leading-snug">
                {speechBubbleText}
              </p>
              {speechBubbleTranslation && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {speechBubbleTranslation}
                </p>
              )}
            </div>
            {onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak();
                }}
                title="Hear English pronunciation"
                className="shrink-0 p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 transition-colors"
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 animate-pulse text-purple-600" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-r-2 border-purple-200 dark:border-purple-800/60 rotate-45 transform" />
        </div>
      )}

      {/* Mascot Graphic (Cute SVG) */}
      <div className={`relative ${sizeClasses[size]} select-none transition-transform duration-300 ${isSpeaking ? 'scale-105' : 'hover:scale-105'}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-lg overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="mimiBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="mimiBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="mimiCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="80" cy="148" rx="46" ry="10" fill="rgba(0,0,0,0.12)" />

          {/* Ears / Feather tufts */}
          <path d="M 52 48 Q 38 20 58 32 Z" fill="#A855F7" />
          <path d="M 108 48 Q 122 20 102 32 Z" fill="#A855F7" />

          {/* Main Body */}
          <circle cx="80" cy="88" r="54" fill="url(#mimiBodyGrad)" />

          {/* Belly */}
          <ellipse cx="80" cy="98" rx="36" ry="34" fill="url(#mimiBellyGrad)" />

          {/* Wings */}
          {/* Left Wing */}
          <path
            d={mood === 'celebrating' || isSpeaking ? 'M 30 84 Q 8 68 24 100 Q 34 94 30 84 Z' : 'M 30 88 Q 14 98 28 114 Q 35 102 30 88 Z'}
            fill="#7E22CE"
            className="transition-all duration-300"
          />
          {/* Right Wing */}
          <path
            d={mood === 'celebrating' || isSpeaking ? 'M 130 84 Q 152 68 136 100 Q 126 94 130 84 Z' : 'M 130 88 Q 146 98 132 114 Q 125 102 130 88 Z'}
            fill="#7E22CE"
            className="transition-all duration-300"
          />

          {/* Big Sparkly Eyes */}
          {/* Left Eye White */}
          <ellipse cx="64" cy="74" rx="14" ry="17" fill="#FFFFFF" />
          {/* Right Eye White */}
          <ellipse cx="96" cy="74" rx="14" ry="17" fill="#FFFFFF" />

          {/* Pupils */}
          <ellipse cx="66" cy="74" rx="9" ry="11" fill="#1E1B4B" />
          <ellipse cx="94" cy="74" rx="9" ry="11" fill="#1E1B4B" />

          {/* Eye Sparkles */}
          <circle cx="63" cy="70" r="4" fill="#FFFFFF" />
          <circle cx="68" cy="77" r="2" fill="#FFFFFF" />
          <circle cx="91" cy="70" r="4" fill="#FFFFFF" />
          <circle cx="96" cy="77" r="2" fill="#FFFFFF" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="50" cy="92" rx="7" ry="5" fill="url(#mimiCheekGrad)" />
          <ellipse cx="110" cy="92" rx="7" ry="5" fill="url(#mimiCheekGrad)" />

          {/* Beak / Smile */}
          {isSpeaking ? (
            // Open talking mouth
            <ellipse cx="80" cy="88" rx="8" ry="7" fill="#F97316" />
          ) : (
            // Cute cheerful beak
            <polygon points="73,84 87,84 80,94" fill="#F97316" rx="2" />
          )}

          {/* Cute Feet */}
          <ellipse cx="66" cy="140" rx="9" ry="5" fill="#F97316" />
          <ellipse cx="94" cy="140" rx="9" ry="5" fill="#F97316" />

          {/* Equipped Hat */}
          {equippedHat === 'hat-crown' && (
            <g transform="translate(56, 16)">
              <polygon points="0,24 10,6 24,18 38,6 48,24" fill="url(#crownGrad)" stroke="#CA8A04" strokeWidth="1.5" />
              <circle cx="24" cy="22" r="3" fill="#EF4444" />
              <circle cx="10" cy="18" r="2" fill="#3B82F6" />
              <circle cx="38" cy="18" r="2" fill="#10B981" />
            </g>
          )}

          {equippedHat === 'hat-grad' && (
            <g transform="translate(50, 18)">
              <polygon points="30,4 60,16 30,28 0,16" fill="#1E293B" />
              <rect x="18" y="24" width="24" height="10" rx="2" fill="#0F172A" />
              <line x1="30" y1="20" x2="52" y2="28" stroke="#FACC15" strokeWidth="2" />
              <circle cx="52" cy="29" r="3" fill="#FACC15" />
            </g>
          )}

          {equippedHat === 'hat-party' && (
            <g transform="translate(64, 10)">
              <polygon points="16,0 0,34 32,34" fill="#EC4899" />
              <circle cx="16" cy="0" r="4" fill="#FACC15" />
              <line x1="6" y1="18" x2="26" y2="18" stroke="#FDE047" strokeWidth="3" />
            </g>
          )}

          {equippedHat === 'hat-chef' && (
            <g transform="translate(58, 12)">
              <ellipse cx="22" cy="14" rx="18" ry="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
              <rect x="8" y="20" width="28" height="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            </g>
          )}

          {/* Equipped Accessory */}
          {equippedAccessory === 'acc-wand' && (
            <g transform="translate(126, 75) rotate(25)">
              <rect x="0" y="0" width="4" height="42" rx="2" fill="#D97706" />
              <path
                d="M 2 -4 L 5 2 L 12 2 L 7 6 L 9 12 L 2 8 L -5 12 L -3 6 L -8 2 L -1 2 Z"
                fill="#FACC15"
              />
            </g>
          )}

          {equippedAccessory === 'acc-palette' && (
            <g transform="translate(18, 90)">
              <ellipse cx="14" cy="14" rx="14" ry="10" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
              <circle cx="7" cy="10" r="2" fill="#EF4444" />
              <circle cx="14" cy="8" r="2" fill="#3B82F6" />
              <circle cx="21" cy="11" r="2" fill="#EAB308" />
              <circle cx="14" cy="16" r="2" fill="#10B981" />
            </g>
          )}
        </svg>

        {/* Ambient sparkle for celebrations */}
        {mood === 'celebrating' && (
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
