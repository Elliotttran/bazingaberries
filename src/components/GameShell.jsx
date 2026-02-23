import { useEffect, useRef, useCallback } from 'react';
import { SHAKE_DURATION, DEBUG } from '../constants.js';
import useGameState from '../hooks/useGameState.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { attemptSwap } from '../game/swap.js';
import { cloneBoard } from '../game/helpers.js';
import SoundManager from '../sound/SoundManager.js';
import Board from './Board.jsx';
import HUD from './HUD.jsx';
import BazingaOverlay from './BazingaOverlay.jsx';
import GameOverOverlay from './GameOverOverlay.jsx';
import './GameShell.css';

export default function GameShell() {
  const state = useGameState();
  const {
    board, setBoard, score, movesLeft, selected, gameOver,
    showBazinga, setShowBazinga, resolving, setResolving,
    selectTile, clearSelection, addScore, decrementMoves, resetGame,
  } = state;

  const { resolveBoard } = useGameLoop({
    setBoard, addScore, setResolving, setShowBazinga, movesLeft,
  });

  const audioUnlocked = useRef(false);

  // Preload sounds on mount
  useEffect(() => {
    SoundManager.preload();
  }, []);

  const unlockAudio = useCallback(() => {
    if (!audioUnlocked.current) {
      SoundManager.unlock();
      audioUnlocked.current = true;
    }
  }, []);

  const handleTileClick = useCallback((row, col) => {
    unlockAudio();

    if (gameOver || resolving) return;
    if (!board[row][col]) return;

    if (!selected) {
      selectTile(row, col);
      SoundManager.play('select');
      return;
    }

    // Same tile — deselect
    if (selected.row === row && selected.col === col) {
      clearSelection();
      return;
    }

    // Non-adjacent — move selection
    const dr = Math.abs(selected.row - row);
    const dc = Math.abs(selected.col - col);
    if (dr + dc !== 1) {
      selectTile(row, col);
      SoundManager.play('select');
      return;
    }

    // Adjacent — attempt swap
    const from = { row: selected.row, col: selected.col };
    const to = { row, col };
    const result = attemptSwap(board, from, to);

    clearSelection();

    if (result.success) {
      if (DEBUG) console.log('[SWAP] Success, starting resolution');
      SoundManager.play('swap');
      decrementMoves();
      setBoard(result.board);
      // Start resolution after a tick so the swap renders first
      setTimeout(() => {
        resolveBoard(result.board);
      }, 50);
    } else {
      // Invalid swap — shake both tiles
      if (DEBUG) console.log('[SWAP] Invalid, shaking');
      SoundManager.play('invalid');
      const shakeBoard = cloneBoard(board);
      shakeBoard[from.row][from.col] = { ...shakeBoard[from.row][from.col], state: 'shaking' };
      shakeBoard[to.row][to.col] = { ...shakeBoard[to.row][to.col], state: 'shaking' };
      setBoard(shakeBoard);

      setTimeout(() => {
        const resetBoard = cloneBoard(shakeBoard);
        resetBoard[from.row][from.col] = { ...resetBoard[from.row][from.col], state: 'idle' };
        resetBoard[to.row][to.col] = { ...resetBoard[to.row][to.col], state: 'idle' };
        setBoard(resetBoard);
      }, SHAKE_DURATION);
    }
  }, [board, selected, gameOver, resolving, selectTile, clearSelection, decrementMoves, setBoard, resolveBoard, unlockAudio]);

  const handleRestart = useCallback(() => {
    unlockAudio();
    resetGame();
  }, [resetGame, unlockAudio]);

  // Play game over sound
  useEffect(() => {
    if (gameOver) {
      SoundManager.play('gameover');
    }
  }, [gameOver]);

  return (
    <div className="game-shell">
      <HUD score={score} movesLeft={movesLeft} />
      <Board board={board} selected={selected} onTileClick={handleTileClick} />
      <BazingaOverlay visible={showBazinga} />
      <GameOverOverlay visible={gameOver} score={score} onRestart={handleRestart} />
    </div>
  );
}
