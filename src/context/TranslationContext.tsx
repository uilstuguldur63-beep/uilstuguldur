import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';
import { speechService } from '../services/speechService';

interface TranslationContextType {
  isTranslated: boolean;
  toggleTranslation: () => void;
  t: (en: string, mn: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  settings,
  onUpdateSettings,
}) => {
  const isTranslated = !!settings.showTranslation;

  const toggleTranslation = () => {
    speechService.playSoundEffect('click');
    onUpdateSettings({ showTranslation: !settings.showTranslation });
  };

  /**
   * Helper function: returns Mongolian text if translated is true,
   * otherwise returns English text.
   */
  const t = (en: string, mn: string): string => {
    return isTranslated ? mn : en;
  };

  return (
    <TranslationContext.Provider value={{ isTranslated, toggleTranslation, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      isTranslated: false,
      toggleTranslation: () => {},
      t: (en: string, mn: string) => en,
    };
  }
  return context;
};
