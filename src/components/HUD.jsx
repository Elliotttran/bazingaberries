import tokens from '../theme/tokens.js';
import RolodexScore from './RolodexScore.jsx';
import MovesMeter from './MovesMeter.jsx';
import './HUD.css';

export default function HUD({ score, movesLeft, multiplier }) {
  return (
    <div className="hud">
      <div className="hud__score-block">
        <span className="hud__label">Score</span>
        <div className="hud__score-value">
          <RolodexScore value={score} color={tokens.hud.scoreColor} />
          {multiplier > 1 && (
            <div className="hud__multiplier" key={multiplier}>
              x{multiplier.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <MovesMeter movesLeft={movesLeft} />
    </div>
  );
}
