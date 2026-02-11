
import { BrainrotItem } from './types';

export const BASE_QUESTION_TIME = 30; // Changed to 30s
export const BASE_MONEY_REWARD = 10;
export const BASE_INVENTORY_SIZE = 8; // Renamed from MAX_INVENTORY_SIZE. Base slots.
export const MAX_BOT_INVENTORY_SIZE = 4;

// Rebirth Config
export const BASE_REBIRTH_COST = 1000000;
export const REBIRTH_MULTIPLIER_BONUS = 0.5; // +50% multiplier per rebirth

// Specific costs for Rebirth levels 1-8
// Rebirth 8 is the Admin Panel unlock at 80M
const REBIRTH_COST_TIERS = [
    1000000,   // Level 1
    5000000,   // Level 2
    10000000,  // Level 3
    25000000,  // Level 4
    40000000,  // Level 5
    60000000,  // Level 6
    70000000,  // Level 7
    80000000   // Level 8 (Admin Panel)
];

export const getRebirthCost = (targetLevel: number): number => {
    if (targetLevel <= 0) return 0;
    
    // Use defined tiers if available
    if (targetLevel <= REBIRTH_COST_TIERS.length) {
        return REBIRTH_COST_TIERS[targetLevel - 1];
    }
    
    // Fallback scaling for levels > 8 (Add 50M per level)
    const lastDefinedCost = REBIRTH_COST_TIERS[REBIRTH_COST_TIERS.length - 1];
    const extraLevels = targetLevel - REBIRTH_COST_TIERS.length;
    return lastDefinedCost + (extraLevels * 50000000);
};

// Helper to calculate passive income based on price (1% of price per second, min 1)
export const getPassiveIncome = (price: number): number => {
    return Math.max(1, Math.floor(price * 0.01));
};

export const BOT_PROFILES = [
    { name: "Mrs. Garner", avatar: "👩‍🏫" },
    { name: "Mrs. Sykes", avatar: "👩‍💼" },
    { name: "Mr. Gremillion", avatar: "👨‍🏫" },
    { name: "Mrs. Huynh", avatar: "👩‍🔬" },
    { name: "Mrs. Young", avatar: "👩‍🎨" },
    { name: "Mrs. Blackwell", avatar: "📓" },
    { name: "Mrs. Craig", avatar: "🍎" },
    { name: "Mrs. Morgan", avatar: "💻" },
    { name: "Coach Copley", avatar: "🧢" },
    { name: "Coach Redwine", avatar: "👟" },
    { name: "Jimmy", avatar: "🤪" },
    // New Rivals
    { name: "Israel", avatar: "😎" },
    { name: "Harper", avatar: "🎀" },
    { name: "Luke F.", avatar: "🧢" },
    { name: "Lawson", avatar: "🦁" },
    { name: "Luke M.", avatar: "🎸" },
    { name: "Vina", avatar: "🌺" },
    { name: "Hope", avatar: "✨" },
    { name: "Ellie", avatar: "🎨" },
    { name: "Dominic", avatar: "🎮" },
    { name: "Joseph", avatar: "🏀" },
    { name: "Madi", avatar: "👯‍♀️" },
    { name: "Blyss", avatar: "🌟" },
    { name: "Charlotte", avatar: "🧁" },
    { name: "Lincoln", avatar: "🎩" },
    { name: "Haven", avatar: "🌈" },
    { name: "Noah", avatar: "⚓" },
    { name: "Spencer", avatar: "🚀" },
    { name: "Charlie", avatar: "🐶" },
    { name: "Landon", avatar: "⚽" }
];

export const SHOP_ITEMS: BrainrotItem[] = [
  // 🟢 Common (Green)
  { id: 'noobini_pizzanini', name: 'Noobini Pizzanini', price: 20, description: '+5 Base Money', emoji: '🍕', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 5 },
  { id: 'noobini_santanini', name: 'Noobini Santanini', price: 25, description: '+2s Question Timer', emoji: '🎅', color: 'bg-green-500', rarity: 'common', effectType: 'timer', value: 2 },
  { id: 'lirili_larila', name: 'Lirili Larila', price: 50, description: '+8 Base Money', emoji: '🎶', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 8 },
  { id: 'tim_cheese', name: 'Tim Cheese', price: 75, description: '+10 Base Money', emoji: '🧀', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 10 },
  { id: 'fluriflura', name: 'FluriFlura', price: 100, description: '+3s Question Timer', emoji: '🌸', color: 'bg-green-500', rarity: 'common', effectType: 'timer', value: 3 },
  { id: 'talpa_di_fero', name: 'Talpa Di Fero', price: 125, description: '+12 Base Money', emoji: '🦦', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 12 },
  { id: 'svinina_bombardino', name: 'Svinina Bombardino', price: 150, description: '+15 Base Money', emoji: '🐷', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 15 },
  { id: 'raccooni_jandelini', name: 'Raccooni Jandelini', price: 175, description: '+4s Question Timer', emoji: '🦝', color: 'bg-green-500', rarity: 'common', effectType: 'timer', value: 4 },
  { id: 'tartaragno', name: 'Tartaragno', price: 200, description: '+18 Base Money', emoji: '🐢', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 18 },
  { id: 'pipi_kiwi', name: 'Pipi Kiwi', price: 225, description: '+20 Base Money', emoji: '🥝', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 20 },
  { id: 'pipi_corni', name: 'Pipi Corni', price: 250, description: '+22 Base Money', emoji: '🌽', color: 'bg-green-500', rarity: 'common', effectType: 'base_money', value: 22 },

  // 🔵 Rare (Blue)
  { id: 'trippi_troppi', name: 'Trippi Troppi', price: 500, description: '+0.1x Money Multiplier', emoji: '🍄', color: 'bg-blue-500', rarity: 'rare', effectType: 'multiplier', value: 0.1 },
  { id: 'tung_tung_tung', name: 'Tung Tung Tung Sahur', price: 600, description: '+0.15x Money Multiplier', emoji: '🥁', color: 'bg-blue-500', rarity: 'rare', effectType: 'multiplier', value: 0.15 },
  { id: 'gangster_footera', name: 'Gangster Footera', price: 700, description: '+30 Base Money', emoji: '⚽', color: 'bg-blue-500', rarity: 'rare', effectType: 'base_money', value: 30 },
  { id: 'bandito_bobritto', name: 'Bandito Bobritto', price: 800, description: '+5s Question Timer', emoji: '🌯', color: 'bg-blue-500', rarity: 'rare', effectType: 'timer', value: 5 },
  { id: 'boneca_ambalabu', name: 'Boneca Ambalabu', price: 900, description: '+35 Base Money', emoji: '🎎', color: 'bg-blue-500', rarity: 'rare', effectType: 'base_money', value: 35 },
  { id: 'cacto_hipopotamo', name: 'Cacto Hipopotamo', price: 1000, description: '+0.2x Money Multiplier', emoji: '🦛', color: 'bg-blue-500', rarity: 'rare', effectType: 'multiplier', value: 0.2 },
  { id: 'ta_ta_ta_ta', name: 'Ta Ta Ta Ta Sahur', price: 1100, description: '+40 Base Money', emoji: '📢', color: 'bg-blue-500', rarity: 'rare', effectType: 'base_money', value: 40 },
  { id: 'cupkake_koala', name: 'Cupkake Koala', price: 1200, description: '+6s Question Timer', emoji: '🐨', color: 'bg-blue-500', rarity: 'rare', effectType: 'timer', value: 6 },
  { id: 'tric_trac_baraboom', name: 'Tric Trac Baraboom', price: 1300, description: '+45 Base Money', emoji: '💥', color: 'bg-blue-500', rarity: 'rare', effectType: 'base_money', value: 45 },
  { id: 'frogo_elfo', name: 'Frogo Elfo', price: 1400, description: '+0.25x Money Multiplier', emoji: '🐸', color: 'bg-blue-500', rarity: 'rare', effectType: 'multiplier', value: 0.25 },
  { id: 'pipi_avocado', name: 'Pipi Avocado', price: 1500, description: '+50 Base Money', emoji: '🥑', color: 'bg-blue-500', rarity: 'rare', effectType: 'base_money', value: 50 },
  { id: 'pinealotto_fruttarino', name: 'Pinealotto Fruttarino', price: 1600, description: '+0.3x Money Multiplier', emoji: '🍍', color: 'bg-blue-500', rarity: 'rare', effectType: 'multiplier', value: 0.3 },

  // 🟣 Epic (Purple)
  { id: 'cappuccino_assassino', name: 'Cappuccino Assassino', price: 2500, description: '+0.4x Money Multiplier', emoji: '☕', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.4 },
  { id: 'bandito_axolito', name: 'Bandito Axolito', price: 2800, description: '+60 Base Money', emoji: '🦎', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 60 },
  { id: 'brr_brr_patapim', name: 'Brr Brr Patapim', price: 3100, description: '+0.5x Money Multiplier', emoji: '🧊', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.5 },
  { id: 'avocadini_antilopini', name: 'Avocadini Antilopini', price: 3400, description: '+70 Base Money', emoji: '🦌', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 70 },
  { id: 'trulimero_trulicina', name: 'Trulimero Trulicina', price: 3700, description: '+10s Question Timer', emoji: '🧙', color: 'bg-purple-500', rarity: 'epic', effectType: 'timer', value: 10 },
  { id: 'bambini_crostini', name: 'Bambini Crostini', price: 4000, description: '+0.6x Money Multiplier', emoji: '🍞', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.6 },
  { id: 'malame_amarele', name: 'Malame Amarele', price: 4300, description: '+80 Base Money', emoji: '🟡', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 80 },
  { id: 'bananita_dolphinita', name: 'Bananita Dolphinita', price: 4600, description: '+0.7x Money Multiplier', emoji: '🐬', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.7 },
  { id: 'perochello_lemonchello', name: 'Perochello Lemonchello', price: 4900, description: '+90 Base Money', emoji: '🍋', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 90 },
  { id: 'brri_brri_bicus', name: 'Brri Brri Bicus Dicus', price: 5200, description: '+100 Base Money', emoji: '💣', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 100 },
  { id: 'avocadini_guffo', name: 'Avocadini Guffo', price: 5500, description: '+0.8x Money Multiplier', emoji: '🦉', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.8 },
  { id: 'ti_ti_ti_sahur', name: 'Ti Ti Ti Sahur', price: 5800, description: '+110 Base Money', emoji: '⏰', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 110 },
  { id: 'mangolini_parrocini', name: 'Mangolini Parrocini', price: 6100, description: '+0.9x Money Multiplier', emoji: '🦜', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 0.9 },
  { id: 'frogato_pirato', name: 'Frogato Pirato', price: 6400, description: '+120 Base Money', emoji: '🏴‍☠️', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 120 },
  { id: 'penguin_tree', name: 'Penguin Tree', price: 6700, description: '+1.0x Money Multiplier', emoji: '🌲', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 1.0 },
  { id: 'penguino_cocosino', name: 'Penguino Cocosino', price: 7000, description: '+130 Base Money', emoji: '🥥', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 130 },
  { id: 'salamino_penguino', name: 'Salamino Penguino', price: 7300, description: '+1.1x Money Multiplier', emoji: '🌭', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 1.1 },
  { id: 'doi_doi_do', name: 'Doi Doi Do', price: 7600, description: '+140 Base Money', emoji: '🎼', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 140 },
  { id: 'wombo_rollo', name: 'Wombo Rollo', price: 7900, description: '+1.2x Money Multiplier', emoji: '🍥', color: 'bg-purple-500', rarity: 'epic', effectType: 'multiplier', value: 1.2 },
  { id: 'mummio_rappitto', name: 'Mummio Rappitto', price: 8200, description: '+150 Base Money', emoji: '🤕', color: 'bg-purple-500', rarity: 'epic', effectType: 'base_money', value: 150 },

  // 🟡 Legendary (Yellow)
  { id: 'burbaloni_loliloli', name: 'Burbaloni Loliloli', price: 12000, description: '+2.0x Money Multiplier', emoji: '🍭', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 2.0 },
  { id: 'chimpazini_bananini', name: 'Chimpazini Bananini', price: 14000, description: '+200 Base Money', emoji: '🐒', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 200 },
  { id: 'tirilikalika', name: 'Tirilikalika', price: 16000, description: '+2.2x Money Multiplier', emoji: '🎭', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 2.2 },
  { id: 'ballerina_cappuccina', name: 'Ballerina Cappuccina', price: 18000, description: '+250 Base Money', emoji: '🩰', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 250 },
  { id: 'chef_crabracadabra', name: 'Chef Crabracadabra', price: 20000, description: '+2.5x Money Multiplier', emoji: '🦀', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 2.5 },
  { id: 'lionel_cactuseli', name: 'Lionel Cactuseli', price: 22000, description: '+300 Base Money', emoji: '🌵', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 300 },
  { id: 'quivioli_ameleonni', name: 'Quivioli Ameleonni', price: 25000, description: 'Protects Streak (Shield)', emoji: '🦎', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'shield', value: 1 },
  { id: 'clickerino_crabo', name: 'Clickerino Crabo', price: 28000, description: '+2.8x Money Multiplier', emoji: '🖱️', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 2.8 },
  { id: 'glorbo_fruttodrillo', name: 'Glorbo Fruttodrillo', price: 31000, description: '+350 Base Money', emoji: '🐊', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 350 },
  { id: 'caramello_filtrello', name: 'Caramello Filtrello', price: 34000, description: '+3.0x Money Multiplier', emoji: '🍬', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 3.0 },
  { id: 'pipi_potato', name: 'Pipi Potato', price: 37000, description: '+400 Base Money', emoji: '🥔', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 400 },
  { id: 'blueberrini_octopusin', name: 'Blueberrini Octopusin', price: 40000, description: '+3.2x Money Multiplier', emoji: '🐙', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 3.2 },
  { id: 'strawberelli_flamingelli', name: 'Strawberelli Flamingelli', price: 45000, description: '+450 Base Money', emoji: '🦩', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 450 },
  { id: 'pandaccini_bananini', name: 'Pandaccini Bananini', price: 50000, description: '+3.5x Money Multiplier', emoji: '🐼', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 3.5 },
  { id: 'quackula', name: 'Quackula', price: 55000, description: '+500 Base Money', emoji: '🦆', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 500 },
  { id: 'cocosini_mama', name: 'Cocosini Mama', price: 60000, description: '+3.8x Money Multiplier', emoji: '🥥', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 3.8 },
  { id: 'pi_pi_watermelon', name: 'Pi Pi Watermelon', price: 65000, description: '+550 Base Money', emoji: '🍉', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 550 },
  { id: 'signore_carapace', name: 'Signore Carapace', price: 70000, description: '+4.0x Money Multiplier', emoji: '🐢', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 4.0 },
  { id: 'sigma_boy', name: 'Sigma Boy', price: 75000, description: '+600 Base Money', emoji: '🗿', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 600 },
  { id: 'chocco_bunny', name: 'Chocco Bunny', price: 80000, description: '+4.2x Money Multiplier', emoji: '🍫', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 4.2 },
  { id: 'puffaball', name: 'Puffaball', price: 85000, description: '+650 Base Money', emoji: '🐡', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 650 },
  { id: 'sealo_regalo', name: 'Sealo Regalo', price: 90000, description: '+4.5x Money Multiplier', emoji: '🦭', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 4.5 },
  { id: 'sigma_girl', name: 'Sigma Girl', price: 95000, description: '+700 Base Money', emoji: '🎀', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'base_money', value: 700 },
  { id: 'buho_de_fuego', name: 'Buho de Fuego', price: 100000, description: '+5.0x Money Multiplier', emoji: '🔥', color: 'bg-yellow-500', rarity: 'legendary', effectType: 'multiplier', value: 5.0 },

  // 🔴 Mythic (Red)
  { id: 'frigo_camelo', name: 'Frigo Camelo', price: 200000, description: '+10.0x Money Multiplier', emoji: '🐫', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 10.0 },
  { id: 'orangutini_ananassini', name: 'Orangutini Ananassini', price: 250000, description: '+1000 Base Money', emoji: '🦧', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 1000 },
  { id: 'rhino_toasterino', name: 'Rhino Toasterino', price: 300000, description: '+12.0x Money Multiplier', emoji: '🦏', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 12.0 },
  { id: 'bombardiro_crocodilo', name: 'Bombardiro Crocodilo', price: 350000, description: '+1200 Base Money', emoji: '🐊', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 1200 },
  { id: 'brutto_gialutto', name: 'Brutto Gialutto', price: 400000, description: '+15.0x Money Multiplier', emoji: '👹', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 15.0 },
  { id: 'bombombini_gusini', name: 'Bombombini Gusini', price: 450000, description: '+1500 Base Money', emoji: '💣', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 1500 },
  { id: 'avocadorilla', name: 'Avocadorilla', price: 500000, description: '+18.0x Money Multiplier', emoji: '🦍', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 18.0 },
  { id: 'cavallo_virtuso', name: 'Cavallo Virtuso', price: 600000, description: '+1800 Base Money', emoji: '🐎', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 1800 },
  { id: 'gorillo_subwoofero', name: 'Gorillo Subwoofero', price: 700000, description: '+20.0x Money Multiplier', emoji: '🔊', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 20.0 },
  { id: 'gorillo_watermelondrillo', name: 'Gorillo Watermelondrillo', price: 800000, description: '+2000 Base Money', emoji: '🍉', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 2000 },
  { id: 'tob_tobi_tobi', name: 'Tob Tobi Tobi', price: 900000, description: '+25.0x Money Multiplier', emoji: '🎭', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 25.0 },
  { id: 'lerulerulerule', name: 'Lerulerulerule', price: 1000000, description: '+2500 Base Money', emoji: '🤪', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 2500 },
  { id: 'ganganzelli_trulala', name: 'Ganganzelli Trulala', price: 1200000, description: '+30.0x Money Multiplier', emoji: '🎪', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 30.0 },
  { id: 'te_te_te_sahur', name: 'Te Te Te Sahur', price: 1400000, description: '+3000 Base Money', emoji: '🍽️', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 3000 },
  { id: 'rhino_helicopterino', name: 'Rhino Helicopterino', price: 1600000, description: '+35.0x Money Multiplier', emoji: '🚁', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 35.0 },
  { id: 'magi_ribbitini', name: 'Magi Ribbitini', price: 1800000, description: '+3500 Base Money', emoji: '🧙‍♂️', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 3500 },
  { id: 'tracoducotulu', name: 'Tracoducotulu Delapeladustuz', price: 2000000, description: '+40.0x Money Multiplier', emoji: '📜', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 40.0 },
  { id: 'jingle_jingle_sahur', name: 'Jingle Jingle Sahur', price: 2500000, description: '+4000 Base Money', emoji: '🔔', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 4000 },
  { id: 'los_noobinis', name: 'Los Noobinis', price: 3000000, description: '+50.0x Money Multiplier', emoji: '👥', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 50.0 },
  { id: 'cachorrito_melonito', name: 'Cachorrito Melonito', price: 4000000, description: '+5000 Base Money', emoji: '🐶', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 5000 },
  { id: 'carloo', name: 'Carloo', price: 5000000, description: '+60.0x Money Multiplier', emoji: '🚗', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 60.0 },
  { id: 'elephanto_frigo', name: 'Elephanto Frigo', price: 7500000, description: '+6000 Base Money', emoji: '🐘', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 6000 },
  { id: 'jacko_spaventosa', name: 'Jacko Spaventosa', price: 10000000, description: '+75.0x Money Multiplier', emoji: '🎃', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 75.0 },
  { id: 'centrucci_nuclucci', name: 'Centrucci Nuclucci', price: 25000000, description: '+10,000 Base Money', emoji: '☢️', color: 'bg-red-600', rarity: 'mythic', effectType: 'base_money', value: 10000 },
  { id: 'toiletto_focaccino', name: 'Toiletto Focaccino', price: 50000000, description: '+100.0x Money Multiplier', emoji: '🚽', color: 'bg-red-600', rarity: 'mythic', effectType: 'multiplier', value: 100.0 },
  { id: 'tree_tree_tree_sahur', name: 'Tree Tree Tree Sahur', price: 100000000, description: 'Question timer is infinite (+60s)', emoji: '🌳', color: 'bg-red-600', rarity: 'mythic', effectType: 'timer', value: 60 },
];
