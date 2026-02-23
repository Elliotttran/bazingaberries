import tokens from '../theme/tokens.js';
import './BazingaOverlay.css';

export default function BazingaOverlay({ visible }) {
  if (!visible) return null;

  const style = {
    color: tokens.bazinga.color,
    fontSize: tokens.bazinga.fontSize,
    fontWeight: tokens.bazinga.fontWeight,
    textShadow: tokens.bazinga.textShadow,
  };

  return (
    <div className="bazinga-overlay">
      <span className="bazinga-overlay__text" style={style}>
        BAZINGA!
      </span>
    </div>
  );
}
