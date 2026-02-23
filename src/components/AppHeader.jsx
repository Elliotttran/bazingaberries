import SoundManager from '../sound/SoundManager.js';
import { useState } from 'react';
import ComboMeter from './ComboMeter.jsx';
import './AppHeader.css';

export default function AppHeader({ comboCount, comboActive }) {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    SoundManager.setMuted(next);
  };

  return (
    <header className="app-header">
      <ComboMeter comboCount={comboCount} active={comboActive} />
      <button className="app-header__mute" onClick={toggleMute} aria-label="Toggle sound">
        {muted ? '🔇' : '🔊'}
      </button>
    </header>
  );
}
