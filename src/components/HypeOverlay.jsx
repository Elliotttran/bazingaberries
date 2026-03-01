import { useRef } from 'react';
import { createPortal } from 'react-dom';
import tokens from '../theme/tokens.js';
import assets from '../theme/assets.js';
import './HypeOverlay.css';

function pickImg(type) {
  const pool = assets.hypeImages[type];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function HypeOverlay({ event }) {
  const prevEventRef = useRef(null);
  const imgRef = useRef(null);

  // Only pick a new random image when the event actually changes —
  // re-renders from unrelated state (board, score, etc.) must NOT
  // re-roll the image or the key will change and restart the CSS animation.
  if (event !== prevEventRef.current) {
    prevEventRef.current = event;
    imgRef.current = event ? pickImg(event.type) : null;
  }

  if (!event) return null;

  const { text, intensity } = event;
  const img = imgRef.current;

  return createPortal(
    <div className={`hype-overlay hype-overlay--i${intensity}`}>
      {intensity >= 3 && <div className="hype-overlay__flash" />}
      {intensity >= 2 && <div className="hype-overlay__burst" />}
      {intensity >= 3 && <div className="hype-overlay__shower" />}
      {intensity >= 4 && <div className="hype-overlay__wash" />}
      {intensity >= 5 && <div className="hype-overlay__supernova" />}
      {img ? (
        <img
          src={img}
          alt={text}
          className={`hype-overlay__img hype-overlay__img--i${intensity}`}
        />
      ) : (
        <span
          className={`hype-overlay__text hype-overlay__text--i${intensity}`}
          style={{
            color: tokens.bazinga.color,
            fontWeight: tokens.bazinga.fontWeight,
          }}
        >
          {text}
        </span>
      )}
      {/* Future Sora video slot */}
      <div className="hype-overlay__video" />
    </div>,
    document.body
  );
}
