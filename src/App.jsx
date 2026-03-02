import { useState, useRef, useEffect, useCallback } from 'react';
import { GAME_MODES } from './constants.js';
import MenuScreen from './components/MenuScreen.jsx';
import GameShell from './components/GameShell.jsx';
import BgFx from './components/BgFx.jsx';
import FoliageCurtain from './components/FoliageCurtain.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import SoundManager from './sound/SoundManager.js';
import assets from './theme/assets.js';

// Add ?play to the URL to skip the menu during development
const DEV_SKIP = new URLSearchParams(window.location.search).has('play');

const PRELOAD_IMAGES = [
  '/img/Logo.png',
  '/img/foliage/cover1.png',
  '/img/foliage/cover2.png',
  ...Object.values(assets.hypeImages).flat(),
];

function preloadImages(paths, onProgress) {
  let loaded = 0;
  const total = paths.length;
  if (total === 0) { onProgress(1); return Promise.resolve(); }
  return Promise.all(
    paths.map(path => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => { onProgress(++loaded / total); resolve(); };
      img.src = path;
    }))
  );
}

export default function App() {
  const [screen, setScreen] = useState(DEV_SKIP ? 'game' : 'menu');
  const [activeMode, setActiveMode] = useState(GAME_MODES[0]);
  // 'closed' = panels in (menu state), 'opening' = animating out, 'closing' = animating in, 'gone' = unmounted
  const [curtain, setCurtain] = useState(DEV_SKIP ? 'gone' : 'closed');
  const [menuClass, setMenuClass] = useState('');
  const [gameClass, setGameClass] = useState('');
  const curtainTimerRef = useRef(null);

  // Loading screen state
  const [showLoader, setShowLoader] = useState(!DEV_SKIP);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Global audio state — persists across menu/game
  const [muted, setMuted] = useState(false);
  const [bgmOn, setBgmOn] = useState(true);

  useEffect(() => {
    SoundManager.preload();
    if (DEV_SKIP) SoundManager.playBgm('uke');

    if (!DEV_SKIP) {
      const minTime = new Promise(r => setTimeout(r, 900));
      Promise.all([
        preloadImages(PRELOAD_IMAGES, setLoadProgress),
        minTime,
      ]).then(() => {
        setLoaderExiting(true);
        // Unmount loader after its exit animation completes (200ms delay + 800ms fade)
        setTimeout(() => setShowLoader(false), 1020);
      });
    }

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
    SoundManager.unlock();
    if (bgmOn) SoundManager.playBgm('uke', 400);
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
    SoundManager.fadeBgm(600);
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
      {showLoader && <LoadingScreen progress={loadProgress} exiting={loaderExiting} />}

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
