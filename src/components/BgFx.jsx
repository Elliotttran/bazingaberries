import './BgFx.css';

// Sparkle positions in the sky area: [x%, y%, size-px, delay-s]
const SPARKLES = [
  ['22%', '5%',  1.5, 0.0],
  ['35%', '9%',  1.0, 1.3],
  ['48%', '4%',  1.5, 2.7],
  ['60%', '8%',  1.0, 0.7],
  ['74%', '6%',  1.5, 1.9],
  ['18%', '17%', 1.0, 3.1],
  ['29%', '20%', 1.5, 0.5],
  ['43%', '15%', 1.0, 2.3],
  ['55%', '22%', 1.5, 1.1],
  ['67%', '18%', 1.0, 3.4],
  ['80%', '14%', 1.5, 0.9],
  ['38%', '28%', 1.0, 2.0],
  ['50%', '31%', 1.5, 3.7],
  ['62%', '26%', 1.0, 1.5],
];

export default function BgFx() {
  return (
    <div className="bg-fx" aria-hidden="true">
      {SPARKLES.map(([x, y, r, d], i) => (
        <span
          key={i}
          className="bg-sparkle"
          style={{ left: x, top: y, width: r, height: r, animationDelay: `${d}s` }}
        />
      ))}
    </div>
  );
}
