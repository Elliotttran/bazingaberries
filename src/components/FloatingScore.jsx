import './FloatingScore.css';

export default function FloatingScore({ scores }) {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="floating-scores">
      {scores.map(({ id, points, multiplier }) => (
        <div key={id} className="floating-score">
          <span className="floating-score__points">+{points}</span>
          {multiplier > 1 && (
            <span className="floating-score__mult">x{multiplier.toFixed(1)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
