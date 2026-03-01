import { useEffect, useRef, useCallback, useState } from 'react';
import {
  SWAP_DURATION, SHAKE_DURATION, COMBO_WINDOW, SCORE_MILESTONES, DEBUG,
} from '../constants.js';
import useGameState from '../hooks/useGameState.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { attemptSwap } from '../game/swap.js';
import { cloneBoard } from '../game/helpers.js';
import { findHint } from '../game/board.js';
import SoundManager from '../sound/SoundManager.js';
// Audio state (muted, bgmOn) is managed in App and applied globally via SoundManager
import Board from './Board.jsx';
import HUD from './HUD.jsx';
import HypeOverlay from './HypeOverlay.jsx';
import FloatingScore from './FloatingScore.jsx';
import BambooFrame from './BambooFrame.jsx';
import GameOverOverlay from './GameOverOverlay.jsx';
import './GameShell.css';

export default function GameShell({ mode, onHome }) {
  const state = useGameState(mode);
  const {
    board, setBoard, score, addScore, movesLeft, decrementMoves,
    timeLeft,
    selected, selectTile, clearSelection, gameOver,
    resolving, setResolving, swappingTiles, setSwappingTiles,
    comboCount, setComboCount, hypeEvent, setHypeEvent,
    floatingScores, addFloatingScore, lastMilestone, setLastMilestone,
    resetGame,
  } = state;

  const { resolveBoard, fireHypeEvent } = useGameLoop({
    setBoard, addScore, setResolving, setHypeEvent, addFloatingScore, comboCount,
  });

  const boardRef = useRef(null);
  const audioUnlocked = useRef(false);
  const comboTimerRef = useRef(null);
  const comboActiveRef = useRef(false);
  const hintTimerRef = useRef(null);

  const [hintTiles, setHintTiles] = useState(null);

  // Check score milestones
  useEffect(() => {
    for (let i = SCORE_MILESTONES.length - 1; i >= 0; i--) {
      if (score >= SCORE_MILESTONES[i] && i > lastMilestone) {
        setLastMilestone(i);
        const milestoneValue = SCORE_MILESTONES[i];
        const text = milestoneValue >= 1000
          ? `${milestoneValue / 1000}K!`
          : `${milestoneValue}!`;
        fireHypeEvent({ type: 'MILESTONE', text, intensity: 1 });
        break;
      }
    }
  }, [score, lastMilestone, setLastMilestone, fireHypeEvent]);

  const unlockAudio = useCallback(() => {
    if (!audioUnlocked.current) {
      SoundManager.unlock();
      audioUnlocked.current = true;
    }
  }, []);

  // Start/restart the combo timer
  const startComboTimer = useCallback(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboActiveRef.current = true;
    comboTimerRef.current = setTimeout(() => {
      comboActiveRef.current = false;
      setComboCount(0);
    }, COMBO_WINDOW);
  }, [setComboCount]);

  const resetCombo = useCallback(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboActiveRef.current = false;
    setComboCount(0);
  }, [setComboCount]);

  const clearHint = useCallback(() => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setHintTiles(null);
  }, []);

  const handleHint = useCallback(() => {
    if (resolving || gameOver) return;
    const hint = findHint(board);
    if (!hint) return;
    clearHint();
    const tiles = new Set([
      `${hint.from.row},${hint.from.col}`,
      `${hint.to.row},${hint.to.col}`,
    ]);
    setHintTiles(tiles);
    hintTimerRef.current = setTimeout(() => setHintTiles(null), 3000);
  }, [board, resolving, gameOver, clearHint]);

  const handleTileClick = useCallback((row, col) => {
    unlockAudio();
    clearHint();

    if (gameOver || resolving || swappingTiles) return;
    if (!board[row][col]) return;

    if (!selected) {
      selectTile(row, col);
      SoundManager.play('select');
      return;
    }

    if (selected.row === row && selected.col === col) {
      clearSelection();
      return;
    }

    const dr = Math.abs(selected.row - row);
    const dc = Math.abs(selected.col - col);
    if (dr + dc !== 1) {
      selectTile(row, col);
      SoundManager.play('select');
      return;
    }

    // Adjacent — start swap animation
    const from = { row: selected.row, col: selected.col };
    const to = { row, col };
    clearSelection();
    setSwappingTiles({ from, to });
    SoundManager.play('swap');

    // After swap animation completes, check result
    setTimeout(() => {
      setSwappingTiles(null);
      const result = attemptSwap(board, from, to);

      if (result.success) {
        if (DEBUG) console.log('[SWAP] Success, starting resolution');
        decrementMoves();

        // Increment combo
        const newCombo = comboActiveRef.current ? comboCount + 1 : 1;
        setComboCount(newCombo);

        setBoard(result.board);
        setTimeout(() => {
          resolveBoard(result.board, newCombo, (finalCombo) => {
            setComboCount(finalCombo);
            startComboTimer();
          });
        }, 50);
      } else {
        if (DEBUG) console.log('[SWAP] Invalid, shaking');
        SoundManager.play('invalid');
        resetCombo();

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
    }, SWAP_DURATION);
  }, [
    board, selected, gameOver, resolving, swappingTiles, comboCount,
    selectTile, clearSelection, decrementMoves, setBoard, setSwappingTiles,
    setComboCount, startComboTimer, resetCombo, resolveBoard, unlockAudio, clearHint,
  ]);

  const handleRestart = useCallback(() => {
    unlockAudio();
    resetGame();
    clearHint();
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
  }, [resetGame, unlockAudio, clearHint]);

  useEffect(() => {
    if (gameOver) {
      SoundManager.play('gameover');
      resetCombo();
      clearHint();
    }
  }, [gameOver, resetCombo, clearHint]);

  const isShaking = hypeEvent && hypeEvent.intensity >= 2;

  return (
    <div className={`game-shell ${isShaking ? 'game-shell--shaking' : ''}`}>
      <div className="game-shell__top" />
      <div className="game-shell__game">
        <HUD
          score={score}
          movesLeft={movesLeft}
          timeLeft={timeLeft}
          comboCount={comboCount}
          comboActive={comboActiveRef.current && comboCount > 0}
          mode={mode}
        />
        <div className="game-shell__board-area">
          <Board
            ref={boardRef}
            board={board}
            selected={selected}
            swappingTiles={swappingTiles}
            hintTiles={hintTiles}
            onTileClick={handleTileClick}
          />
          <FloatingScore scores={floatingScores} />
          <BambooFrame boardRef={boardRef} />
          <img src="/img/drink.png"      className="deco-shrub deco-drink"        alt="" draggable="false" aria-hidden="true" />
          <img src="/img/shrub-left.png"  className="deco-shrub deco-shrub--left"  alt="" draggable="false" aria-hidden="true" />
          <img src="/img/shrub-right.png" className="deco-shrub deco-shrub--right" alt="" draggable="false" aria-hidden="true" />
          <img src="/img/Logo.png" className="deco-shrub deco-logo" alt="Bazinga Berries" draggable="false" />
        </div>
      </div>
      <div className="game-shell__bottom" />
      <div className="game-actions">
        <button className="game-action-btn" onClick={onHome} aria-label="Menu">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect y="0"    width="18" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="5.75" width="18" height="2.5" rx="1.25" fill="currentColor"/>
            <rect y="11.5" width="18" height="2.5" rx="1.25" fill="currentColor"/>
          </svg>
        </button>
        <button
          className={`game-action-btn${hintTiles ? ' game-action-btn--active' : ''}`}
          onClick={handleHint}
          aria-label="Hint"
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 0C4.13 0 1 3.13 1 7c0 2.38 1.19 4.47 3 5.74V15a1 1 0 001 1h6a1 1 0 001-1v-2.26C13.81 11.47 15 9.38 15 7c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.9"/>
            <rect x="5" y="17" width="6" height="1.5" rx="0.75" fill="currentColor" opacity="0.7"/>
            <rect x="5.5" y="15" width="5" height="1"   rx="0.5"  fill="currentColor" opacity="0.5"/>
          </svg>
        </button>
      </div>
      <HypeOverlay event={hypeEvent} />
      <GameOverOverlay visible={gameOver} score={score} onRestart={handleRestart} onHome={onHome} />
    </div>
  );
}
