export const BOARD_SIZE = 8;
export const TILE_COUNT = 7;
export const TOTAL_MOVES = 30;

// Scoring
export const SCORE_PER_TILE = 10;
export const BONUS_4_MATCH = 20;
export const BONUS_5_PLUS_MATCH = 50;
export const CASCADE_BONUS_PER_DEPTH = 25;

// Multiplier thresholds
export const CASCADE_MULTIPLIERS = [1, 1.5, 2, 3, 4]; // wave 1-5+
export const COMBO_MULTIPLIERS = { 2: 1.5, 3: 2, 4: 3, 5: 5 }; // combo count → mult
export const MULTI_MATCH_MULTIPLIER = 1.5; // 2+ match groups in one wave

// Combo
export const COMBO_WINDOW = 3000; // 3 seconds to land next match

// Timing (ms)
export const POP_DURATION = 280;
export const DROP_DURATION = 350;
export const SWAP_DURATION = 200;
export const SHAKE_DURATION = 300;
export const HYPE_DISPLAY_DURATION = 1200;
export const HYPE_THROTTLE = 800;

// Score milestones
export const SCORE_MILESTONES = [500, 1000, 2000, 5000, 10000, 25000, 50000];

// Hype tiers
export const HYPE_TIERS = {
  NICE: { text: 'NICE!', intensity: 1, minCombo: 2 },
  BAZINGA: { text: 'BAZINGABERRY!', intensity: 2, minCombo: 3 },
  BERRY_BLAST: { text: 'BERRY BLAST!', intensity: 3, minCombo: 4 },
  MEGA_BAZINGA: { text: 'MEGA BAZINGABERRY!', intensity: 4, minCombo: 5 },
  AVALANCHE: { text: 'AVALANCHE!', intensity: 3, minCascade: 4 },
};

// Debug
export const DEBUG = false;
