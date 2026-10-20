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

export interface MistakeItem {
  id: string;
  gameId: string;
  gameTitle: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  timestamp: string;
}

export interface GameSessionResult {
  id: string;
  gameId: string;
  gameTitle: string;
  date: string;
  totalQuestions: number; // 100
  score: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  expEarned: number;
  levelAtStart: number;
  levelAtEnd: number;
  mistakes: MistakeItem[];
}

export interface InProgressGameSession {
  gameId: string;
  gameTitle: string;
  currentIndex: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  expEarned: number;
  mistakes: MistakeItem[];
  savedAt: string;
}

export interface UserProfile {
  id: ProfileType;
  displayName: string;
  displayNameMn: string;
  roleDescription: string;
  avatar: string;
  level: number;
  exp: number; // Current EXP towards next level
  stars: number;
  coins: number;
  completedLessons: string[];
  favoriteWords: string[];
  savedDrawings: SavedDrawing[];
  badges: string[];
  unlockedOutfits: string[];
  equippedHat: string;
  equippedAccessory: string;
  mistakeReviewList: MistakeItem[];
  gameHistory: GameSessionResult[];
  inProgressSessions?: Record<string, InProgressGameSession>;
  stats: {
    englishLessonsDone: number;
    mathLessonsDone: number;
    mongolianLessonsDone: number;
    storiesRead: number;
    wordsMastered: number;
    gamesPlayed: number;
    speakingExercisesDone: number;
    quizzesPassed: number;
    sessionsCompleted100: number;
  };
  learningGoals: {
    dailyTargetMinutes: number;
    completedTodayMinutes: number;
    dailyStreak: number;
    lastActiveDate: string;
  };
}

export type DifficultyStage = 'Beginner' | 'Easy' | 'Intermediate' | 'Advanced' | 'Expert';

export function getDifficultyStage(level: number): {
  stage: DifficultyStage;
  stageMn: string;
  color: string;
} {
  if (level <= 5) return { stage: 'Beginner', stageMn: 'Анхан шат', color: 'text-emerald-500' };
  if (level <= 10) return { stage: 'Easy', stageMn: 'Энгийн шат', color: 'text-sky-500' };
  if (level <= 20) return { stage: 'Intermediate', stageMn: 'Дунд шат', color: 'text-indigo-500' };
  if (level <= 35) return { stage: 'Advanced', stageMn: 'Ахисан шат', color: 'text-purple-500' };
  return { stage: 'Expert', stageMn: 'Мастер шат', color: 'text-amber-500' };
}

export function getExpRequiredForLevel(level: number): number {
  return 100 + (level - 1) * 50;
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
  showTranslation: boolean; // When true, shows Mongolian translation. When false, shows English.
}

