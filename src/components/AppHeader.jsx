import SoundManager from '../sound/SoundManager.js';
import { useState } from 'react';
import './AppHeader.css';

export default function AppHeader() {
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    SoundManager.setMuted(next);
  };

  return (
    <header className="app-header">
      <button className="app-header__mute" onClick={toggleMute} aria-label="Toggle sound">
        {muted ? '🔇' : '🔊'}
      </button>
    </header>
  );
}
