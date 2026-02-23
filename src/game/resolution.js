import { BOARD_SIZE } from '../constants.js';
import { cloneBoard, createTile, randomTileType } from './helpers.js';

/**
 * Mark matched tiles as 'popping'.
 */
export function markPopping(board, matchGroups) {
  const newBoard = cloneBoard(board);
  const seen = new Set();

  for (const group of matchGroups) {
    for (const { row, col } of group) {
      const key = `${row},${col}`;
      if (!seen.has(key)) {
        seen.add(key);
        newBoard[row][col] = { ...newBoard[row][col], state: 'popping' };
      }
    }
  }

  return newBoard;
}

/**
 * Clear all tiles that are in 'popping' state (set to null).
 */
export function clearPopping(board) {
  const newBoard = cloneBoard(board);

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (newBoard[r][c] && newBoard[r][c].state === 'popping') {
        newBoard[r][c] = null;
      }
    }
  }

  return newBoard;
}

/**
 * Apply gravity: shift tiles down into null spaces.
 * Tiles that move get state 'dropping'.
 */
export function applyGravity(board) {
  const newBoard = cloneBoard(board);

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Collect non-null tiles from bottom to top
    const column = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c]) {
        column.push(newBoard[r][c]);
      }
    }

    // Place them back from bottom, mark moved tiles as 'dropping'
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      const idx = BOARD_SIZE - 1 - r;
      if (idx < column.length) {
        const tile = column[idx];
        const originalRow = BOARD_SIZE - 1 - idx;
        if (originalRow !== r || tile.state === 'idle') {
          // Tile moved or stayed — only mark as dropping if it moved
        }
        newBoard[r][c] = { ...tile, state: originalRow !== r ? 'dropping' : tile.state };
      } else {
        newBoard[r][c] = null;
      }
    }
  }

  return newBoard;
}

/**
 * Fill null spaces (top of columns) with new tiles.
 * New tiles get state 'entering'.
 */
export function refillBoard(board) {
  const newBoard = cloneBoard(board);

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!newBoard[r][c]) {
        newBoard[r][c] = { ...createTile(randomTileType()), state: 'entering' };
      }
    }
  }

  return newBoard;
}

/**
 * Reset all tile states to 'idle'.
 */
export function resetStates(board) {
  const newBoard = cloneBoard(board);

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (newBoard[r][c]) {
        newBoard[r][c] = { ...newBoard[r][c], state: 'idle' };
      }
    }
  }

  return newBoard;
}
