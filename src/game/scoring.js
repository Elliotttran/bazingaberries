import {
  SCORE_PER_TILE,
  BONUS_4_MATCH,
  BONUS_5_PLUS_MATCH,
  CASCADE_BONUS_PER_DEPTH,
} from '../constants.js';

/**
 * Calculate score for a set of match groups in a single wave.
 */
export function calculateMatchScore(matchGroups) {
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
 * Calculate cascade bonus for chain depth > 0.
 * chainDepth 0 = first wave (no bonus), 1 = first cascade, etc.
 */
export function calculateCascadeBonus(chainDepth) {
  if (chainDepth <= 0) return 0;
  return CASCADE_BONUS_PER_DEPTH * chainDepth;
}

/**
 * Check if this wave qualifies as a "big moment" for BAZINGA overlay.
 */
export function isBigMoment(matchGroups, chainDepth) {
  if (chainDepth >= 2) return true;
  for (const group of matchGroups) {
    if (group.length >= 4) return true;
  }
  return false;
}
