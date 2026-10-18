import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Heart,
  Sparkles,
  BookMarked,
  RotateCcw,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { UserProfile, VocabularyWord } from '../../types';
import { dictionaryWords } from '../../data/dictionaryData';
import { speechService } from '../../services/speechService';
import { storageService } from '../../services/storageService';
import { fireCelebrationConfetti } from '../common/Confetti';

interface VocabularyDictionaryProps {
  activeProfile: UserProfile;
  onProfileUpdated: (p: UserProfile) => void;
}

export const VocabularyDictionary: React.FC<VocabularyDictionaryProps> = ({
  activeProfile,
  onProfileUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'dictionary' | 'flashcards' | 'favorites'>('dictionary');

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [
    { id: 'all', label: 'Бүх үгс' },
    { id: 'school', label: 'Сургууль' },
    { id: 'family', label: 'Гэр бүл' },
    { id: 'food', label: 'Хоол хүнс' },
    { id: 'animals', label: 'Амьтад' },
    { id: 'colors', label: 'Өнгө' },
    { id: 'body', label: 'Бие махбодь' },
    { id: 'actions', label: 'Үйлдлүүд' },
  ];

  const handleSpeak = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speakEnglish(text);
  };

  const handleToggleFavorite = (wordText: string) => {
    speechService.playSoundEffect('star');
    const updated = storageService.toggleFavoriteWord(wordText);
    onProfileUpdated(updated);
  };

  const filteredWords = dictionaryWords.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.mongolianMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesFavorites = activeTab !== 'favorites' || activeProfile.favoriteWords.includes(w.word);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Word of the day
  const wordOfTheDay = dictionaryWords[2]; // e.g. "classroom" or "book"

  const currentFlashcard = filteredWords[flashcardIndex % (filteredWords.length || 1)] || wordOfTheDay;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚</span>
            <span>Үгсийн сан ба Толь бичиг (Vocabulary)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Англи дуудлагатай толь бичиг, флаш карт, өдрийн онцлох үг.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'dictionary'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Толь бичиг ({dictionaryWords.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Флаш карт
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'favorites'
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Дуртай ({activeProfile.favoriteWords.length})</span>
          </button>
        </div>
      </div>

      {/* Word of the Day Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            {wordOfTheDay.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-slate-900 uppercase">
                Өдрийн онцлох үг
              </span>
              <span className="text-xs text-purple-100 font-mono">{wordOfTheDay.phonetic}</span>
            </div>
            <div className="text-xl font-extrabold">{wordOfTheDay.word}</div>
            <div className="text-xs text-purple-100 font-medium">
              Монгол утга: <span className="text-yellow-300 font-bold">{wordOfTheDay.mongolianMeaning}</span> · {wordOfTheDay.exampleEn}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSpeak(`${wordOfTheDay.word}. ${wordOfTheDay.exampleEn}`)}
          className="px-4 py-2 rounded-xl bg-white text-purple-900 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
        >
          <Volume2 className="w-4 h-4 text-purple-600" />
          <span>Дуудлага сонсох</span>
        </button>
      </div>

      {/* Tab: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="max-w-md mx-auto space-y-4 py-4 text-center">
          <div className="text-xs font-bold text-slate-400">
            Картыг эргүүлж монгол тайлбарыг хараарай
          </div>

          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              speechService.playSoundEffect('pop');
            }}
            className="cursor-pointer min-h-[260px] p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-102"
          >
            <div className="text-6xl mb-3">{currentFlashcard.emoji}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
              {currentFlashcard.word}
            </div>
            <div className="text-xs font-mono text-purple-600 dark:text-purple-400 mt-1">
              {currentFlashcard.phonetic}
            </div>

            {isFlipped ? (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-1 animate-in fade-in">
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {currentFlashcard.mongolianMeaning}
                </div>
                <div className="text-xs text-slate-500 italic">
                  "{currentFlashcard.exampleEn}"
                </div>
              </div>
            ) : (
              <div className="mt-4 text-xs text-slate-400">
                (Товшиж монгол утгыг харах)
              </div>
            )}
          </div>

          {/* Flashcard navigation buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setFlashcardIndex((p) => Math.max(0, p - 1));
                setIsFlipped(false);
                speechService.playSoundEffect('click');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
            >
              ◀ Өмнөх
            </button>
            <button
              onClick={() => handleSpeak(`${currentFlashcard.word}. ${currentFlashcard.exampleEn}`)}
              className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setFlashcardIndex((p) => p + 1);
                setIsFlipped(false);
                speechService.playSoundEffect('click');
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm"
            >
              Дараах ▶
            </button>
          </div>
        </div>
      )}

      {/* Tab: Dictionary or Favorites */}
      {(activeTab === 'dictionary' || activeTab === 'favorites') && (
        <div className="space-y-4">
          {/* Search bar & Category filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Англи эсвэл монголоор хайх (жишээ: book, алим, ном)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Words List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredWords.map((w) => {
              const isFav = activeProfile.favoriteWords.includes(w.word);
              return (
                <div
                  key={w.id}
                  className="rounded-2xl p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{w.emoji}</span>
                        <div>
                          <div className="text-base font-extrabold text-slate-900 dark:text-white capitalize">
                            {w.word}
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                            {w.phonetic}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleFavorite(w.word)}
                        className="p-1 text-slate-300 hover:text-rose-500"
                        title={isFav ? 'Дуртай үгсээс хасах' : 'Дуртай үгсэд нэмэх'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {w.mongolianMeaning}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                        "{w.exampleEn}"
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {w.category}
                    </span>
                    <button
                      onClick={() => handleSpeak(`${w.word}. ${w.exampleEn}`)}
                      className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Сонсох</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
