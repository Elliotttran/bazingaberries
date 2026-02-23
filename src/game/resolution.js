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
 * Tiles that move get state 'dropping' with dropDistance tracking how far they fell.
 */
export function applyGravity(board) {
  const newBoard = cloneBoard(board);

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Collect non-null tiles from bottom to top, remembering original rows
    const column = [];
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c]) {
        column.push({ tile: newBoard[r][c], originalRow: r });
      }
    }

    // Place them back from bottom
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      const idx = BOARD_SIZE - 1 - r;
      if (idx < column.length) {
        const { tile, originalRow } = column[idx];
        const distance = r - originalRow;
        if (distance > 0) {
          newBoard[r][c] = { ...tile, state: 'dropping', dropDistance: distance };
        } else {
          newBoard[r][c] = { ...tile };
        }
      } else {
        newBoard[r][c] = null;
      }
    }
  }

  return newBoard;
}

/**
 * Fill null spaces (top of columns) with new tiles.
 * New tiles get state 'entering' with dropDistance = row + 1 (fall from above board).
 */
export function refillBoard(board) {
  const newBoard = cloneBoard(board);

  for (let c = 0; c < BOARD_SIZE; c++) {
    // Count nulls in this column to stagger entry distances
    let nullCount = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (!newBoard[r][c]) nullCount++;
    }

    let entryIndex = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (!newBoard[r][c]) {
        newBoard[r][c] = {
          ...createTile(randomTileType()),
          state: 'entering',
          dropDistance: nullCount - entryIndex,
        };
        entryIndex++;
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
