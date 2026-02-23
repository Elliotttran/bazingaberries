import './RolodexScore.css';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const PAD_LENGTH = 6;

export default function RolodexScore({ value, color }) {
  const str = String(Math.max(0, value)).padStart(PAD_LENGTH, '0');
  const digits = str.split('');

  return (
    <div className="rolodex" style={{ color }}>
      {digits.map((d, i) => {
        const isLeadingZero = i < PAD_LENGTH - String(value).length;
        return (
          <div
            key={i}
            className={`rolodex__window ${isLeadingZero ? 'rolodex__window--dim' : ''}`}
          >
            <div
              className="rolodex__strip"
              style={{ transform: `translateY(-${Number(d) * 10}%)` }}
            >
              {DIGITS.map(n => (
                <div key={n} className="rolodex__digit">{n}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
