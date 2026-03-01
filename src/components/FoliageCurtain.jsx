import './FoliageCurtain.css';

// state: 'closed' | 'opening' | 'closing'
export default function FoliageCurtain({ state }) {
  return (
    <div className={`foliage-curtain foliage-curtain--${state}`} aria-hidden="true">
      {/* cover2 = left, rendered behind */}
      <img src="/img/foliage/cover2.png" className="foliage-curtain__panel foliage-curtain__panel--left" draggable="false" alt="" />
      {/* cover1 = right, rendered on top */}
      <img src="/img/foliage/cover1.png" className="foliage-curtain__panel foliage-curtain__panel--right" draggable="false" alt="" />
    </div>
  );
}
