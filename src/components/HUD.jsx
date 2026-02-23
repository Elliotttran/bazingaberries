import tokens from '../theme/tokens.js';
import SoundManager from '../sound/SoundManager.js';
import { useState } from 'react';
import './HUD.css';

export default function HUD({ score, movesLeft }) {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    SoundManager.setMuted(next);
  };

  return (
    <div className="hud">
      <div className="hud__stat">
        <span className="hud__label">Score</span>
        <span className="hud__value" style={{ color: tokens.hud.scoreColor }}>
          {score}
        </span>
      </div>
      <div className="hud__title">Bazinga Berries</div>
      <div className="hud__right">
        <div className="hud__stat">
          <span className="hud__label">Moves</span>
          <span className="hud__value" style={{ color: tokens.hud.movesColor }}>
            {movesLeft}
          </span>
        </div>
        <button className="hud__mute" onClick={toggleMute} aria-label="Toggle sound">
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
}
