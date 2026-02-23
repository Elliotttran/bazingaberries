import tokens from '../theme/tokens.js';
import './Tile.css';

export default function Tile({ tile, isSelected, onClick }) {
  if (!tile) return <div className="tile tile--empty" />;

  const tileToken = tokens.tiles[tile.id];

  const style = {
    background: tileToken.gradient,
    boxShadow: isSelected
      ? `0 0 16px 4px ${tileToken.glowColor}, ${tileToken.shadow}`
      : tileToken.shadow,
    borderRadius: tokens.tile.borderRadius,
  };

  const className = [
    'tile',
    `tile--${tile.state}`,
    isSelected ? 'tile--selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
