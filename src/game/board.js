import { BOARD_SIZE } from '../constants.js';
import { createTile, randomTileType, cloneBoard, resetTileKeyCounter } from './helpers.js';
import { hasAnyMatches, findMatchGroups } from './matching.js';

/**
 * Create an 8x8 board with no initial matches.
 * Uses column-by-column, row-by-row placement to avoid matches.
 */
export function createInitialBoard() {
  resetTileKeyCounter();

  for (let attempt = 0; attempt < 100; attempt++) {
    const board = buildMatchFreeBoard();
    if (board && hasAnyValidMoves(board)) {
      return board;
    }
  }

  // Fallback: just generate and accept (extremely unlikely to reach here)
  return buildMatchFreeBoard() || buildRandomBoard();
}

function buildMatchFreeBoard() {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const excluded = new Set();

      // Check left 2
      if (c >= 2 && board[r][c - 1] && board[r][c - 2] &&
          board[r][c - 1].id === board[r][c - 2].id) {
        excluded.add(board[r][c - 1].id);
      }

      // Check up 2
      if (r >= 2 && board[r - 1][c] && board[r - 2][c] &&
          board[r - 1][c].id === board[r - 2][c].id) {
        excluded.add(board[r - 1][c].id);
      }

      let id;
      let tries = 0;
      do {
        id = randomTileType();
        tries++;
      } while (excluded.has(id) && tries < 50);

      board[r][c] = createTile(id);
    }
  }

  return board;
}

function buildRandomBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => createTile(randomTileType()))
  );
}

/**
 * Check if any valid swap exists that produces a match.
 */
export function hasAnyValidMoves(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      // Try swap right
      if (c + 1 < BOARD_SIZE) {
        const test = cloneBoard(board);
        const tmp = test[r][c];
        test[r][c] = test[r][c + 1];
        test[r][c + 1] = tmp;
        if (hasAnyMatches(test)) return true;
      }
      // Try swap down
      if (r + 1 < BOARD_SIZE) {
        const test = cloneBoard(board);
        const tmp = test[r][c];
        test[r][c] = test[r + 1][c];
        test[r + 1][c] = tmp;
        if (hasAnyMatches(test)) return true;
      }
    }
  }
  return false;
}

/**
 * Reshuffle the board while keeping the same tile types, ensuring no matches
 * and at least one valid move.
 */
export function reshuffleBoard(board) {
  const types = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) types.push(board[r][c].id);
    }
  }

  for (let attempt = 0; attempt < 100; attempt++) {
    // Fisher-Yates shuffle
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    let idx = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        newBoard[r][c] = createTile(types[idx++]);
      }
    }

    if (!hasAnyMatches(newBoard) && hasAnyValidMoves(newBoard)) {
      return newBoard;
    }
  }

  // Fallback
  return createInitialBoard();
}
