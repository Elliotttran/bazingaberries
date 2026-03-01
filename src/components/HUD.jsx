import RolodexScore from './RolodexScore.jsx';
import ComboMeter from './ComboMeter.jsx';
import DriftwoodSign from './DriftwoodSign.jsx';
import './HUD.css';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function HUD({ score, movesLeft, timeLeft, comboCount, comboActive, mode }) {
  const isTimeAttack = mode?.id === 'time-attack';
  const isEndless = mode?.id === 'endless';

  return (
    <div className="hud">
      <DriftwoodSign>
        <div className="hud__block hud__block--score">
          <span className="hud__label">Score</span>
          <div className="hud__inset hud__inset--score">
            <RolodexScore value={score} color="#fff" />
          </div>
        </div>
        <div className="hud__block hud__block--combo">
          <span className="hud__label">Combo</span>
          <div className="hud__inset hud__inset--combo">
            <ComboMeter comboCount={comboCount} active={comboActive} />
          </div>
        </div>
        {!isEndless && (
          <div className="hud__block hud__block--moves">
            <span className="hud__label">{isTimeAttack ? 'Time' : 'Moves'}</span>
            <div className="hud__inset hud__inset--moves">
              {isTimeAttack
                ? <span className={`hud__number${(timeLeft ?? 0) <= 30 ? ' hud__number--urgent' : ''}`}>
                    {formatTime(timeLeft ?? 0)}
                  </span>
                : <span className="hud__number">{movesLeft}</span>
              }
            </div>
          </div>
        )}
      </DriftwoodSign>
    </div>
  );
}
