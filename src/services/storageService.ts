import { UserProfile, ProfileType, AppSettings, SavedDrawing } from '../types';

const STORAGE_KEY_PROFILES = 'miniidvv_profiles_v1';
const STORAGE_KEY_ACTIVE_PROFILE = 'miniidvv_active_profile_v1';
const STORAGE_KEY_SETTINGS = 'miniidvv_settings_v1';
const STORAGE_KEY_MONGOLIAN_IMPORT = 'miniidvv_mongolian_custom_content_v1';

const defaultSisterProfile: UserProfile = {
  id: 'sister',
  displayName: 'Миний дүү',
  displayNameMn: 'Миний дүү',
  roleDescription: 'Анхан шат · Зурагт хичээл · Хөгжилтэй дасгал',
  avatar: '👧',
  level: 1,
  stars: 12,
  coins: 45,
  completedLessons: ['eng-1', 'math-1'],
  favoriteWords: ['apple', 'cat', 'sun', 'yellow'],
  savedDrawings: [],
  badges: ['first-step', 'star-counter', 'little-artist'],
  unlockedOutfits: ['hat-party', 'hat-crown'],
  equippedHat: 'hat-party',
  equippedAccessory: 'star-wand',
  stats: {
    englishLessonsDone: 3,
    mathLessonsDone: 4,
    mongolianLessonsDone: 0,
    storiesRead: 2,
    wordsMastered: 15,
    gamesPlayed: 5,
    speakingExercisesDone: 4,
    quizzesPassed: 6,
  },
  learningGoals: {
    dailyTargetMinutes: 15,
    completedTodayMinutes: 8,
    dailyStreak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
};

const defaultMomProfile: UserProfile = {
  id: 'mom',
  displayName: 'Ээж',
  displayNameMn: 'Ээж',
  roleDescription: 'Ярианы англи хэл · Дүрэм · Амьдралын практик дасгал',
  avatar: '👩',
  level: 2,
  stars: 28,
  coins: 120,
  completedLessons: ['eng-1', 'eng-14', 'math-1', 'math-16'],
  favoriteWords: ['welcome', 'family', 'breakfast', 'shopping'],
  savedDrawings: [],
  badges: ['first-step', 'word-master', 'daily-streaker', 'math-wizard'],
  unlockedOutfits: ['hat-grad', 'glasses-smart'],
  equippedHat: 'hat-grad',
  equippedAccessory: 'book-pen',
  stats: {
    englishLessonsDone: 8,
    mathLessonsDone: 6,
    mongolianLessonsDone: 0,
    storiesRead: 5,
    wordsMastered: 38,
    gamesPlayed: 8,
    speakingExercisesDone: 10,
    quizzesPassed: 12,
  },
  learningGoals: {
    dailyTargetMinutes: 25,
    completedTodayMinutes: 18,
    dailyStreak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
};

export const defaultSettings: AppSettings = {
  darkMode: false,
  textSize: 'normal',
  voiceAccent: 'en-US',
  speechRate: 1.0,
  soundEffects: true,
  reducedMotion: false,
  showSubtitles: true,
  showMongolianHints: true,
};

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getActiveProfileType(): ProfileType {
    if (typeof window === 'undefined') return 'sister';
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE);
    return saved === 'mom' ? 'mom' : 'sister';
  }

  public setActiveProfileType(type: ProfileType): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE, type);
  }

  public getProfiles(): Record<ProfileType, UserProfile> {
    if (typeof window === 'undefined') {
      return { sister: defaultSisterProfile, mom: defaultMomProfile };
    }
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      const initial = { sister: defaultSisterProfile, mom: defaultMomProfile };
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(initial));
      return initial;
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        sister: { ...defaultSisterProfile, ...(parsed.sister || {}) },
        mom: { ...defaultMomProfile, ...(parsed.mom || {}) },
      };
    } catch {
      return { sister: defaultSisterProfile, mom: defaultMomProfile };
    }
  }

  public saveProfiles(profiles: Record<ProfileType, UserProfile>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }

  public getActiveProfile(): UserProfile {
    const type = this.getActiveProfileType();
    const profiles = this.getProfiles();
    return profiles[type];
  }

  public updateActiveProfile(updater: (current: UserProfile) => UserProfile): UserProfile {
    const type = this.getActiveProfileType();
    const profiles = this.getProfiles();
    const updated = updater(profiles[type]);
    profiles[type] = updated;
    this.saveProfiles(profiles);
    return updated;
  }

  public addReward(stars: number, coins: number): UserProfile {
    return this.updateActiveProfile((p) => {
      const newStars = p.stars + stars;
      const newCoins = p.coins + coins;
      const newLevel = Math.floor(newStars / 20) + 1;
      return {
        ...p,
        stars: newStars,
        coins: newCoins,
        level: newLevel,
      };
    });
  }

  public markLessonComplete(lessonId: string, subject: 'english' | 'math' | 'mongolian'): UserProfile {
    return this.updateActiveProfile((p) => {
      const alreadyDone = p.completedLessons.includes(lessonId);
      const completed = alreadyDone ? p.completedLessons : [...p.completedLessons, lessonId];
      const stats = { ...p.stats };
      if (!alreadyDone) {
        if (subject === 'english') stats.englishLessonsDone += 1;
        if (subject === 'math') stats.mathLessonsDone += 1;
        if (subject === 'mongolian') stats.mongolianLessonsDone += 1;
      }
      return {
        ...p,
        completedLessons: completed,
        stats,
        stars: p.stars + (alreadyDone ? 1 : 3),
        coins: p.coins + (alreadyDone ? 2 : 10),
      };
    });
  }

  public saveDrawing(drawing: SavedDrawing): UserProfile {
    return this.updateActiveProfile((p) => {
      const drawings = [drawing, ...(p.savedDrawings || [])];
      return {
        ...p,
        savedDrawings: drawings,
        stars: p.stars + 2,
        coins: p.coins + 5,
      };
    });
  }

  public deleteDrawing(id: string): UserProfile {
    return this.updateActiveProfile((p) => {
      return {
        ...p,
        savedDrawings: (p.savedDrawings || []).filter((d) => d.id !== id),
      };
    });
  }

  public toggleFavoriteWord(word: string): UserProfile {
    return this.updateActiveProfile((p) => {
      const isFav = p.favoriteWords.includes(word);
      const newFavs = isFav ? p.favoriteWords.filter((w) => w !== word) : [...p.favoriteWords, word];
      return {
        ...p,
        favoriteWords: newFavs,
      };
    });
  }

  public getSettings(): AppSettings {
    if (typeof window === 'undefined') return defaultSettings;
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  }

  public saveSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  // Mongolian Script Material Import System (Ready for user material)
  public getImportedMongolianContent(): any | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY_MONGOLIAN_IMPORT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public saveImportedMongolianContent(content: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_MONGOLIAN_IMPORT, JSON.stringify(content));
  }
}

export const storageService = StorageService.getInstance();
