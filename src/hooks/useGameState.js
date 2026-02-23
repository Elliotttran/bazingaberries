import { useState, useCallback } from 'react';
import { TOTAL_MOVES } from '../constants.js';
import { createInitialBoard } from '../game/board.js';

export default function useGameState() {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(TOTAL_MOVES);
  const [selected, setSelected] = useState(null); // { row, col } or null
  const [gameOver, setGameOver] = useState(false);
  const [showBazinga, setShowBazinga] = useState(false);
  const [resolving, setResolving] = useState(false);

  const selectTile = useCallback((row, col) => {
    setSelected(prev => {
      if (prev && prev.row === row && prev.col === col) return null;
      return { row, col };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(null);
  }, []);

  const addScore = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const decrementMoves = useCallback(() => {
    setMovesLeft(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
      }
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setScore(0);
    setMovesLeft(TOTAL_MOVES);
    setSelected(null);
    setGameOver(false);
    setShowBazinga(false);
    setResolving(false);
  }, []);

  return {
    board,
    setBoard,
    score,
    movesLeft,
    selected,
    gameOver,
    showBazinga,
    setShowBazinga,
    resolving,
    setResolving,
    selectTile,
    clearSelection,
    addScore,
    decrementMoves,
    resetGame,
  };
}
