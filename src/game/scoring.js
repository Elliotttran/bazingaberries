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
 * Images are selected in HypeOverlay from the asset registry — text is alt-only.
 *
 * Three independent systems compete; highest intensity wins:
 *
 * CASCADE CHAIN — DUBBA (2+ groups at wave 0) = chain 2, each cascade +1.
 *   chain 2 → ANOTHER_ONE (i2)   chain 3 → TRIPLE (i2)
 *   chain 4 → BAZINGABERRY (i3)  chain 5+ → MEGA_BAZINGA (i4)
 *
 * BIG MATCH — single group of 4+ tiles (only when no cascade chain).
 *   4-tile → JUICY (i1)   5+ tile → MEGA_MATCH (i3)
 *
 * MOVE STREAK — wave 0 only, driven by consecutive swap count.
 *   2 → HEATING (i1)   3 → ON_FIRE (i2)   4-5 → BAZINGABERRY (i3)
 *   6-8 → MEGA_BAZINGA (i4)   9+ → BAZILLIONAIRE (i5)
 */
const HYPE_ALT = {
  ANOTHER_ONE:   'Double!',
  TRIPLE:        'Triple!',
  MEGA_MATCH:    'Mega Match!',
  JUICY:         'Juicy!',
  HEATING:       'Heating Up!',
  ON_FIRE:       'On Fire!',
  BAZINGABERRY:  'Bazingaberry!',
  MEGA_BAZINGA:  'Mega Bazingaberry!',
  BAZILLIONAIRE: 'Bazillionaire!',
};

export function getHypeEvent(streakCombo, chainDepth, matchGroupCount, hasDubba, groupSizes) {
  const isDubba = chainDepth === 0 && matchGroupCount >= 2;
  const effectiveChain = chainDepth === 0
    ? (isDubba ? 2 : 1)
    : chainDepth + 1 + (hasDubba ? 1 : 0);

  let best = null;
  function keep(type, intensity) {
    if (!best || intensity > best.intensity) {
      best = { type, text: HYPE_ALT[type], intensity };
    }
  }

  // Cascade chain events (mutually exclusive by level)
  if (effectiveChain >= 5)      keep('MEGA_BAZINGA', 4);
  else if (effectiveChain >= 4) keep('BAZINGABERRY', 3);
  else if (effectiveChain >= 3) keep('TRIPLE',       2);
  else if (effectiveChain >= 2) keep('ANOTHER_ONE',  2);

  // Big match (only when no cascade chain active)
  const maxGroupSize = groupSizes ? Math.max(...groupSizes) : 0;
  if (effectiveChain < 2) {
    if (maxGroupSize >= 5)      keep('MEGA_MATCH', 3);
    else if (maxGroupSize >= 4) keep('JUICY',      1);
  }

  // Move streak (wave 0 only — competes with cascade/big match on intensity)
  if (chainDepth === 0) {
    if (streakCombo >= 9)      keep('BAZILLIONAIRE', 5);
    else if (streakCombo >= 6) keep('MEGA_BAZINGA',  4);
    else if (streakCombo >= 4) keep('BAZINGABERRY',  3);
    else if (streakCombo >= 3) keep('ON_FIRE',       2);
    else if (streakCombo >= 2) keep('HEATING',       1);
  }

  return best;
}
