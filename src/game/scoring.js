import {
  SCORE_PER_TILE,
  BONUS_4_MATCH,
  BONUS_5_PLUS_MATCH,
  CASCADE_MULTIPLIERS,
  COMBO_MULTIPLIERS,
  MULTI_MATCH_MULTIPLIER,
  // eslint-disable-next-line no-unused-vars
  STREAK_TIERS, CHAIN_TIERS, // imported for reference — logic is inline below
} from '../constants.js';

/**
 * Calculate base score for a set of match groups in a single wave.
 */
export function calculateBaseScore(matchGroups) {
  let score = 0;

  for (const group of matchGroups) {
    const len = group.length;
    score += len * SCORE_PER_TILE;

    if (len === 4) {
      score += BONUS_4_MATCH;
    } else if (len >= 5) {
      score += BONUS_5_PLUS_MATCH;
    }
  }

  return score;
}

/**
 * Get cascade multiplier for the given chain depth (0-indexed).
 */
export function getCascadeMultiplier(chainDepth) {
  const idx = Math.min(chainDepth, CASCADE_MULTIPLIERS.length - 1);
  return CASCADE_MULTIPLIERS[idx];
}

/**
 * Get combo multiplier for the given combo count.
 */
export function getComboMultiplier(comboCount) {
  if (comboCount <= 1) return 1;
  // Find the highest threshold that comboCount meets
  let mult = 1;
  for (const [threshold, m] of Object.entries(COMBO_MULTIPLIERS)) {
    if (comboCount >= Number(threshold)) mult = m;
  }
  return mult;
}

/**
 * Get multi-match multiplier (2+ separate groups in one wave).
 */
export function getMultiMatchMultiplier(matchGroupCount) {
  return matchGroupCount >= 2 ? MULTI_MATCH_MULTIPLIER : 1;
}

/**
 * Calculate total multiplier for a wave.
 */
export function calculateTotalMultiplier(chainDepth, comboCount, matchGroupCount) {
  return getCascadeMultiplier(chainDepth)
    * getComboMultiplier(comboCount)
    * getMultiMatchMultiplier(matchGroupCount);
}

/**
 * Calculate final score for a wave with all multipliers.
 */
export function calculateWaveScore(matchGroups, chainDepth, comboCount) {
  const base = calculateBaseScore(matchGroups);
  const multiplier = calculateTotalMultiplier(chainDepth, comboCount, matchGroups.length);
  return { points: Math.floor(base * multiplier), multiplier, base };
}

/**
 * Determine the hype event for this wave, if any.
 *
 * Two independent systems:
 *
 * CASCADE CHAIN — fires on every wave. DUBBA (2+ simultaneous match groups
 * at chainDepth 0) counts as chain level 2. Each subsequent cascade wave
 * advances the chain by 1. If a DUBBA occurred earlier in this move,
 * all subsequent depths get +1.
 *   chain 2 → ANOTHER ONE!  chain 3 → Triple!
 *   chain 4 → Quadruple!    chain 5+ → Quintuple!
 *
 * MOVE STREAK — fires only on the first wave (chainDepth 0) with a single
 * match group (no DUBBA). Driven by streakCombo (consecutive swap count).
 *   2 → Heating  3 → On Fire  4-5 → Bazingaberry!
 *   6-8 → Mega Bazingaberry!  9+ → BAZILLIONAIRE!
 *
 * BIG MATCH — fires when any single group in the wave has 4 or 5+ tiles.
 * Takes priority over streak but not over cascade chain.
 *   4-tile → 'Juicy!' (TODO: rename)  5+ tile → 'MEGA MATCH!' (TODO: rename)
 *
 * @param {number} streakCombo   - move streak count (stays constant per move)
 * @param {number} chainDepth    - 0-indexed wave depth within this move's resolution
 * @param {number} matchGroupCount - how many separate match groups fired this wave
 * @param {boolean} hasDubba    - whether the first wave of this move had 2+ groups
 * @param {number[]} groupSizes  - array of tile counts per match group this wave
 */
const HYPE_COPY = {
  ANOTHER_ONE:   ['ANOTHER ONE!', 'DOUBLE DOOCER!', 'TWO FOR ONE!', 'DOUBLE DOWN!', 'WOW!'],
  TRIPLE:        ['Triple!', 'Hat Trick!', "Three's Company!", 'WOW!'],
  QUADRUPLE:     ['Quadruple!', 'FOUR ALARM!', 'ON A ROLL!', 'WOW!'],
  QUINTUPLE:     ['Quintuple!', 'UNSTOPPABLE!', 'BERRY BONANZA!', 'WOW!'],
  MEGA_MATCH:    ['MEGA MATCH!', 'MONSTER!', 'COLOSSAL!'],
  JUICY:         ['Juicy!', 'BIG SQUEEZE!', 'THICK ONE!', 'JOOCI!'],
  HEATING:       ['Heating', 'Warming Up', 'Getting Spicy', 'C-C-COMBO BREAKER'],
  ON_FIRE:       ['On Fire', "Smokin'", 'Hot Streak'],
  BAZINGABERRY:  ['Bazingaberry!', 'Berry Good!', "Now We're Talking!"],
  MEGA_BAZINGA:  ['Mega Bazingaberry!', 'UNREAL!', 'BUSTING!', 'BERRY SPREE'],
  BAZILLIONAIRE: ['BAZILLIONAIRE!', 'BERRY KING!', 'BUSTING IN HERE'],
};

function pick(type) {
  const pool = HYPE_COPY[type];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getHypeEvent(streakCombo, chainDepth, matchGroupCount, hasDubba, groupSizes) {
  const isDubba = chainDepth === 0 && matchGroupCount >= 2;

  // Effective chain level:
  //   depth 0, single match → 1 (no chain event)
  //   depth 0, DUBBA        → 2 (ANOTHER ONE!)
  //   depth 1+              → depth + 1 + (hasDubba ? 1 : 0)
  const effectiveChain = chainDepth === 0
    ? (isDubba ? 2 : 1)
    : chainDepth + 1 + (hasDubba ? 1 : 0);

  // --- Cascade chain events (level 2+) ---
  if (effectiveChain >= 5) return { type: 'QUINTUPLE',   text: pick('QUINTUPLE'),   intensity: 4 };
  if (effectiveChain >= 4) return { type: 'QUADRUPLE',   text: pick('QUADRUPLE'),   intensity: 3 };
  if (effectiveChain >= 3) return { type: 'TRIPLE',      text: pick('TRIPLE'),      intensity: 2 };
  if (effectiveChain >= 2) return { type: 'ANOTHER_ONE', text: pick('ANOTHER_ONE'), intensity: 2 };

  // --- Big match events (only at chain level 1 — no cascade chain active) ---
  const maxGroupSize = groupSizes ? Math.max(...groupSizes) : 0;
  if (maxGroupSize >= 5) return { type: 'MEGA_MATCH', text: pick('MEGA_MATCH'), intensity: 3 };
  if (maxGroupSize >= 4) return { type: 'JUICY',      text: pick('JUICY'),      intensity: 1 };

  // --- Move streak events (first wave, single match only) ---
  if (chainDepth === 0 && matchGroupCount < 2) {
    if (streakCombo >= 9) return { type: 'BAZILLIONAIRE', text: pick('BAZILLIONAIRE'), intensity: 5 };
    if (streakCombo >= 6) return { type: 'MEGA_BAZINGA',  text: pick('MEGA_BAZINGA'),  intensity: 4 };
    if (streakCombo >= 4) return { type: 'BAZINGABERRY',  text: pick('BAZINGABERRY'),  intensity: 3 };
    if (streakCombo >= 3) return { type: 'ON_FIRE',       text: pick('ON_FIRE'),       intensity: 2 };
    if (streakCombo >= 2) return { type: 'HEATING',       text: pick('HEATING'),       intensity: 1 };
  }

  return null;
}
