import tokens from '../theme/tokens.js';
import './Tile.css';

export default function Tile({ tile, isSelected, swapOffset, onClick }) {
  if (!tile) return <div className="tile tile--empty" />;

  const tileToken = tokens.tiles[tile.id];

  const style = {
    '--tile-color': tileToken.glowColor,
    '--drop-distance': tile.dropDistance || 0,
    '--idle-delay': `${-((tile.key * 2654435761 >>> 0) % 7000)}ms`,
    '--idle-dur': `${6500 + ((tile.key * 1597334677 >>> 0) % 2000)}ms`,
  };

  if (isSelected) {
    style.filter = `drop-shadow(0 0 8px ${tileToken.glowColor})`;
  }

  if (swapOffset) {
    style['--swap-x'] = swapOffset.x;
    style['--swap-y'] = swapOffset.y;
  }

  const className = [
    'tile',
    `tile--${tile.state}`,
    isSelected ? 'tile--selected' : '',
    swapOffset ? 'tile--swapping' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={className} style={style} onClick={onClick}>
      <img className="tile__img" src={tileToken.image} alt="" draggable="false" />
    </div>
  );
}
