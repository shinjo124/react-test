import React from 'react';

/**
 * High-definition vector SVG Chess Pieces
 * Supports standard chess piece types: 'p', 'n', 'b', 'r', 'q', 'k'
 * and colors: 'w' (White), 'b' (Black)
 */
export default function ChessPiece({ type, color, size = '100%', className = '' }) {
  if (!type || !color) return null;

  const isWhite = color === 'w';
  const fill = isWhite ? '#FFFFFF' : '#171717';
  const stroke = isWhite ? '#262626' : '#FAFAFA';
  const accent = isWhite ? '#E5E7EB' : '#404040';

  const renderPieceSvg = () => {
    switch (type.toLowerCase()) {
      case 'p': // PAWN
        return (
          <g>
            <path
              d="M22.5 9 C20 9 18 11 18 13.5 C18 14.8 18.6 16 19.5 16.8 C17.5 18 16 20 16 24 C16 27 18 29 18 29 L27 29 C27 29 29 27 29 24 C29 20 27.5 18 25.5 16.8 C26.4 16 27 14.8 27 13.5 C27 11 25 9 22.5 9 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 36 C13 33 16 31 22.5 31 C29 31 32 33 32 36 L13 36 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M10 40 L35 40 C35 40 36 38 34 37 L11 37 C9 38 10 40 10 40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            {!isWhite && (
              <path
                d="M18 13.5 C18 11 20 9 22.5 9 C25 9 27 11 27 13.5 C27 14.5 26.5 15.5 25.8 16.2 C24.8 15.5 23.7 15 22.5 15 C21.3 15 20.2 15.5 19.2 16.2 C18.5 15.5 18 14.5 18 13.5 Z"
                fill={accent}
              />
            )}
          </g>
        );

      case 'n': // KNIGHT
        return (
          <g>
            <path
              d="M22 10 C32.5 11 38.5 18 38 39 L15 39 C15 30 13 27 10 24 C11 19 14 15 17 14 C17 11.5 19 10 22 10 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M24 18 C24 16.5 22.5 15 21 15 C19.5 15 18 16.5 18 18 C18 19.5 19.5 21 21 21 C22.5 21 24 19.5 24 18 Z"
              fill={isWhite ? '#171717' : '#FFFFFF'}
            />
            <path
              d="M11 28.5 C16 26.5 21 27.5 25 32"
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 40 L35 40 C35 40 36 38 34 37 L11 37 C9 38 10 40 10 40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'b': // BISHOP
        return (
          <g>
            <path
              d="M9 36 C12.5 35 15 34 18 34 L27 34 C30 34 32.5 35 36 36 L9 36 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M15 34 C12 28 12 22 15 17 C17.5 13 22.5 11 22.5 11 C22.5 11 27.5 13 30 17 C33 22 33 28 30 34 L15 34 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="22.5" cy="8.5" r="2.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <path
              d="M19 18 L26 25 M26 18 L19 25"
              fill="none"
              stroke={isWhite ? '#404040' : '#E5E7EB'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 40 L35 40 C35 40 36 38 34 37 L11 37 C9 38 10 40 10 40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'r': // ROOK
        return (
          <g>
            <path
              d="M9 39 L36 39 L36 36 L9 36 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M12 36 L12 26 L33 26 L33 36 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M11 26 L11 14 L34 14 L34 26 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 14 L9 9 L13 9 L13 11 L17 11 L17 9 L21 9 L21 11 L24 11 L24 9 L28 9 L28 11 L32 11 L32 9 L36 9 L36 14 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 20 L31 20"
              fill="none"
              stroke={accent}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 41 L35 41 C35 41 36 39 34 38 L11 38 C9 39 10 41 10 41 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'q': // QUEEN
        return (
          <g>
            <path
              d="M9 26 C9 28 10.5 30 13 32 L32 32 C34.5 30 36 28 36 26 C36 26 38 18 38 13 L31 22 L22.5 11 L14 22 L7 13 C7 18 9 26 9 26 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="14" cy="20" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="22.5" cy="9.5" r="2.2" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="31" cy="20" r="1.8" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <circle cx="38" cy="12" r="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
            <path
              d="M12 33 L33 33 L34 37 L11 37 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M10 40 L35 40 C35 40 36 38 34 37 L11 37 C9 38 10 40 10 40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'k': // KING
        return (
          <g>
            {/* Cross on top */}
            <path
              d="M22.5 6 L22.5 12 M19.5 9 L25.5 9"
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M11.5 31 C11.5 24 16 19 22.5 19 C29 19 33.5 24 33.5 31 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M17 19 C14 15 14 12 18 12 C21 12 22.5 15 22.5 15 C22.5 15 24 12 27 12 C31 12 31 15 28 19"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M11 32 L34 32 L34 36 L11 36 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <path
              d="M10 40 L35 40 C35 40 36 38 34 37 L11 37 C9 38 10 40 10 40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
            />
            <circle cx="22.5" cy="24" r="2.5" fill={accent} stroke={stroke} strokeWidth="1" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`chess-piece ${className}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        filter: isWhite
          ? 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45))'
          : 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.75))',
        transition: 'transform 0.15s ease',
      }}
    >
      <svg
        viewBox="0 0 45 45"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {renderPieceSvg()}
      </svg>
    </div>
  );
}
