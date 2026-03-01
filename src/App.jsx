import { useState, useRef, useEffect, useCallback } from 'react';
import { GAME_MODES } from './constants.js';
import MenuScreen from './components/MenuScreen.jsx';
import GameShell from './components/GameShell.jsx';
import BgFx from './components/BgFx.jsx';
import FoliageCurtain from './components/FoliageCurtain.jsx';
import SoundManager from './sound/SoundManager.js';

// Add ?play to the URL to skip the menu during development
const DEV_SKIP = new URLSearchParams(window.location.search).has('play');

export default function App() {
  const [screen, setScreen] = useState(DEV_SKIP ? 'game' : 'menu');
  const [activeMode, setActiveMode] = useState(GAME_MODES[0]);
  // 'closed' = panels in (menu state), 'opening' = animating out, 'closing' = animating in, 'gone' = unmounted
  const [curtain, setCurtain] = useState(DEV_SKIP ? 'gone' : 'closed');
  const [menuClass, setMenuClass] = useState(DEV_SKIP ? '' : 'screen-enter');
  const [gameClass, setGameClass] = useState('');
  const curtainTimerRef = useRef(null);

  // Global audio state — persists across menu/game
  const [muted, setMuted] = useState(false);
  const [bgmOn, setBgmOn] = useState(true);

  useEffect(() => {
    SoundManager.preload();
    SoundManager.playBgm('uke');
    return () => SoundManager.stopBgm();
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    SoundManager.setMuted(next);
  }, [muted]);

  const toggleBgm = useCallback(() => {
    const next = !bgmOn;
    setBgmOn(next);
    if (next) SoundManager.playBgm('uke');
    else SoundManager.stopBgm();
  }, [bgmOn]);

  const handlePlay = (mode) => {
    setActiveMode(mode);
    setMenuClass('screen-exit');
    if (curtainTimerRef.current) clearTimeout(curtainTimerRef.current);

    // Wait for menu to fade out, then open curtain + bring in game
    curtainTimerRef.current = setTimeout(() => {
      setScreen('game');
      setGameClass('screen-enter');
      setCurtain('opening');

      curtainTimerRef.current = setTimeout(() => {
        setCurtain('gone');
      }, 900);
    }, 200);
  };

  const handleHome = () => {
    if (curtainTimerRef.current) clearTimeout(curtainTimerRef.current);
    // Game fades out + foliage sweeps back in simultaneously
    setGameClass('screen-exit');
    setCurtain('closing');

    // After curtain animation completes, swap to menu and fade it in
    curtainTimerRef.current = setTimeout(() => {
      setScreen('menu');
      setCurtain('closed');
      setMenuClass('screen-enter');
    }, 440);
  };

  return (
    <>
      <BgFx />
      {screen === 'menu'
        ? <div className={`screen-wrapper ${menuClass}`}><MenuScreen onPlay={handlePlay} /></div>
        : <div className={`screen-wrapper ${gameClass}`}><GameShell key={activeMode.id} mode={activeMode} onHome={handleHome} /></div>}
      {curtain !== 'gone' && <FoliageCurtain state={curtain} />}

      {/* Global audio controls — visible on all screens */}
      <div className="global-actions">
        <button
          className={`game-action-btn${!bgmOn ? ' game-action-btn--muted' : ''}`}
          onClick={toggleBgm}
          aria-label="Toggle music"
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M6 14V3l8-2v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="4" cy="14" r="2.5" fill="currentColor" opacity="0.9"/>
            <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.9"/>
          </svg>
        </button>
        <button
          className={`game-action-btn${muted ? ' game-action-btn--muted' : ''}`}
          onClick={toggleMute}
          aria-label="Toggle sound"
        >
          {muted
            ? <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M2 5H5L9 1v14l-4-4H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor" opacity="0.9"/>
                <line x1="12" y1="4" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            : <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M2 5H5L9 1v14l-4-4H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor" opacity="0.9"/>
                <path d="M12 4c1.5 1 2.5 2.8 2.5 4s-1 3-2.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M14.5 1.5c2.5 1.8 4 4.3 4 6.5s-1.5 4.7-4 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
          }
        </button>
      </div>
    </>
  );
}
