import { useCallback, useRef } from 'react';
import { DEBUG, POP_DURATION, DROP_DURATION, BAZINGA_DISPLAY_DURATION, BAZINGA_THROTTLE } from '../constants.js';
import { findMatchGroups } from '../game/matching.js';
import { markPopping, clearPopping, applyGravity, refillBoard, resetStates } from '../game/resolution.js';
import { calculateMatchScore, calculateCascadeBonus, isBigMoment } from '../game/scoring.js';
import { hasAnyValidMoves, reshuffleBoard } from '../game/board.js';
import SoundManager from '../sound/SoundManager.js';

export default function useGameLoop({ setBoard, addScore, setResolving, setShowBazinga, movesLeft }) {
  const chainDepthRef = useRef(0);

  const resolveBoard = useCallback((currentBoard) => {
    setResolving(true);
    chainDepthRef.current = 0;

    function resolveStep(board) {
      const matchGroups = findMatchGroups(board);

      if (DEBUG) {
        console.log(`[RESOLVE] chainDepth=${chainDepthRef.current}, matches=${matchGroups.length}`);
      }

      if (matchGroups.length === 0) {
        // Stable — check for valid moves
        const stableBoard = resetStates(board);
        if (!hasAnyValidMoves(stableBoard)) {
          if (DEBUG) console.log('[STABLE] No valid moves, reshuffling');
          const reshuffled = reshuffleBoard(stableBoard);
          setBoard(reshuffled);
        } else {
          setBoard(stableBoard);
        }
        setResolving(false);
        return;
      }

      // Calculate score
      const waveScore = calculateMatchScore(matchGroups);
      const cascadeBonus = calculateCascadeBonus(chainDepthRef.current);
      addScore(waveScore + cascadeBonus);

      if (DEBUG) {
        console.log(`[RESOLVE] waveScore=${waveScore}, cascadeBonus=${cascadeBonus}`);
      }

      // Sound: pop once per wave
      SoundManager.play('pop');

      // Check big moment
      if (isBigMoment(matchGroups, chainDepthRef.current)) {
        setShowBazinga(true);
        SoundManager.playThrottled('bazinga', BAZINGA_THROTTLE);
        setTimeout(() => setShowBazinga(false), BAZINGA_DISPLAY_DURATION);
      }

      chainDepthRef.current++;

      // Mark popping
      const poppingBoard = markPopping(board, matchGroups);
      setBoard(poppingBoard);

      // Wait for pop animation, then clear + gravity + refill
      setTimeout(() => {
        const cleared = clearPopping(poppingBoard);
        const gravityApplied = applyGravity(cleared);
        const refilled = refillBoard(gravityApplied);
        setBoard(refilled);

        // Wait for drop animation, then check for new matches
        setTimeout(() => {
          resolveStep(refilled);
        }, DROP_DURATION);
      }, POP_DURATION);
    }

    resolveStep(currentBoard);
  }, [setBoard, addScore, setResolving, setShowBazinga]);

  return { resolveBoard };
}
