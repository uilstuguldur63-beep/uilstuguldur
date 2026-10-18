import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Lock,
  Unlock,
  Check,
  ShoppingBag,
  MapPin,
  Star,
  Coins,
} from 'lucide-react';
import { UserProfile, MascotOutfit } from '../../types';
import { worldAreas, mascotOutfits, allBadges } from '../../data/virtualWorldData';
import { MimiMascot } from '../common/MimiMascot';
import { speechService } from '../../services/speechService';
import { fireCelebrationConfetti } from '../common/Confetti';
import { storageService } from '../../services/storageService';

interface MimiWorldProps {
  activeProfile: UserProfile;
  onProfileUpdated: (p: UserProfile) => void;
}

export const MimiWorld: React.FC<MimiWorldProps> = ({ activeProfile, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'wardrobe' | 'badges'>('map');
  const [equippedHat, setEquippedHat] = useState(activeProfile.equippedHat);
  const [equippedAccessory, setEquippedAccessory] = useState(activeProfile.equippedAccessory);

  const handleEquipItem = (outfit: MascotOutfit) => {
    speechService.playSoundEffect('click');
    if (outfit.type === 'hat') {
      const updated = storageService.updateActiveProfile((p) => ({
        ...p,
        equippedHat: outfit.id,
      }));
      setEquippedHat(outfit.id);
      onProfileUpdated(updated);
    } else {
      const updated = storageService.updateActiveProfile((p) => ({
        ...p,
        equippedAccessory: outfit.id,
      }));
      setEquippedAccessory(outfit.id);
      onProfileUpdated(updated);
    }
  };

  const handleUnlockItem = (outfit: MascotOutfit) => {
    if (activeProfile.coins < outfit.cost) {
      alert(`Зоос хүрэлцэхгүй байна! Танд 🪙 ${outfit.cost} зоос хэрэгтэй.`);
      speechService.playSoundEffect('wrong');
      return;
    }

    speechService.playSoundEffect('star');
    fireCelebrationConfetti();
    const updated = storageService.updateActiveProfile((p) => ({
      ...p,
      coins: p.coins - outfit.cost,
      unlockedOutfits: [...(p.unlockedOutfits || []), outfit.id],
    }));
    onProfileUpdated(updated);
    speechService.speakEnglish(`Congratulations! Unlocked ${outfit.name}!`);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏆</span>
            <span>Мимигийн виртуал ертөнц (Mimi's World)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Хичээл сурч олсон од, зоосоороо шинэ газрууд нээж, Мимигээ гоёх виртуал орчин.
          </p>
        </div>

        {/* Balance counter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 shadow-sm self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500 tabular-nums">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{activeProfile.stars} Од</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-600 dark:text-yellow-400 tabular-nums">
            <Coins className="w-4 h-4" />
            <span>{activeProfile.coins} Зоос</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          🗺️ Газрын зураг (World Map)
        </button>

        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wardrobe'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          👗 Мимигийн хувцаслалт (Wardrobe)
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'badges'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          🎖️ Цуглуулсан медалиуд (Badges)
        </button>
      </div>

      {/* 1. World Map Tab */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {worldAreas.map((area) => {
            const isUnlocked = activeProfile.stars >= area.requiredStars;
            return (
              <div
                key={area.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-900 shadow-sm hover:shadow-md'
                    : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl p-3 rounded-2xl bg-purple-50 dark:bg-slate-700 inline-block mb-3">
                      {area.emoji}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isUnlocked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Нээгдсэн</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>{area.requiredStars} ⭐ хэрэгтэй</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {area.nameMn}
                  </h3>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                    {area.name}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {area.descriptionMn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Wardrobe Tab */}
      {activeTab === 'wardrobe' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mimi Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-purple-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Мимигийн өнөөдрийн дүр төрх
            </h3>
            <MimiMascot
              size="xl"
              equippedHat={equippedHat}
              equippedAccessory={equippedAccessory}
            />
            <div className="text-xs font-semibold text-purple-600">
              Малгай эсвэл хэрэгсэл товшиж өмсгөөрэй!
            </div>
          </div>

          {/* Outfits selection list */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Малгай ба Хэрэгслүүд
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mascotOutfits.map((item) => {
                const isOwned =
                  item.cost === 0 || (activeProfile.unlockedOutfits || []).includes(item.id);
                const isEquipped =
                  item.type === 'hat' ? equippedHat === item.id : equippedAccessory === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-xl bg-purple-50 dark:bg-slate-700">
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.nameMn}
                        </div>
                        <div className="text-[11px] text-slate-400">{item.name}</div>
                        {!isOwned && (
                          <div className="text-xs font-bold text-yellow-600 flex items-center gap-1 mt-0.5">
                            <Coins className="w-3 h-3" />
                            <span>₮ {item.cost} зоос</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {isOwned ? (
                        <button
                          onClick={() => handleEquipItem(item)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isEquipped
                              ? 'bg-emerald-500 text-white'
                              : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {isEquipped ? 'Өмссөн ✓' : 'Өмсөх'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockItem(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold shadow-sm"
                        >
                          Нээх 🪙
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((b) => {
            const hasBadge = activeProfile.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-5 rounded-3xl border-2 flex items-start gap-4 transition-all ${
                  hasBadge
                    ? 'bg-white dark:bg-slate-800 border-yellow-300 dark:border-yellow-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div className="text-4xl p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-950/50 shrink-0">
                  {b.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.titleMn}
                    </h3>
                    {hasBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-800">
                        Авсан ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    {b.title}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
