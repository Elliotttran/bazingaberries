import tokens from '../theme/tokens.js';
import './HypeOverlay.css';

export default function HypeOverlay({ event }) {
  if (!event) return null;

  const { text, intensity } = event;

  return (
    <div className={`hype-overlay hype-overlay--i${intensity}`}>
      {intensity >= 2 && <div className="hype-overlay__flash" />}
      {intensity >= 2 && <div className="hype-overlay__burst" />}
      {intensity >= 3 && <div className="hype-overlay__shower" />}
      {intensity >= 4 && <div className="hype-overlay__wash" />}
      <span
        className={`hype-overlay__text hype-overlay__text--i${intensity}`}
        style={{
          color: tokens.bazinga.color,
          fontWeight: tokens.bazinga.fontWeight,
        }}
      >
        {text}
      </span>
      {/* Future Sora video slot */}
      <div className="hype-overlay__video" />
    </div>
  );
}
