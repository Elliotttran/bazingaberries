import { useMemo } from 'react';
import './JuiceSplat.css';

// Particle templates — blobs have blur, droplets are sharp
const TEMPLATES = [
  { size: 8, dist: 34, blur: 5 }, // large blobs
  { size: 7, dist: 30, blur: 4 },
  { size: 9, dist: 38, blur: 5 },
  { size: 6, dist: 28, blur: 3 },
  { size: 3, dist: 48, blur: 1 }, // small sharp droplets
  { size: 2, dist: 54, blur: 0 },
  { size: 3, dist: 50, blur: 1 },
  { size: 2, dist: 46, blur: 0 },
  { size: 3, dist: 52, blur: 1 },
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

const DEG = Math.PI / 180;

export default function JuiceSplat({ color }) {
  const particles = useMemo(() => {
    const baseStep = 360 / TEMPLATES.length;
    return TEMPLATES.map((t, i) => {
      const angleDeg = baseStep * i + rand(-18, 18);
      const dist = t.dist + rand(-6, 6);
      const rad = angleDeg * DEG;
      return {
        ...t,
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        delay: rand(0, 55),
      };
    });
  }, []); // stable per mount — each pop gets its own random spread

  return (
    <div className="juice-splat" aria-hidden="true">
      <div className="juice-splat__ring" style={{ '--js-color': color }} />
      {particles.map((p, i) => (
        <div
          key={i}
          className="juice-splat__particle"
          style={{
            '--js-color': color,
            '--js-x': `${p.x}px`,
            '--js-y': `${p.y}px`,
            '--js-size': `${p.size}px`,
            '--js-blur': `${p.blur}px`,
            '--js-delay': `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
