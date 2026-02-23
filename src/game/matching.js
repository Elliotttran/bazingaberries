import { BOARD_SIZE } from '../constants.js';

/**
 * Scans the board and returns an array of match groups.
 * Each group is an array of { row, col } with length >= 3.
 */
export function findMatchGroups(board) {
  const matched = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(false)
  );
  const groups = [];

  // Horizontal scan
  for (let r = 0; r < BOARD_SIZE; r++) {
    let c = 0;
    while (c < BOARD_SIZE) {
      const tile = board[r][c];
      if (!tile) { c++; continue; }
      let end = c + 1;
      while (end < BOARD_SIZE && board[r][end] && board[r][end].id === tile.id) {
        end++;
      }
      if (end - c >= 3) {
        const group = [];
        for (let i = c; i < end; i++) {
          group.push({ row: r, col: i });
          matched[r][i] = true;
        }
        groups.push(group);
      }
      c = end;
    }
  }

  // Vertical scan
  for (let c = 0; c < BOARD_SIZE; c++) {
    let r = 0;
    while (r < BOARD_SIZE) {
      const tile = board[r][c];
      if (!tile) { r++; continue; }
      let end = r + 1;
      while (end < BOARD_SIZE && board[end][c] && board[end][c].id === tile.id) {
        end++;
      }
      if (end - r >= 3) {
        const group = [];
        for (let i = r; i < end; i++) {
          group.push({ row: i, col: c });
          matched[i][c] = true;
        }
        groups.push(group);
      }
      r = end;
    }
  }

  return groups;
}

/**
 * Quick check: does the board have any matches right now?
 */
export function hasAnyMatches(board) {
  return findMatchGroups(board).length > 0;
}
