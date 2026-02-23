import { useEffect, useState } from 'react';
import { COMBO_WINDOW } from '../constants.js';
import './ComboMeter.css';

export default function ComboMeter({ comboCount, active }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (!active || comboCount === 0) {
      setProgress(1);
      return;
    }

    // Animate the ring depleting over COMBO_WINDOW ms
    setProgress(1);
    const start = Date.now();
    let raf;

    function tick() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / COMBO_WINDOW);
      setProgress(remaining);
      if (remaining > 0) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, comboCount]);

  if (!active || comboCount === 0) return null;

  const urgent = progress < 0.25;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference * (1 - progress);

  return (
    <div className={`combo-meter ${urgent ? 'combo-meter--urgent' : ''}`}>
      <svg className="combo-meter__ring" viewBox="0 0 40 40">
        <circle
          className="combo-meter__track"
          cx="20" cy="20" r="18"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"
        />
        <circle
          className="combo-meter__fill"
          cx="20" cy="20" r="18"
          fill="none"
          stroke={comboCount >= 4 ? '#fd79a8' : comboCount >= 3 ? '#ffeaa7' : '#74b9ff'}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <span className="combo-meter__count">{comboCount}x</span>
    </div>
  );
}
