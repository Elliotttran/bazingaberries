import { useCallback, useRef } from 'react';
import { DEBUG, POP_DURATION, DROP_DURATION } from '../constants.js';
import { findMatchGroups } from '../game/matching.js';
import { markPopping, clearPopping, applyGravity, refillBoard, resetStates } from '../game/resolution.js';
import { calculateWaveScore, getHypeEvent } from '../game/scoring.js';
import { hasAnyValidMoves, reshuffleBoard } from '../game/board.js';
import SoundManager from '../sound/SoundManager.js';

// Hard lock — nothing else can fire until this expires. No exceptions.
const HYPE_LOCK_MS = 1500;

export default function useGameLoop({
  setBoard, addScore, setResolving, setHypeEvent, addFloatingScore, comboCount,
}) {
  const chainDepthRef = useRef(0);
  const hypeTimeoutRef = useRef(null);
  const hypeActiveRef = useRef(false);
  const hypeShownThisMoveRef = useRef(false);
  const streakRef = useRef(1);
  const dubbaRef = useRef(false);

  // Central dispatcher — hard gate, one event at a time, no overrides
  const fireHypeEvent = useCallback((hype) => {
    if (hypeActiveRef.current) return;
    hypeActiveRef.current = true;
    if (hypeTimeoutRef.current) clearTimeout(hypeTimeoutRef.current);
    setHypeEvent(hype);
    SoundManager.play('bazinga');
    hypeTimeoutRef.current = setTimeout(() => {
      setHypeEvent(null);
      hypeTimeoutRef.current = null;
      hypeActiveRef.current = false;
    }, HYPE_LOCK_MS);
  }, [setHypeEvent]);

  const resolveBoard = useCallback((currentBoard, currentCombo, onComplete) => {
    setResolving(true);
    chainDepthRef.current = 0;
    streakRef.current = currentCombo || 1;
    dubbaRef.current = false;
    hypeShownThisMoveRef.current = false;

    function resolveStep(board, runningCombo) {
      const matchGroups = findMatchGroups(board);

      if (DEBUG) {
        console.log(`[RESOLVE] chainDepth=${chainDepthRef.current}, streak=${streakRef.current}, dubba=${dubbaRef.current}, matches=${matchGroups.length}`);
      }

      if (matchGroups.length === 0) {
        const stableBoard = resetStates(board);
        if (!hasAnyValidMoves(stableBoard)) {
          if (DEBUG) console.log('[STABLE] No valid moves, reshuffling');
          const reshuffled = reshuffleBoard(stableBoard);
          setBoard(reshuffled);
        } else {
          setBoard(stableBoard);
        }
        setResolving(false);
        if (onComplete) onComplete(runningCombo);
        return;
      }

      // Detect Double Doocer on the first wave
      if (chainDepthRef.current === 0 && matchGroups.length >= 2) {
        dubbaRef.current = true;
      }

      // Calculate score with running combo (cascades build combo)
      const { points, multiplier } = calculateWaveScore(
        matchGroups, chainDepthRef.current, runningCombo
      );
      addScore(points);
      addFloatingScore(points, multiplier);

      if (DEBUG) {
        console.log(`[RESOLVE] points=${points}, multiplier=${multiplier}x`);
      }

      // Sound: pop + pitched clar1 per wave (2 semitones up per combo step)
      SoundManager.play('pop');
      // const pitch = Math.pow(2, Math.min((runningCombo - 1) * 4, 28) / 12); // 8 stages
      const pitch = Math.pow(2, Math.min((runningCombo - 1) * 4, 16) / 12); // 5 stages
      SoundManager.playWithPitch('collect', pitch);

      // Check hype — only the first qualifying wave per player move fires anything
      const groupSizes = matchGroups.map(g => g.length);
      const hype = getHypeEvent(
        streakRef.current,
        chainDepthRef.current,
        matchGroups.length,
        dubbaRef.current,
        groupSizes,
      );
      if (hype && !hypeShownThisMoveRef.current) {
        hypeShownThisMoveRef.current = true; // lock out every later wave this move
        fireHypeEvent(hype);
      }

      chainDepthRef.current++;

      const poppingBoard = markPopping(board, matchGroups);
      setBoard(poppingBoard);

      setTimeout(() => {
        const cleared = clearPopping(poppingBoard);
        const gravityApplied = applyGravity(cleared);
        const refilled = refillBoard(gravityApplied);
        setBoard(refilled);

        setTimeout(() => {
          // Each cascade wave increments the running combo
          resolveStep(refilled, runningCombo + 1);
        }, DROP_DURATION);
      }, POP_DURATION);
    }

    resolveStep(currentBoard, currentCombo || 1);
  }, [setBoard, addScore, setResolving, fireHypeEvent, addFloatingScore]);

  return { resolveBoard, fireHypeEvent };
}
