import './GameOverOverlay.css';

export default function GameOverOverlay({ visible, score, onRestart }) {
  if (!visible) return null;

  return (
    <div className="gameover-overlay">
      <div className="gameover-overlay__card">
        <h2 className="gameover-overlay__title">Game Over</h2>
        <p className="gameover-overlay__score">
          Final Score: <strong>{score}</strong>
        </p>
        <button className="gameover-overlay__btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
