import {
  UserProfile,
  ProfileType,
  AppSettings,
  SavedDrawing,
  MistakeItem,
  GameSessionResult,
  InProgressGameSession,
  getExpRequiredForLevel,
} from '../types';

const STORAGE_KEY_PROFILES = 'miniidvv_profiles_v2';
const STORAGE_KEY_ACTIVE_PROFILE = 'miniidvv_active_profile_v2';
const STORAGE_KEY_SETTINGS = 'miniidvv_settings_v2';
const STORAGE_KEY_MONGOLIAN_IMPORT = 'miniidvv_mongolian_custom_content_v1';

export const defaultSisterProfile: UserProfile = {
  id: 'sister',
  displayName: 'Миний дүү',
  displayNameMn: 'Миний дүү',
  roleDescription: 'Анхан шат (Level 2) · Зурагт хичээл · Хөгжилтэй дасгал',
  avatar: '👧',
  level: 2, // Starting Level 2 per specifications
  exp: 35,
  stars: 18,
  coins: 60,
  completedLessons: ['eng-1', 'math-1'],
  favoriteWords: ['apple', 'cat', 'sun', 'yellow', 'алим', 'ном'],
  savedDrawings: [],
  badges: ['first-step', 'star-counter', 'little-artist'],
  unlockedOutfits: ['hat-party', 'hat-crown'],
  equippedHat: 'hat-party',
  equippedAccessory: 'star-wand',
  mistakeReviewList: [],
  gameHistory: [],
  inProgressSessions: {},
  stats: {
    englishLessonsDone: 3,
    mathLessonsDone: 4,
    mongolianLessonsDone: 2,
    storiesRead: 2,
    wordsMastered: 18,
    gamesPlayed: 5,
    speakingExercisesDone: 4,
    quizzesPassed: 6,
    sessionsCompleted100: 0,
  },
  learningGoals: {
    dailyTargetMinutes: 15,
    completedTodayMinutes: 8,
    dailyStreak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
};

export const defaultMomProfile: UserProfile = {
  id: 'mom',
  displayName: 'Ээж',
  displayNameMn: 'Ээж',
  roleDescription: 'Ахисан түвшин (Level 5) · Ярианы англи хэл · Дүрэм · Үг бүтээх',
  avatar: '👩',
  level: 5, // Starting Level 5 per specifications
  exp: 120,
  stars: 45,
  coins: 210,
  completedLessons: ['eng-1', 'eng-14', 'math-1', 'math-16'],
  favoriteWords: ['welcome', 'family', 'breakfast', 'shopping', 'эрдэм', 'сургууль'],
  savedDrawings: [],
  badges: ['first-step', 'word-master', 'daily-streaker', 'math-wizard'],
  unlockedOutfits: ['hat-grad', 'glasses-smart'],
  equippedHat: 'hat-grad',
  equippedAccessory: 'book-pen',
  mistakeReviewList: [],
  gameHistory: [],
  inProgressSessions: {},
  stats: {
    englishLessonsDone: 8,
    mathLessonsDone: 6,
    mongolianLessonsDone: 5,
    storiesRead: 5,
    wordsMastered: 48,
    gamesPlayed: 8,
    speakingExercisesDone: 10,
    quizzesPassed: 12,
    sessionsCompleted100: 0,
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
  showTranslation: false, // Default English for Mom, translated to Mongolian when pressed
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
      const sisterData = parsed.sister || {};
      const momData = parsed.mom || {};

      // Ensure requirements: sister starts at minimum Level 2, mom at minimum Level 5
      const sisterLevel = Math.max(2, Number(sisterData.level) || 2);
      const momLevel = Math.max(5, Number(momData.level) || 5);

      const sister: UserProfile = {
        ...defaultSisterProfile,
        ...sisterData,
        level: sisterLevel,
        exp: Number(sisterData.exp) || 35,
        mistakeReviewList: sisterData.mistakeReviewList || [],
        gameHistory: sisterData.gameHistory || [],
        inProgressSessions: sisterData.inProgressSessions || {},
        stats: {
          ...defaultSisterProfile.stats,
          ...(sisterData.stats || {}),
          sessionsCompleted100: Number(sisterData.stats?.sessionsCompleted100) || 0,
        },
      };

      const mom: UserProfile = {
        ...defaultMomProfile,
        ...momData,
        level: momLevel,
        exp: Number(momData.exp) || 120,
        mistakeReviewList: momData.mistakeReviewList || [],
        gameHistory: momData.gameHistory || [],
        inProgressSessions: momData.inProgressSessions || {},
        stats: {
          ...defaultMomProfile.stats,
          ...(momData.stats || {}),
          sessionsCompleted100: Number(momData.stats?.sessionsCompleted100) || 0,
        },
      };

      return { sister, mom };
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

  /**
   * Award EXP with progressive leveling formula.
   * If EXP exceeds threshold, levels up automatically and notifies.
   */
  public addExp(expAmount: number): {
    updatedProfile: UserProfile;
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    expGained: number;
  } {
    let leveledUp = false;
    let oldLevel = 1;
    let newLevel = 1;

    const updated = this.updateActiveProfile((p) => {
      oldLevel = p.level;
      let curExp = p.exp + expAmount;
      let curLevel = p.level;

      let reqExp = getExpRequiredForLevel(curLevel);
      while (curExp >= reqExp) {
        curExp -= reqExp;
        curLevel += 1;
        leveledUp = true;
        reqExp = getExpRequiredForLevel(curLevel);
      }

      newLevel = curLevel;
      return {
        ...p,
        level: curLevel,
        exp: curExp,
      };
    });

    return {
      updatedProfile: updated,
      leveledUp,
      oldLevel,
      newLevel,
      expGained: expAmount,
    };
  }

  public addReward(stars: number, coins: number): UserProfile {
    return this.updateActiveProfile((p) => {
      const newStars = p.stars + stars;
      const newCoins = p.coins + coins;
      return {
        ...p,
        stars: newStars,
        coins: newCoins,
      };
    });
  }

  /**
   * Record an error to the student's personal mistake review list.
   */
  public recordMistake(mistake: Omit<MistakeItem, 'id' | 'timestamp'>): void {
    const item: MistakeItem = {
      ...mistake,
      id: 'mstk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };

    this.updateActiveProfile((p) => {
      // Keep up to 50 most recent mistakes without duplicates
      const filtered = (p.mistakeReviewList || []).filter(
        (m) => !(m.gameId === item.gameId && m.question === item.question)
      );
      return {
        ...p,
        mistakeReviewList: [item, ...filtered].slice(0, 50),
      };
    });
  }

  public clearMistakes(): UserProfile {
    return this.updateActiveProfile((p) => ({
      ...p,
      mistakeReviewList: [],
    }));
  }

  /**
   * Save complete 100-question session results.
   */
  public saveCompletedGameSession(
    result: Omit<GameSessionResult, 'id' | 'date' | 'levelAtStart' | 'levelAtEnd'>
  ): {
    updatedProfile: UserProfile;
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
  } {
    const cur = this.getActiveProfile();
    const oldLevel = cur.level;

    // Calculate EXP + completion bonus
    const expResult = this.addExp(result.expEarned);
    const endLevel = expResult.newLevel;

    const sessionRecord: GameSessionResult = {
      ...result,
      id: 'sess-' + Date.now(),
      date: new Date().toISOString(),
      levelAtStart: oldLevel,
      levelAtEnd: endLevel,
    };

    const finalProfile = this.updateActiveProfile((p) => {
      const inProg = { ...(p.inProgressSessions || {}) };
      delete inProg[result.gameId];

      const history = [sessionRecord, ...(p.gameHistory || [])].slice(0, 30);
      const stats = {
        ...p.stats,
        gamesPlayed: p.stats.gamesPlayed + 1,
        sessionsCompleted100: (p.stats.sessionsCompleted100 || 0) + 1,
      };

      return {
        ...p,
        gameHistory: history,
        inProgressSessions: inProg,
        stats,
        stars: p.stars + Math.max(5, Math.floor(result.score / 15)),
        coins: p.coins + Math.max(15, Math.floor(result.score / 5)),
      };
    });

    return {
      updatedProfile: finalProfile,
      leveledUp: expResult.leveledUp,
      oldLevel,
      newLevel: endLevel,
    };
  }

  /**
   * Save in-progress game state so user can resume anytime.
   */
  public saveInProgressGame(session: InProgressGameSession): void {
    this.updateActiveProfile((p) => {
      const inProg = { ...(p.inProgressSessions || {}) };
      inProg[session.gameId] = session;
      return {
        ...p,
        inProgressSessions: inProg,
      };
    });
  }

  public getInProgressGame(gameId: string): InProgressGameSession | null {
    const profile = this.getActiveProfile();
    return profile.inProgressSessions?.[gameId] || null;
  }

  public clearInProgressGame(gameId: string): void {
    this.updateActiveProfile((p) => {
      const inProg = { ...(p.inProgressSessions || {}) };
      delete inProg[gameId];
      return {
        ...p,
        inProgressSessions: inProg,
      };
    });
  }

  public markLessonComplete(
    lessonId: string,
    subject: 'english' | 'math' | 'mongolian'
  ): { updatedProfile: UserProfile; leveledUp: boolean } {
    let leveledUp = false;
    const updated = this.updateActiveProfile((p) => {
      const alreadyDone = p.completedLessons.includes(lessonId);
      const completed = alreadyDone ? p.completedLessons : [...p.completedLessons, lessonId];
      const stats = { ...p.stats };
      if (!alreadyDone) {
        if (subject === 'english') stats.englishLessonsDone += 1;
        if (subject === 'math') stats.mathLessonsDone += 1;
        if (subject === 'mongolian') stats.mongolianLessonsDone += 1;
      }

      // Add EXP for lesson
      const expGain = alreadyDone ? 10 : 35;
      let curExp = p.exp + expGain;
      let curLevel = p.level;
      let reqExp = getExpRequiredForLevel(curLevel);
      while (curExp >= reqExp) {
        curExp -= reqExp;
        curLevel += 1;
        leveledUp = true;
        reqExp = getExpRequiredForLevel(curLevel);
      }

      return {
        ...p,
        level: curLevel,
        exp: curExp,
        completedLessons: completed,
        stats,
        stars: p.stars + (alreadyDone ? 1 : 3),
        coins: p.coins + (alreadyDone ? 2 : 10),
      };
    });

    return { updatedProfile: updated, leveledUp };
  }

  public saveDrawing(drawing: SavedDrawing): UserProfile {
    return this.updateActiveProfile((p) => {
      const drawings = [drawing, ...(p.savedDrawings || [])];
      return {
        ...p,
        savedDrawings: drawings,
        stars: p.stars + 2,
        coins: p.coins + 5,
        exp: p.exp + 15,
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
