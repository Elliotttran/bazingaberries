import { BOARD_SIZE, TILE_COUNT } from '../constants.js';

let tileKeyCounter = 0;

export function generateTileKey() {
  return `tile_${tileKeyCounter++}`;
}

export function resetTileKeyCounter() {
  tileKeyCounter = 0;
}

export function randomTileType() {
  return Math.floor(Math.random() * TILE_COUNT);
}

export function createTile(id) {
  return { id, key: generateTileKey(), state: 'idle' };
}

export function cloneBoard(board) {
  return board.map(row => row.map(tile => (tile ? { ...tile } : null)));
}

export function isInBounds(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function isAdjacent(r1, c1, r2, c2) {
  return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}
