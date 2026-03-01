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
export const HYPE_THROTTLE = 500; // lowered so cascade chain events fire in quick succession

// Score milestones
export const SCORE_MILESTONES = [500, 1000, 2000, 5000, 10000, 25000, 50000];

// Move streak tiers (consecutive successful swaps)
export const STREAK_TIERS = {
  HEATING:      { text: 'Heating',           intensity: 1, minStreak: 2 },
  ON_FIRE:      { text: 'On Fire',            intensity: 2, minStreak: 3 },
  BAZINGABERRY: { text: 'Bazingaberry!',      intensity: 3, minStreak: 4 },
  MEGA_BAZINGA: { text: 'Mega Bazingaberry!', intensity: 4, minStreak: 6 },
  BAZILLIONAIRE:{ text: 'BAZILLIONAIRE!',     intensity: 5, minStreak: 9 },
};

// Cascade chain tiers (Double Doocer + each cascade wave within one move)
export const CHAIN_TIERS = {
  ANOTHER_ONE: { text: 'ANOTHER ONE!', intensity: 2, minChain: 2 },
  TRIPLE:      { text: 'Triple!',       intensity: 2, minChain: 3 },
  QUADRUPLE:   { text: 'Quadruple!',    intensity: 3, minChain: 4 },
  QUINTUPLE:   { text: 'Quintuple!',    intensity: 4, minChain: 5 },
};

// Debug
export const DEBUG = false;

// Game modes
export const GAME_MODES = [
  {
    id: 'standard',
    label: 'Standard',
    description: '30 moves, score as high as you can',
    moves: 30,
    timeLimit: null,
  },
  {
    id: 'time-attack',
    label: 'Time Attack',
    description: '2 minutes on the clock, unlimited moves',
    moves: null,
    timeLimit: 120,
  },
  {
    id: 'blitz',
    label: 'Blitz',
    description: '15 moves, fast & dirty',
    moves: 15,
    timeLimit: null,
  },
  {
    id: 'endless',
    label: 'Endless',
    description: 'No limits, just vibes',
    moves: null,
    timeLimit: null,
  },
];
