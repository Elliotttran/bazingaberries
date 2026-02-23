import { useCallback, useRef } from 'react';
import { DEBUG, POP_DURATION, DROP_DURATION, HYPE_DISPLAY_DURATION, HYPE_THROTTLE } from '../constants.js';
import { findMatchGroups } from '../game/matching.js';
import { markPopping, clearPopping, applyGravity, refillBoard, resetStates } from '../game/resolution.js';
import { calculateWaveScore, getHypeEvent } from '../game/scoring.js';
import { hasAnyValidMoves, reshuffleBoard } from '../game/board.js';
import SoundManager from '../sound/SoundManager.js';

export default function useGameLoop({
  setBoard, addScore, setResolving, setHypeEvent, addFloatingScore, comboCount,
}) {
  const chainDepthRef = useRef(0);
  const totalWavesRef = useRef(0);
  const lastHypeTimeRef = useRef(0);
  const hypeTimeoutRef = useRef(null);

  const resolveBoard = useCallback((currentBoard, currentCombo, onComplete) => {
    setResolving(true);
    chainDepthRef.current = 0;
    totalWavesRef.current = 0;

    function resolveStep(board, runningCombo) {
      const matchGroups = findMatchGroups(board);

      if (DEBUG) {
        console.log(`[RESOLVE] chainDepth=${chainDepthRef.current}, combo=${runningCombo}, matches=${matchGroups.length}`);
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

      totalWavesRef.current++;

      // Calculate score with running combo (cascades build combo)
      const { points, multiplier } = calculateWaveScore(
        matchGroups, chainDepthRef.current, runningCombo
      );
      addScore(points);
      addFloatingScore(points, multiplier);

      if (DEBUG) {
        console.log(`[RESOLVE] points=${points}, multiplier=${multiplier}x`);
      }

      // Sound: pop once per wave
      SoundManager.play('pop');

      // Check hype event with running combo
      const hype = getHypeEvent(runningCombo, chainDepthRef.current, totalWavesRef.current);
      if (hype) {
        const now = Date.now();
        if (now - lastHypeTimeRef.current > HYPE_THROTTLE) {
          lastHypeTimeRef.current = now;
          // Clear any pending hype dismissal before setting new one
          if (hypeTimeoutRef.current) clearTimeout(hypeTimeoutRef.current);
          setHypeEvent(hype);
          SoundManager.play('bazinga');
          hypeTimeoutRef.current = setTimeout(() => {
            setHypeEvent(null);
            hypeTimeoutRef.current = null;
          }, HYPE_DISPLAY_DURATION);
        }
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
  }, [setBoard, addScore, setResolving, setHypeEvent, addFloatingScore]);

  return { resolveBoard };
}
