// Chess AI Engine with Piece-Square Tables and Minimax with Alpha-Beta Pruning

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (viewed from White's perspective)
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_PST = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_PST = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_PST = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_PST_MID = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPieceSquareValue(pieceType, color, rank, file) {
  const r = color === 'w' ? 7 - rank : rank;
  const f = file;

  switch (pieceType) {
    case 'p':
      return PAWN_PST[r][f];
    case 'n':
      return KNIGHT_PST[r][f];
    case 'b':
      return BISHOP_PST[r][f];
    case 'r':
      return ROOK_PST[r][f];
    case 'q':
      return QUEEN_PST[r][f];
    case 'k':
      return KING_PST_MID[r][f];
    default:
      return 0;
  }
}

/**
 * Evaluates the board position from the perspective of active player
 */
export function evaluateBoard(game, color = 'w') {
  if (game.isGameOver()) {
    if (game.isCheckmate()) {
      return game.turn() === color ? -99999 : 99999;
    }
    return 0; // Draw by stalemate, 3-fold, 50-move
  }

  let whiteScore = 0;
  let blackScore = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        const pst = getPieceSquareValue(piece.type, piece.color, 7 - r, f);
        const total = val + pst;

        if (piece.color === 'w') {
          whiteScore += total;
        } else {
          blackScore += total;
        }
      }
    }
  }

  // Slight bonus for checks
  if (game.inCheck()) {
    if (game.turn() === 'w') {
      whiteScore -= 40;
    } else {
      blackScore -= 40;
    }
  }

  const score = whiteScore - blackScore;
  return color === 'w' ? score : -score;
}

/**
 * Order moves to improve alpha-beta pruning efficiency
 */
function orderMoves(moves) {
  return moves.slice().sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Favor captures with high victim value
    if (a.captured) {
      scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    }
    if (b.captured) {
      scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    }

    // Favor promotions
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;

    return scoreB - scoreA;
  });
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function minimax(game, depth, alpha, beta, isMaximizing, aiColor) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game, aiColor);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false, aiColor);
      game.undo();

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true, aiColor);
      game.undo();

      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Alpha cutoff
    }
    return minEval;
  }
}

/**
 * Calculates the best move based on selected AI difficulty
 * @param {Chess} game - Instance of chess.js
 * @param {string} difficulty - 'novice' | 'intermediate' | 'master'
 * @returns {object|null} verbose move object ({ from, to, promotion })
 */
export function getBestMove(game, difficulty = 'intermediate') {
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  const aiColor = game.turn();

  // NOVICE: 70% basic heuristics/captures, 30% random
  if (difficulty === 'novice') {
    if (Math.random() < 0.3) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    // Check for free captures or checks
    const tacticalMoves = legalMoves.filter((m) => m.captured || m.san.includes('+'));
    if (tacticalMoves.length > 0 && Math.random() < 0.75) {
      return tacticalMoves[Math.floor(Math.random() * tacticalMoves.length)];
    }

    // Depth 1 pick
    let bestScore = -Infinity;
    let bestMove = legalMoves[0];
    for (const move of legalMoves) {
      game.move(move);
      const score = evaluateBoard(game, aiColor) + (Math.random() * 60 - 30);
      game.undo();
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // INTERMEDIATE: Depth 2 Minimax
  if (difficulty === 'intermediate') {
    const depth = 2;
    let bestScore = -Infinity;
    let candidates = [];

    const orderedMoves = orderMoves(legalMoves);
    for (const move of orderedMoves) {
      game.move(move);
      const score = minimax(game, depth - 1, -Infinity, Infinity, false, aiColor);
      game.undo();

      if (score > bestScore) {
        bestScore = score;
        candidates = [move];
      } else if (score === bestScore) {
        candidates.push(move);
      }
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // MASTER: Depth 3 Minimax with Alpha-Beta Pruning
  const depth = 3;
  let bestScore = -Infinity;
  let bestMove = legalMoves[0];
  let alpha = -Infinity;
  const beta = Infinity;

  const orderedMoves = orderMoves(legalMoves);
  for (const move of orderedMoves) {
    game.move(move);
    const score = minimax(game, depth - 1, alpha, beta, false, aiColor);
    game.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestScore);
  }

  return bestMove;
}
