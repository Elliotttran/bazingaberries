import RolodexScore from './RolodexScore.jsx';
import DriftwoodSign from './DriftwoodSign.jsx';
import './HUD.css';

export default function HUD({ score, movesLeft, multiplier }) {
  return (
    <div className="hud">
      <DriftwoodSign>
        <div className="hud__score-block">
          <span className="hud__label">Score</span>
          <div className="hud__inset hud__score-inset">
            <div className="hud__score-value">
              <RolodexScore value={score} color="#fff" />
              {multiplier > 1 && (
                <div className="hud__multiplier" key={multiplier}>
                  x{multiplier.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="hud__moves-block">
          <span className="hud__label">Moves</span>
          <div className="hud__inset hud__moves-inset">
            <span className="hud__moves-number">{movesLeft}</span>
          </div>
        </div>
      </DriftwoodSign>
    </div>
  );
}
