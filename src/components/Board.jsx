import { BOARD_SIZE } from '../constants.js';
import tokens from '../theme/tokens.js';
import Tile from './Tile.jsx';
import './Board.css';

export default function Board({ board, selected, swappingTiles, onTileClick }) {
  const boardStyle = {
    background: tokens.board.background,
    padding: tokens.board.padding,
    borderRadius: tokens.board.borderRadius,
    boxShadow: tokens.board.boxShadow,
    gap: tokens.board.gap,
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
  };

  return (
    <div className="board" style={boardStyle}>
      {board.map((row, r) =>
        row.map((tile, c) => {
          const isSelected = selected && selected.row === r && selected.col === c;

          // Calculate swap offset if this tile is part of an active swap
          let swapOffset = null;
          if (swappingTiles) {
            const { from, to } = swappingTiles;
            if (r === from.row && c === from.col) {
              swapOffset = { x: to.col - from.col, y: to.row - from.row };
            } else if (r === to.row && c === to.col) {
              swapOffset = { x: from.col - to.col, y: from.row - to.row };
            }
          }

          return (
            <Tile
              key={tile ? tile.key : `empty-${r}-${c}`}
              tile={tile}
              isSelected={isSelected}
              swapOffset={swapOffset}
              onClick={() => onTileClick(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
