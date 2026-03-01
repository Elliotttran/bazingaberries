import { useState } from 'react';
import { GAME_MODES } from './constants.js';
import MenuScreen from './components/MenuScreen.jsx';
import GameShell from './components/GameShell.jsx';

// Add ?play to the URL to skip the menu during development
const DEV_SKIP = new URLSearchParams(window.location.search).has('play');

export default function App() {
  const [screen, setScreen] = useState(DEV_SKIP ? 'game' : 'menu');
  const [activeMode, setActiveMode] = useState(GAME_MODES[0]);

  const handlePlay = (mode) => {
    setActiveMode(mode);
    setScreen('game');
  };

  const handleHome = () => setScreen('menu');

  if (screen === 'menu') {
    return <MenuScreen onPlay={handlePlay} />;
  }

  // key={activeMode.id} ensures a clean remount when switching modes
  return <GameShell key={activeMode.id} mode={activeMode} onHome={handleHome} />;
}
