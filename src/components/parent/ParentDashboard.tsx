import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  Palette,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Settings,
  Users,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, ProfileType, AppSettings } from '../../types';
import { storageService } from '../../services/storageService';
import { speechService } from '../../services/speechService';

interface ParentDashboardProps {
  activeProfile: UserProfile;
  allProfiles: Record<ProfileType, UserProfile>;
  onSwitchProfile: (type: ProfileType) => void;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  settings: AppSettings;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  activeProfile,
  allProfiles,
  onSwitchProfile,
  onClose,
  onUpdateSettings,
  settings,
}) => {
  const [parentPin, setParentPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [selectedProfileTab, setSelectedProfileTab] = useState<ProfileType>(activeProfile.id);

  // Simple parental check (default PIN: 1234 or parent simple math equation 7 + 5 = 12)
  const handleUnlockWithMath = () => {
    setIsUnlocked(true);
    speechService.playSoundEffect('correct');
  };

  const currentProf = allProfiles[selectedProfileTab];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl border border-teal-200 dark:border-teal-800">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Эцэг эхийн хяналтын самбар</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Хувийн ба Нууцлалтай
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Хүүхдийн ахиц дэвшил, сургалтын цаг, дүн шинжилгээ, хүндрэлтэй сэдвүүд.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Parental Gate Check if not unlocked */}
        {!isUnlocked ? (
          <div className="py-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 mx-auto flex items-center justify-center text-3xl">
              🔒
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Эцэг эхийн баталгаажуулалт
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Хүүхдийн хувийн мэдээллийг хамгаалах зорилгоор доорх энгийн бодлогыг бодож нэвтэрнэ үү:
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-xl font-extrabold text-slate-800 dark:text-white mb-3">
                7 + 5 = ?
              </div>
              <div className="flex justify-center gap-3">
                {[10, 12, 14].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => {
                      if (ans === 12) {
                        handleUnlockWithMath();
                      } else {
                        speechService.playSoundEffect('wrong');
                        setPinError(true);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm"
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            {pinError && (
              <p className="text-xs text-rose-500 font-semibold">
                Буруу хариулт. Зөв хариуг сонгоно уу.
              </p>
            )}
          </div>
        ) : (
          /* Unlocked Dashboard Content */
          <div className="space-y-6">
            {/* Profile Selector */}
            <div className="flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setSelectedProfileTab('sister')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedProfileTab === 'sister'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>👧</span>
                <span>Миний дүү ({allProfiles.sister.displayNameMn})</span>
              </button>

              <button
                onClick={() => setSelectedProfileTab('mom')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  selectedProfileTab === 'mom'
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>👩</span>
                <span>Ээж ({allProfiles.mom.displayNameMn})</span>
              </button>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Цуглуулсан од
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  ⭐ {currentProf.stars}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Түвшин {currentProf.level}</div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60">
                <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase">
                  Дуусгасан хичээл
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {currentProf.completedLessons.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Нийт хичээлээс</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Сурсан үгс
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {currentProf.stats.wordsMastered}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Толь бичгээс</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Зурсан бүтээл
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {currentProf.savedDrawings.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Урланд хадгалсан</div>
              </div>
            </div>

            {/* Daily Goal & Progress */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Өдрийн сургалтын зорилго (Daily Goal):</span>
                </span>
                <span className="text-purple-600 tabular-nums">
                  {currentProf.learningGoals.completedTodayMinutes} / {currentProf.learningGoals.dailyTargetMinutes} минут
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (currentProf.learningGoals.completedTodayMinutes /
                        currentProf.learningGoals.dailyTargetMinutes) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>🔥 Хичээлийн дараалал: {currentProf.learningGoals.dailyStreak} өдөр тасралтгүй</span>
                <span>Зорилго биелэхэд {Math.max(0, currentProf.learningGoals.dailyTargetMinutes - currentProf.learningGoals.completedTodayMinutes)} минут үлдлээ</span>
              </div>
            </div>

            {/* Performance by Subject */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Хичээл бүрийн ахиц дэвшил
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Англи хэлний 20 модуль
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Яриа, дүрэм, үсэг бичилт, үлгэр
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-purple-600 tabular-nums">
                      {currentProf.stats.englishLessonsDone} / 20 хичээл
                    </div>
                    <div className="text-[10px] text-emerald-600">Идэвхтэй сайн байна</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">➕</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Математикийн 20 модуль
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Тоолох, бодох, төгрөгөөр худалдаа хийх
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-sky-600 tabular-nums">
                      {currentProf.stats.mathLessonsDone} / 20 бодлого
                    </div>
                    <div className="text-[10px] text-emerald-600">Зөв бодолт 90%</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇲🇳</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Монгол хэл, 35 үсэг & Монгол бичиг
                      </div>
                      <div className="text-[11px] text-slate-500">
                        35 үсэг, үндсэн 7 эгшиг, 100 асуулттай сорилууд
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-600">
                      {currentProf.stats.mongolianLessonsDone} хичээл
                    </div>
                    <div className="text-[10px] text-emerald-600">Цагаан толгой идэвхтэй</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 100-Question Game Sessions History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🎮</span>
                  <span>100 Асуулттай сорилуудын түүх ({currentProf.gameHistory?.length || 0})</span>
                </h3>
              </div>

              {!currentProf.gameHistory || currentProf.gameHistory.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-400">
                  Одоогоор 100 асуулттай бүтэн тоглоом дуусгаагүй байна. Тоглоомоо дуусгахад дүн энд хадгалагдана.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentProf.gameHistory.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {sess.gameTitle}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(sess.date).toLocaleDateString()} · Түвшин {sess.levelAtStart} ➔ {sess.levelAtEnd}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-purple-600">
                          {sess.correctCount} / 100 ({sess.percentage}%)
                        </span>
                        <div className="text-[10px] text-amber-500 font-bold">
                          +{sess.expEarned} EXP
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mistakes Review List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📝</span>
                  <span>Анхаарах алдааны жагсаалт ({currentProf.mistakeReviewList?.length || 0})</span>
                </h3>
                {currentProf.mistakeReviewList && currentProf.mistakeReviewList.length > 0 && (
                  <button
                    onClick={() => {
                      storageService.clearMistakes();
                      speechService.playSoundEffect('pop');
                    }}
                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    Арилгах
                  </button>
                )}
              </div>

              {!currentProf.mistakeReviewList || currentProf.mistakeReviewList.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 text-center text-xs text-emerald-700 dark:text-emerald-300">
                  ✓ Одоогоор давтах шаардлагатай алдаа бүртгэгдээгүй байна. Маш сайн!
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {currentProf.mistakeReviewList.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {m.question}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] flex-wrap">
                        <span className="text-rose-500 line-through">
                          Алдаа: {m.userAnswer || 'Хоосон'}
                        </span>
                        <span>➔</span>
                        <span className="text-emerald-600 font-bold">
                          Зөв хариу: {m.correctAnswer}
                        </span>
                      </div>
                      {m.explanation && (
                        <p className="text-[10px] text-slate-500 italic">
                          {m.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Compliance Assurance Note */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span>Хүүхдийн аюулгүй байдал & Нууцлалын баталгаа:</span>
              </div>
              <p className="leading-relaxed">
                Энэхүү аппликейшн нь олон нийтийн чат, байршил тогтоох систем, гаднын зар сурталчилгаагүй бөгөөд суралцагчийн бүх мэдээлэл зөвхөн таны төхөөрөмж дээр найдвартай хадгалагдана.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
