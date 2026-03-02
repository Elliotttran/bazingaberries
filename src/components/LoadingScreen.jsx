import './LoadingScreen.css';

export default function LoadingScreen({ progress, exiting }) {
  return (
    <div className={`loading-screen${exiting ? ' loading-screen--exit' : ''}`}>
      <div className="loading-screen__content">
        <img className="loading-screen__logo" src="/img/Logo.png" alt="Bazinga Berries" />
        <div className="loading-screen__bar-wrap">
          <div
            className="loading-screen__bar"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="loading-screen__dots">
          <span /><span /><span />
        </span>
      </div>
    </div>
  );
}
