import { cloneBoard, isAdjacent } from './helpers.js';
import { findMatchGroups } from './matching.js';

/**
 * Attempt a swap between two tiles.
 * Returns { success, board, matchGroups }
 *
 * Always performs the swap visually first (Bejeweled rule),
 * then checks for matches. If no match, caller handles swap-back.
 */
export function attemptSwap(board, from, to) {
  if (!isAdjacent(from.row, from.col, to.row, to.col)) {
    return { success: false, board, matchGroups: [] };
  }

  const newBoard = cloneBoard(board);
  const tileA = newBoard[from.row][from.col];
  const tileB = newBoard[to.row][to.col];

  // Perform swap
  newBoard[from.row][from.col] = tileB;
  newBoard[to.row][to.col] = tileA;

  const matchGroups = findMatchGroups(newBoard);

  if (matchGroups.length === 0) {
    return { success: false, board, matchGroups: [] };
  }

  return { success: true, board: newBoard, matchGroups };
}
