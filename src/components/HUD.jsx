import RolodexScore from './RolodexScore.jsx';
import DriftwoodSign from './DriftwoodSign.jsx';
import './HUD.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HUD({ score, movesLeft, timeLeft, multiplier, mode }) {
  const isTimeAttack = mode?.id === 'time-attack';
  const isEndless = mode?.id === 'endless';

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
        {!isEndless && (
          <div className="hud__moves-block">
            <span className="hud__label">{isTimeAttack ? 'Time' : 'Moves'}</span>
            <div className="hud__inset hud__moves-inset">
              {isTimeAttack
                ? <span className={`hud__moves-number${(timeLeft ?? 0) <= 30 ? ' hud__timer--urgent' : ''}`}>
                    {formatTime(timeLeft ?? 0)}
                  </span>
                : <span className="hud__moves-number">{movesLeft}</span>
              }
            </div>
          </div>
        )}
      </DriftwoodSign>
    </div>
  );
}
