
export interface MathProblem {
  question: string;
  answer: string;
  options: string[]; // Array of 4 choices including the answer
  difficulty: number; // 1-5
}

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface BrainrotItem {
  id: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
  color: string;
  rarity: Rarity;
  effectType: 'multiplier' | 'timer' | 'base_money' | 'shield' | 'streak_bonus';
  value: number;
}

export interface Bot {
  id: string;
  name: string;
  avatar: string;
  inventory: string[];
  // Vulnerability Mechanics
  isVulnerable: boolean;
  nextVulnerableTime: number; // Timestamp when they will become vulnerable next
  vulnerableUntil: number; // Timestamp when vulnerability ends
  nextBuyTime: number; // Timestamp for next purchase
}

export interface GameState {
  money: number;
  inventory: string[]; // List of item IDs
  streak: number;
  totalAnswered: number;
  multiplier: number;
  baseMoney: number;
  timerBonus: number;
  shieldActive: boolean;
  godMode: boolean; // New God Mode flag
  streakBonusMult: number;
  bots: Bot[];
  nextAttackTime: number; // Timestamp for when the base needs shielding
  consecutiveTimeouts: number; // Track how many timers expired in a row
  rebirths: number; // Number of times rebirthed
}
