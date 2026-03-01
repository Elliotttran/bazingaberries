import { useEffect, useRef, useCallback } from 'react';
import {
  SWAP_DURATION, SHAKE_DURATION, COMBO_WINDOW, SCORE_MILESTONES,
  HYPE_DISPLAY_DURATION, DEBUG,
} from '../constants.js';
import useGameState from '../hooks/useGameState.js';
import useGameLoop from '../hooks/useGameLoop.js';
import { attemptSwap } from '../game/swap.js';
import { cloneBoard } from '../game/helpers.js';
import { getComboMultiplier } from '../game/scoring.js';
import SoundManager from '../sound/SoundManager.js';
import AppHeader from './AppHeader.jsx';
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

  const { resolveBoard } = useGameLoop({
    setBoard, addScore, setResolving, setHypeEvent, addFloatingScore, comboCount,
  });

  const boardRef = useRef(null);
  const audioUnlocked = useRef(false);
  const comboTimerRef = useRef(null);
  const comboActiveRef = useRef(false);
  const milestoneTimeoutRef = useRef(null);

  useEffect(() => {
    SoundManager.preload();
  }, []);

  // Check score milestones
  useEffect(() => {
    for (let i = SCORE_MILESTONES.length - 1; i >= 0; i--) {
      if (score >= SCORE_MILESTONES[i] && i > lastMilestone) {
        setLastMilestone(i);
        const milestoneValue = SCORE_MILESTONES[i];
        const text = milestoneValue >= 1000
          ? `${milestoneValue / 1000}K!`
          : `${milestoneValue}!`;
        setHypeEvent({ type: 'MILESTONE', text, intensity: 1 });
        if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
        milestoneTimeoutRef.current = setTimeout(() => {
          setHypeEvent(null);
          milestoneTimeoutRef.current = null;
        }, HYPE_DISPLAY_DURATION);
        break;
      }
    }
  }, [score, lastMilestone, setLastMilestone, setHypeEvent]);

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

  const handleTileClick = useCallback((row, col) => {
    unlockAudio();

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
            // Persist cascade-earned combo to state
            setComboCount(finalCombo);
            // Start combo timer AFTER resolution completes,
            // so the player gets the full window from board-stable
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
    setComboCount, startComboTimer, resetCombo, resolveBoard, unlockAudio,
  ]);

  const handleRestart = useCallback(() => {
    unlockAudio();
    resetGame();
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
  }, [resetGame, unlockAudio]);

  useEffect(() => {
    if (gameOver) {
      SoundManager.play('gameover');
      resetCombo();
    }
  }, [gameOver, resetCombo]);

  const currentMultiplier = getComboMultiplier(comboCount);
  const isShaking = hypeEvent && hypeEvent.intensity >= 2;

  return (
    <div className={`game-shell ${isShaking ? 'game-shell--shaking' : ''}`}>
      <AppHeader
        comboCount={comboCount}
        comboActive={comboActiveRef.current && comboCount > 0}
      />
      <div className="game-shell__top">
        <img className="game-shell__logo" src="/img/Logo.png" alt="Bazinga Berries" />
      </div>
      <div className="game-shell__game">
        <HUD
          score={score}
          movesLeft={movesLeft}
          timeLeft={timeLeft}
          multiplier={currentMultiplier}
          mode={mode}
        />
        <div className="game-shell__board-area">
          <Board
            ref={boardRef}
            board={board}
            selected={selected}
            swappingTiles={swappingTiles}
            onTileClick={handleTileClick}
          />
          <FloatingScore scores={floatingScores} />
          <BambooFrame boardRef={boardRef} />
          <img src="/img/drink.png"      className="deco-shrub deco-drink"        alt="" draggable="false" aria-hidden="true" />
          <img src="/img/shrub-left.png"  className="deco-shrub deco-shrub--left"  alt="" draggable="false" aria-hidden="true" />
          <img src="/img/shrub-right.png" className="deco-shrub deco-shrub--right" alt="" draggable="false" aria-hidden="true" />
        </div>
      </div>
      <div className="game-shell__bottom">
        <button className="game-shell__home-btn" onClick={onHome}>Menu</button>
      </div>
      <HypeOverlay event={hypeEvent} />
      <GameOverOverlay visible={gameOver} score={score} onRestart={handleRestart} onHome={onHome} />
    </div>
  );
}
