import { useState, useCallback } from 'react';
import { TOTAL_MOVES } from '../constants.js';
import { createInitialBoard } from '../game/board.js';

export default function useGameState() {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(TOTAL_MOVES);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [swappingTiles, setSwappingTiles] = useState(null);

  // Combo system
  const [comboCount, setComboCount] = useState(0);

  // Hype overlay
  const [hypeEvent, setHypeEvent] = useState(null);

  // Floating scores
  const [floatingScores, setFloatingScores] = useState([]);

  // Last reached milestone index
  const [lastMilestone, setLastMilestone] = useState(-1);

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

  const addFloatingScore = useCallback((points, multiplier) => {
    const id = Date.now() + Math.random();
    setFloatingScores(prev => [...prev, { id, points, multiplier }]);
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(f => f.id !== id));
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setScore(0);
    setMovesLeft(TOTAL_MOVES);
    setSelected(null);
    setGameOver(false);
    setResolving(false);
    setSwappingTiles(null);
    setComboCount(0);
    setHypeEvent(null);
    setFloatingScores([]);
    setLastMilestone(-1);
  }, []);

  return {
    board, setBoard,
    score, addScore,
    movesLeft, decrementMoves,
    selected, selectTile, clearSelection,
    gameOver,
    resolving, setResolving,
    swappingTiles, setSwappingTiles,
    comboCount, setComboCount,
    hypeEvent, setHypeEvent,
    floatingScores, addFloatingScore,
    lastMilestone, setLastMilestone,
    resetGame,
  };
}
