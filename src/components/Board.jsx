import { BOARD_SIZE } from '../constants.js';
import tokens from '../theme/tokens.js';
import Tile from './Tile.jsx';
import './Board.css';

export default function Board({ board, selected, onTileClick }) {
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
          return (
            <Tile
              key={tile ? tile.key : `empty-${r}-${c}`}
              tile={tile}
              isSelected={isSelected}
              onClick={() => onTileClick(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
