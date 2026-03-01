import { useState, useCallback, useEffect, useRef } from 'react';
import { TOTAL_MOVES } from '../constants.js';
import { createInitialBoard } from '../game/board.js';

const DEFAULT_MODE = { id: 'standard', moves: TOTAL_MOVES, timeLimit: null };

export default function useGameState(mode = DEFAULT_MODE) {
  const [board, setBoard] = useState(() => createInitialBoard());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(mode.moves ?? null);
  const [timeLeft, setTimeLeft] = useState(mode.timeLimit ?? null);
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

  const timerRef = useRef(null);

  // Countdown timer for time attack mode
  useEffect(() => {
    if (!mode.timeLimit || gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          setGameOver(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [mode.timeLimit, gameOver]);

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
    if (mode.moves === null) return; // no move limit for this mode
    setMovesLeft(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
      }
      return next;
    });
  }, [mode.moves]);

  const addFloatingScore = useCallback((points, multiplier) => {
    const id = Date.now() + Math.random();
    setFloatingScores(prev => [...prev, { id, points, multiplier }]);
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(f => f.id !== id));
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    setBoard(createInitialBoard());
    setScore(0);
    setMovesLeft(mode.moves ?? null);
    setTimeLeft(mode.timeLimit ?? null);
    setSelected(null);
    setGameOver(false);
    setResolving(false);
    setSwappingTiles(null);
    setComboCount(0);
    setHypeEvent(null);
    setFloatingScores([]);
    setLastMilestone(-1);
  }, [mode.moves, mode.timeLimit]);

  return {
    board, setBoard,
    score, addScore,
    movesLeft, decrementMoves,
    timeLeft,
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
