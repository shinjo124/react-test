import React, { useState } from 'react';
import ChessPiece from './ChessPiece';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

const THEMES = {
  emerald: {
    name: 'Emerald Green',
    light: '#ebecd0',
    dark: '#779556',
    selected: 'rgba(255, 255, 0, 0.45)',
    lastMove: 'rgba(247, 247, 105, 0.35)',
  },
  cyber: {
    name: 'Midnight Cyber',
    light: '#334155',
    dark: '#1e293b',
    selected: 'rgba(6, 182, 212, 0.45)',
    lastMove: 'rgba(56, 189, 248, 0.25)',
  },
  wood: {
    name: 'Tournament Walnut',
    light: '#f0d9b5',
    dark: '#b58863',
    selected: 'rgba(235, 175, 75, 0.5)',
    lastMove: 'rgba(215, 155, 55, 0.35)',
  },
  slate: {
    name: 'Minimal Slate',
    light: '#cbd5e1',
    dark: '#64748b',
    selected: 'rgba(99, 102, 241, 0.45)',
    lastMove: 'rgba(129, 140, 248, 0.3)',
  },
};

export default function ChessBoard({
  game,
  boardOrientation = 'w',
  boardTheme = 'emerald',
  onMakeMove,
  lastMove = null,
  isInteractive = true,
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const theme = THEMES[boardTheme] || THEMES.emerald;
  const currentTurn = game.turn();
  const inCheck = game.inCheck();

  // Find King square if in check
  let checkedKingSquare = null;
  if (inCheck) {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          const fileLetter = String.fromCharCode(97 + f);
          const rankNum = 8 - r;
          checkedKingSquare = `${fileLetter}${rankNum}`;
        }
      }
    }
  }

  const ranks = boardOrientation === 'w' ? RANKS : [...RANKS].reverse();
  const files = boardOrientation === 'w' ? FILES : [...FILES].reverse();

  // Get piece at square
  const getPieceAt = (square) => {
    try {
      return game.get(square);
    } catch (e) {
      return null;
    }
  };

  // Handle square click
  const handleSquareClick = (square) => {
    if (!isInteractive || pendingPromotion) return;

    // If already selected, clicking another legal move destination executes move
    if (selectedSquare) {
      const match = legalMoves.find((m) => m.to === square);
      if (match) {
        // Check for promotion
        const piece = getPieceAt(selectedSquare);
        const isPromotion =
          piece &&
          piece.type === 'p' &&
          ((piece.color === 'w' && square[1] === '8') ||
            (piece.color === 'b' && square[1] === '1'));

        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square });
          return;
        }

        executeMove(selectedSquare, square);
        return;
      }

      // If clicked on own piece, change selection
      const clickedPiece = getPieceAt(square);
      if (clickedPiece && clickedPiece.color === currentTurn) {
        selectSquare(square);
        return;
      }

      // Deselect
      clearSelection();
      return;
    }

    // Select piece
    const piece = getPieceAt(square);
    if (piece && piece.color === currentTurn) {
      selectSquare(square);
    }
  };

  const selectSquare = (square) => {
    setSelectedSquare(square);
    try {
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    } catch (e) {
      setLegalMoves([]);
    }
  };

  const clearSelection = () => {
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const executeMove = (from, to, promotion = 'q') => {
    clearSelection();
    setPendingPromotion(null);
    if (onMakeMove) {
      onMakeMove({ from, to, promotion });
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e, square) => {
    if (!isInteractive || pendingPromotion) {
      e.preventDefault();
      return;
    }
    const piece = getPieceAt(square);
    if (!piece || piece.color !== currentTurn) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
    selectSquare(square);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData('text/plain');
    if (!sourceSquare) return;

    const match = legalMoves.find((m) => m.to === targetSquare);
    if (match) {
      const piece = getPieceAt(sourceSquare);
      const isPromotion =
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && targetSquare[1] === '8') ||
          (piece.color === 'b' && targetSquare[1] === '1'));

      if (isPromotion) {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return;
      }

      executeMove(sourceSquare, targetSquare);
    } else {
      clearSelection();
    }
  };

  return (
    <div className="chess-board-wrapper">
      <div className="chess-board" data-theme={boardTheme}>
        {ranks.map((rank, rankIdx) => (
          <div key={rank} className="board-rank">
            {files.map((file, fileIdx) => {
              const square = `${file}${rank}`;
              const isDark = (rankIdx + fileIdx) % 2 === 1;
              const piece = getPieceAt(square);

              const isSelected = selectedSquare === square;
              const isLastMoveSquare =
                lastMove && (lastMove.from === square || lastMove.to === square);
              const legalMoveMatch = legalMoves.find((m) => m.to === square);
              const isCheckSquare = checkedKingSquare === square;

              const squareBackground = isDark ? theme.dark : theme.light;

              return (
                <div
                  key={square}
                  className={`board-square ${isDark ? 'dark' : 'light'} ${
                    isSelected ? 'selected' : ''
                  } ${isLastMoveSquare ? 'last-move' : ''} ${
                    isCheckSquare ? 'in-check' : ''
                  }`}
                  style={{
                    backgroundColor: squareBackground,
                  }}
                  onClick={() => handleSquareClick(square)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                  data-square={square}
                >
                  {/* Square coordinate tags */}
                  {fileIdx === 0 && (
                    <span className="coord-rank" style={{ color: isDark ? theme.light : theme.dark }}>
                      {rank}
                    </span>
                  )}
                  {rankIdx === 7 && (
                    <span className="coord-file" style={{ color: isDark ? theme.light : theme.dark }}>
                      {file}
                    </span>
                  )}

                  {/* Highlights */}
                  {isSelected && (
                    <div
                      className="highlight-selected"
                      style={{ backgroundColor: theme.selected }}
                    />
                  )}
                  {isLastMoveSquare && !isSelected && (
                    <div
                      className="highlight-lastmove"
                      style={{ backgroundColor: theme.lastMove }}
                    />
                  )}
                  {isCheckSquare && <div className="highlight-check" />}

                  {/* Piece */}
                  {piece && (
                    <div
                      className="piece-container"
                      draggable={isInteractive && piece.color === currentTurn}
                      onDragStart={(e) => handleDragStart(e, square)}
                    >
                      <ChessPiece type={piece.type} color={piece.color} />
                    </div>
                  )}

                  {/* Legal move targets */}
                  {legalMoveMatch && (
                    <div
                      className={`legal-hint ${
                        legalMoveMatch.captured || piece ? 'capture-hint' : 'move-hint'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Promotion Selector Modal */}
        {pendingPromotion && (
          <div className="promotion-modal-overlay">
            <div className="promotion-modal-dialog">
              <h4>Promote Pawn</h4>
              <p>Choose your new piece:</p>
              <div className="promotion-options">
                {[
                  { type: 'q', label: 'Queen' },
                  { type: 'r', label: 'Rook' },
                  { type: 'b', label: 'Bishop' },
                  { type: 'n', label: 'Knight' },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    className="promotion-btn"
                    onClick={() =>
                      executeMove(pendingPromotion.from, pendingPromotion.to, opt.type)
                    }
                  >
                    <div style={{ width: '48px', height: '48px' }}>
                      <ChessPiece type={opt.type} color={currentTurn} />
                    </div>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <button
                className="promotion-cancel-btn"
                onClick={() => setPendingPromotion(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export { THEMES };
