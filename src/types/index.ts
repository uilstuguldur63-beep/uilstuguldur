export type ProfileType = 'sister' | 'mom';

export interface SavedDrawing {
  id: string;
  title: string;
  category: 'english' | 'math' | 'mongolian' | 'free';
  dataUrl: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  title: string;
  titleMn: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface MascotOutfit {
  id: string;
  name: string;
  nameMn: string;
  type: 'hat' | 'accessory' | 'color';
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  previewColor?: string;
  icon: string;
}

export interface UserProfile {
  id: ProfileType;
  displayName: string;
  displayNameMn: string;
  roleDescription: string;
  avatar: string;
  level: number;
  stars: number;
  coins: number;
  completedLessons: string[];
  favoriteWords: string[];
  savedDrawings: SavedDrawing[];
  badges: string[];
  unlockedOutfits: string[];
  equippedHat: string;
  equippedAccessory: string;
  stats: {
    englishLessonsDone: number;
    mathLessonsDone: number;
    mongolianLessonsDone: number;
    storiesRead: number;
    wordsMastered: number;
    gamesPlayed: number;
    speakingExercisesDone: number;
    quizzesPassed: number;
  };
  learningGoals: {
    dailyTargetMinutes: number;
    completedTodayMinutes: number;
    dailyStreak: number;
    lastActiveDate: string;
  };
}

export type SubjectId = 'english' | 'math' | 'mongolian';

export interface LessonModule {
  id: string;
  number: number;
  title: string;
  titleMn: string;
  subject: SubjectId;
  icon: string;
  category: string;
  descriptionMn: string;
  isComingSoon?: boolean; // For traditional Mongolian script modules pending user material
  comingSoonNoteMn?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface VocabularyWord {
  id: string;
  word: string;
  category: 'school' | 'family' | 'food' | 'animals' | 'body' | 'clothes' | 'city' | 'nature' | 'actions' | 'colors';
  phonetic: string;
  definitionEn: string;
  mongolianMeaning: string;
  exampleEn: string;
  emoji: string;
  isFavorite?: boolean;
}

export interface StoryPage {
  englishText: string;
  mongolianTranslation: string;
  keyWords: string[];
  characterSpeech?: { speaker: string; line: string };
  illustrationPrompt?: string;
  emoji: string;
}

export interface Story {
  id: string;
  title: string;
  titleMn: string;
  category: 'animals' | 'school' | 'friendship' | 'bedtime' | 'nature';
  coverEmoji: string;
  descriptionMn: string;
  pages: StoryPage[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationMn: string;
  }[];
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleMn: string;
  summaryMn: string;
  ruleExplanationMn: string;
  examples: {
    en: string;
    mn: string;
    audio: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationMn: string;
  }[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  titleMn: string;
  situationMn: string;
  icon: string;
  dialogue: {
    speaker: string;
    isUser?: boolean;
    english: string;
    mongolian: string;
    userOptions?: {
      text: string;
      isBest: boolean;
      feedbackEn: string;
    }[];
  }[];
}

export interface MongolianLetter {
  id: string;
  order: number;
  upper: string;
  lower: string;
  isBasicVowel: boolean; // The seven basic vowels: А, Э, И, О, У, Ө, Ү
  letterType: 'basic_vowel' | 'auxiliary_vowel' | 'consonant' | 'sign';
  nameMn: string;
  pronunciationMn: string;
  exampleWord: string;
  exampleWordTranslationEn: string;
  emoji: string;
  explanationMn: string;
  sampleSentenceMn: string;
  tracingGuide: {
    strokeCount: number;
    descriptionMn: string;
  };
}

export interface AppSettings {
  darkMode: boolean;
  textSize: 'normal' | 'medium' | 'large';
  voiceAccent: 'en-US' | 'en-GB';
  speechRate: 0.75 | 1.0;
  soundEffects: boolean;
  reducedMotion: boolean;
  showSubtitles: boolean;
  showMongolianHints: boolean;
}

