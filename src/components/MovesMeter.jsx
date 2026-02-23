import { TOTAL_MOVES } from '../constants.js';
import './MovesMeter.css';

export default function MovesMeter({ movesLeft }) {
  const pct = (movesLeft / TOTAL_MOVES) * 100;
  const low = pct <= 20;

  return (
    <div className={`moves-meter ${low ? 'moves-meter--low' : ''}`}>
      <div className="moves-meter__track">
        <div
          className="moves-meter__fill"
          style={{ width: `${pct}%` }}
        />
        <div className="moves-meter__glow" style={{ width: `${pct}%` }} />
        <span className="moves-meter__label">{movesLeft} moves</span>
      </div>
    </div>
  );
}
