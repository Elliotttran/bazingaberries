import { GAME_MODES } from '../constants.js';
import './MenuScreen.css';

export default function MenuScreen({ onPlay }) {
  return (
    <div className="menu-screen">
      <div className="menu-screen__top">
        <img className="menu-screen__logo" src="/img/Logo.png" alt="Bazinga Berries" />
      </div>
      <div className="menu-screen__body">
        <div className="menu-screen__cards">
          {GAME_MODES.map(mode => (
            <button
              key={mode.id}
              className="menu-card"
              onClick={() => onPlay(mode)}
            >
              <span className="menu-card__label">{mode.label}</span>
              <span className="menu-card__desc">{mode.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="menu-screen__bottom" />
    </div>
  );
}
