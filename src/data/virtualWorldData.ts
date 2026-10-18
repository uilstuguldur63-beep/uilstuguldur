import { MascotOutfit, Badge } from '../types';

export interface WorldArea {
  id: string;
  name: string;
  nameMn: string;
  descriptionMn: string;
  emoji: string;
  themeColor: string;
  requiredStars: number;
}

export const worldAreas: WorldArea[] = [
  {
    id: 'area-alphabet',
    name: 'Alphabet Town',
    nameMn: 'Үсэгтийн хотхон',
    descriptionMn: 'A-Z үсгүүдийн гэр, шидэт үсгийн гудамж ба цэцэрлэг.',
    emoji: '🏘️',
    themeColor: '#8B5CF6',
    requiredStars: 0,
  },
  {
    id: 'area-forest',
    name: 'Animal Forest',
    nameMn: 'Амьтдын нууц ой',
    descriptionMn: 'Туулай, нугас, заантай уулзаж амьтдын нэрийг сурах ой.',
    emoji: '🌲',
    themeColor: '#10B981',
    requiredStars: 5,
  },
  {
    id: 'area-color-city',
    name: 'Color City',
    nameMn: 'Өнгөт хотхон',
    descriptionMn: 'Солонгон замууд, өнгө өнгийн байшин, зургийн урлан.',
    emoji: '🌈',
    themeColor: '#F59E0B',
    requiredStars: 10,
  },
  {
    id: 'area-math-kingdom',
    name: 'Math Kingdom',
    nameMn: 'Тооны хаант улс',
    descriptionMn: 'Тоон цайз, бутархайн пирамид, тоолох талбар.',
    emoji: '🏰',
    themeColor: '#0EA5E9',
    requiredStars: 15,
  },
  {
    id: 'area-grammar-castle',
    name: 'Grammar Castle',
    nameMn: 'Дүрмийн ордон',
    descriptionMn: 'Өгүүлбэр бүтээх эрдмийн номын сан.',
    emoji: '📘',
    themeColor: '#EC4899',
    requiredStars: 25,
  },
  {
    id: 'area-storybook',
    name: 'Storybook Village',
    nameMn: 'Үлгэрийн тосгон',
    descriptionMn: 'Үлгэрүүд амилдаг гайхамшигт тосгон.',
    emoji: '📖',
    themeColor: '#6366F1',
    requiredStars: 35,
  },
  {
    id: 'area-space',
    name: 'Space Station',
    nameMn: 'Сансрын станц',
    descriptionMn: 'Од эрхэс, сансар огторгуй, англи хэлний оньсого.',
    emoji: '🚀',
    themeColor: '#3B82F6',
    requiredStars: 50,
  },
];

export const mascotOutfits: MascotOutfit[] = [
  {
    id: 'hat-party',
    name: 'Party Cone Hat',
    nameMn: 'Баярын малгай',
    type: 'hat',
    cost: 0,
    unlocked: true,
    equipped: true,
    icon: '🎉',
  },
  {
    id: 'hat-crown',
    name: 'Golden Crown',
    nameMn: 'Алтан титэм',
    type: 'hat',
    cost: 30,
    unlocked: false,
    equipped: false,
    icon: '👑',
  },
  {
    id: 'hat-grad',
    name: 'Scholar Cap',
    nameMn: 'Эрдэмтний малгай',
    type: 'hat',
    cost: 50,
    unlocked: false,
    equipped: false,
    icon: '🎓',
  },
  {
    id: 'hat-chef',
    name: 'Chef Hat',
    nameMn: 'Тогоочийн малгай',
    type: 'hat',
    cost: 25,
    unlocked: false,
    equipped: false,
    icon: '👨‍🍳',
  },
  {
    id: 'acc-wand',
    name: 'Star Wand',
    nameMn: 'Одон саваа',
    type: 'accessory',
    cost: 20,
    unlocked: true,
    equipped: true,
    icon: '🪄',
  },
  {
    id: 'acc-palette',
    name: 'Artist Palette',
    nameMn: 'Зураачийн тавиур',
    type: 'accessory',
    cost: 35,
    unlocked: false,
    equipped: false,
    icon: '🎨',
  },
  {
    id: 'acc-book',
    name: 'Golden Book',
    nameMn: 'Эрдмийн алтан ном',
    type: 'accessory',
    cost: 40,
    unlocked: false,
    equipped: false,
    icon: '📖',
  },
];

export const allBadges: Badge[] = [
  {
    id: 'first-step',
    title: 'First Step',
    titleMn: 'Анхны алхам',
    description: 'Эхний хичээлийг амжилттай дуусгалаа!',
    icon: '🌟',
  },
  {
    id: 'star-counter',
    title: 'Star Counter',
    titleMn: 'Одод тоологч',
    description: '10 од цуглуулж түвшин ахилаа!',
    icon: '⭐',
  },
  {
    id: 'little-artist',
    title: 'Little Artist',
    titleMn: 'Бяцхан зураач',
    description: 'Анхны бүтээлээ зурж хадгалав!',
    icon: '🎨',
  },
  {
    id: 'word-master',
    title: 'Word Master',
    titleMn: 'Үгийн мастер',
    description: '20 шинэ үгийг цээжиллээ!',
    icon: '📚',
  },
  {
    id: 'math-wizard',
    title: 'Math Wizard',
    titleMn: 'Тооны шидтэн',
    description: 'Математикийн 5 бодлогыг алдаагүй бодлоо!',
    icon: '🧮',
  },
  {
    id: 'daily-streaker',
    title: 'Daily Champion',
    titleMn: 'Өдөр тутмын аваргууд',
    description: '3 өдөр дараалан хичээлээ хийлээ!',
    icon: '🔥',
  },
  {
    id: 'story-explorer',
    title: 'Story Explorer',
    titleMn: 'Үлгэрийн аялагч',
    description: 'Бүх үлгэрийг бүрэн уншиж сорилоо амжилттай өглөө!',
    icon: '🏰',
  },
];
