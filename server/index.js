const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Chess } = require('chess.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Storage for Active Games
const games = new Map();

// Helper: Evaluate game over state
function evaluateGameState(chess) {
  if (!chess.isGameOver()) {
    return { isGameOver: false, winner: null, reason: null };
  }

  let winner = 'draw';
  let reason = 'draw';

  if (chess.isCheckmate()) {
    winner = chess.turn() === 'w' ? 'b' : 'w';
    reason = 'checkmate';
  } else if (chess.isStalemate()) {
    reason = 'stalemate';
  } else if (chess.isThreefoldRepetition()) {
    reason = 'threefold';
  } else if (chess.isInsufficientMaterial()) {
    reason = 'insufficient';
  }

  return { isGameOver: true, winner, reason };
}

// Simple server-side AI evaluation
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function evaluatePosition(chess, color) {
  let score = 0;
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p) {
        const val = PIECE_VALUES[p.type] || 0;
        score += p.color === color ? val : -val;
      }
    }
  }
  return score;
}

function getAiMove(chess, difficulty = 'intermediate') {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  if (difficulty === 'novice') {
    // Random or basic capture
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.7) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Intermediate / Master: Depth 2 Evaluation
  const color = chess.turn();
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const m of moves) {
    chess.move(m);
    let evalScore = evaluatePosition(chess, color);

    // Opponent response
    const oppMoves = chess.moves({ verbose: true });
    let worstOpp = Infinity;
    for (const om of oppMoves) {
      chess.move(om);
      const score = evaluatePosition(chess, color);
      chess.undo();
      if (score < worstOpp) worstOpp = score;
    }
    chess.undo();

    const finalScore = oppMoves.length > 0 ? worstOpp : evalScore;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMoves = [m];
    } else if (finalScore === bestScore) {
      bestMoves.push(m);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)] || moves[0];
}

// ============================================
// RESTful API Routes
// ============================================

// 1. Health check (Crucial for Render liveness check)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Apex Chess REST API',
    uptime: `${Math.floor(process.uptime())}s`,
    activeGames: games.size,
    timestamp: new Date().toISOString(),
  });
});

// 2. GET all games
app.get('/api/games', (req, res) => {
  const gameSummaries = Array.from(games.values()).map((g) => ({
    id: g.id,
    createdAt: g.createdAt,
    mode: g.mode,
    difficulty: g.difficulty,
    turn: g.turn,
    isGameOver: g.isGameOver,
    winner: g.winner,
    moveCount: g.history.length,
  }));
  res.json({ success: true, count: gameSummaries.length, data: gameSummaries });
});

// 3. POST create new game
app.post('/api/games', (req, res) => {
  const { mode = 'ai', difficulty = 'intermediate' } = req.body;
  const id = `game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const chess = new Chess();

  const newGame = {
    id,
    createdAt: new Date().toISOString(),
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: chess.turn(),
    mode,
    difficulty,
    history: [],
    isGameOver: false,
    winner: null,
    reason: null,
  };

  games.set(id, newGame);
  res.status(201).json({ success: true, data: newGame });
});

// 4. GET specific game by ID
app.get('/api/games/:id', (req, res) => {
  const game = games.get(req.params.id);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game session not found' });
  }
  res.json({ success: true, data: game });
});

// 5. POST execute move
app.post('/api/games/:id/move', (req, res) => {
  const game = games.get(req.params.id);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game session not found' });
  }

  if (game.isGameOver) {
    return res.status(400).json({ success: false, message: 'Game has already ended' });
  }

  const { from, to, promotion = 'q' } = req.body;
  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'Source and target squares required' });
  }

  try {
    const chess = new Chess(game.fen);
    const move = chess.move({ from, to, promotion });

    if (!move) {
      return res.status(400).json({ success: false, message: 'Illegal move' });
    }

    const { isGameOver, winner, reason } = evaluateGameState(chess);

    game.fen = chess.fen();
    game.pgn = chess.pgn();
    game.turn = chess.turn();
    game.isGameOver = isGameOver;
    game.winner = winner;
    game.reason = reason;
    game.history.push({
      from: move.from,
      to: move.to,
      san: move.san,
      piece: move.piece,
      color: move.color,
      captured: move.captured || null,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        move: {
          from: move.from,
          to: move.to,
          san: move.san,
          captured: move.captured || null,
        },
        game,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Invalid move execution' });
  }
});

// 6. POST request server AI move
app.post('/api/games/:id/ai-move', (req, res) => {
  const game = games.get(req.params.id);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game session not found' });
  }

  if (game.isGameOver) {
    return res.status(400).json({ success: false, message: 'Game is already finished' });
  }

  try {
    const chess = new Chess(game.fen);
    const aiMove = getAiMove(chess, game.difficulty);

    if (!aiMove) {
      return res.status(400).json({ success: false, message: 'No legal moves available for AI' });
    }

    const move = chess.move(aiMove);
    const { isGameOver, winner, reason } = evaluateGameState(chess);

    game.fen = chess.fen();
    game.pgn = chess.pgn();
    game.turn = chess.turn();
    game.isGameOver = isGameOver;
    game.winner = winner;
    game.reason = reason;
    game.history.push({
      from: move.from,
      to: move.to,
      san: move.san,
      piece: move.piece,
      color: move.color,
      captured: move.captured || null,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        move: {
          from: move.from,
          to: move.to,
          san: move.san,
          captured: move.captured || null,
        },
        game,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error computing AI move' });
  }
});

// 7. DELETE game
app.delete('/api/games/:id', (req, res) => {
  if (games.delete(req.params.id)) {
    res.json({ success: true, message: 'Game deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Game not found' });
  }
});

// ============================================
// Static Production Frontend (Serve React on Render)
// ============================================
const buildPath = path.join(__dirname, '..', 'build');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // Any non-API route serves index.html (SPA catchall)
  app.use((req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'Apex Chess API is running. Run "npm run build" to serve the frontend.',
    });
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Apex Chess Server] Running on http://0.0.0.0:${PORT}`);
});
