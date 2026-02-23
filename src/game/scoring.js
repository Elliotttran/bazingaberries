import {
  SCORE_PER_TILE,
  BONUS_4_MATCH,
  BONUS_5_PLUS_MATCH,
  CASCADE_MULTIPLIERS,
  COMBO_MULTIPLIERS,
  MULTI_MATCH_MULTIPLIER,
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
 * Returns { type, text, intensity } or null.
 */
export function getHypeEvent(comboCount, chainDepth, totalCascadeWaves) {
  // Avalanche: 4+ cascade waves in a single move (independent of combo)
  if (totalCascadeWaves >= 4) {
    return { type: 'AVALANCHE', text: 'AVALANCHE!', intensity: 3 };
  }

  // Combo-driven tiers
  if (comboCount >= 5) {
    return { type: 'MEGA_BAZINGA', text: 'MEGA BAZINGABERRY!', intensity: 4 };
  }
  if (comboCount >= 4) {
    return { type: 'BERRY_BLAST', text: 'BERRY BLAST!', intensity: 3 };
  }
  if (comboCount >= 3) {
    return { type: 'BAZINGA', text: 'BAZINGABERRY!', intensity: 2 };
  }
  if (comboCount >= 2) {
    return { type: 'NICE', text: 'NICE!', intensity: 1 };
  }

  return null;
}
