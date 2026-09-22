import React, { useRef, useEffect } from 'react';
import ChessPiece from './ChessPiece';
import { THEMES } from './ChessBoard';

const PIECE_SYMBOLS = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚',
};

const PIECE_WEIGHTS = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function GameSidebar({
  game,
  gameMode,
  setGameMode,
  aiDifficulty,
  setAiDifficulty,
  boardTheme,
  setBoardTheme,
  timeControl,
  setTimeControl,
  timers,
  moveHistory,
  onNewGame,
  onUndo,
  onFlipBoard,
  onResign,
  soundMuted,
  onToggleSound,
  isAiThinking,
}) {
  const historyEndRef = useRef(null);

  // Auto-scroll move history
  useEffect(() => {
    if (historyEndRef.current && typeof historyEndRef.current.scrollIntoView === 'function') {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [moveHistory]);

  const currentTurn = game.turn();

  // Compute captured pieces
  const calculateCapturedPieces = () => {
    const initialCounts = {
      p: 8,
      n: 2,
      b: 2,
      r: 2,
      q: 1,
    };

    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    };

    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (piece && piece.type !== 'k') {
          currentCounts[piece.color][piece.type]++;
        }
      }
    }

    // White captured black's missing pieces
    const capturedByWhite = [];
    let whiteAdvantage = 0;
    Object.keys(initialCounts).forEach((type) => {
      const missingBlack = Math.max(0, initialCounts[type] - currentCounts.b[type]);
      for (let i = 0; i < missingBlack; i++) {
        capturedByWhite.push(type);
        whiteAdvantage += PIECE_WEIGHTS[type];
      }
    });

    // Black captured white's missing pieces
    const capturedByBlack = [];
    let blackAdvantage = 0;
    Object.keys(initialCounts).forEach((type) => {
      const missingWhite = Math.max(0, initialCounts[type] - currentCounts.w[type]);
      for (let i = 0; i < missingWhite; i++) {
        capturedByBlack.push(type);
        blackAdvantage += PIECE_WEIGHTS[type];
      }
    });

    const netAdvantage = whiteAdvantage - blackAdvantage;

    return {
      capturedByWhite,
      capturedByBlack,
      whiteDiff: netAdvantage > 0 ? `+${netAdvantage}` : null,
      blackDiff: netAdvantage < 0 ? `+${Math.abs(netAdvantage)}` : null,
    };
  };

  const { capturedByWhite, capturedByBlack, whiteDiff, blackDiff } =
    calculateCapturedPieces();

  // Pair up move history into rounds: [{ num: 1, white: 'e4', black: 'e5' }]
  const moveRounds = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    moveRounds.push({
      round: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || null,
    });
  }

  const copyFen = () => {
    try {
      navigator.clipboard.writeText(game.fen());
      alert('FEN copied to clipboard!');
    } catch (e) {
      alert(game.fen());
    }
  };

  return (
    <div className="game-sidebar">
      {/* Top Player (Black) */}
      <div
        className={`player-card ${currentTurn === 'b' ? 'active-turn' : ''} ${
          isAiThinking && currentTurn === 'b' ? 'ai-thinking' : ''
        }`}
      >
        <div className="player-info">
          <div className="avatar black-avatar">
            <ChessPiece type="k" color="b" size="24px" />
          </div>
          <div className="player-details">
            <div className="player-name-row">
              <span className="player-name">
                {gameMode === 'ai' ? `AI Bot (${aiDifficulty})` : 'Black'}
              </span>
              {isAiThinking && currentTurn === 'b' && (
                <span className="thinking-chip">Thinking...</span>
              )}
            </div>
            <div className="captured-tray">
              {capturedByBlack.map((type, idx) => (
                <span key={idx} className="captured-piece-sym">
                  {PIECE_SYMBOLS[type]}
                </span>
              ))}
              {blackDiff && <span className="diff-badge">{blackDiff}</span>}
            </div>
          </div>
        </div>
        {timeControl && (
          <div className={`player-timer ${timers.b < 30 ? 'low-time' : ''}`}>
            ⏱️ {formatTime(timers.b)}
          </div>
        )}
      </div>

      {/* Move History Section */}
      <div className="move-history-card">
        <div className="history-header">
          <span>Move Notation</span>
          <span className="move-counter">{moveHistory.length} moves</span>
        </div>
        <div className="history-scroll-container">
          {moveRounds.length === 0 ? (
            <div className="empty-history">Game started. Make your first move!</div>
          ) : (
            <table className="history-table">
              <tbody>
                {moveRounds.map((r) => (
                  <tr key={r.round} className="history-row">
                    <td className="round-num">{r.round}.</td>
                    <td className="white-move">{r.white}</td>
                    <td className="black-move">{r.black || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div ref={historyEndRef} />
        </div>
      </div>

      {/* Bottom Player (White) */}
      <div className={`player-card ${currentTurn === 'w' ? 'active-turn' : ''}`}>
        <div className="player-info">
          <div className="avatar white-avatar">
            <ChessPiece type="k" color="w" size="24px" />
          </div>
          <div className="player-details">
            <div className="player-name-row">
              <span className="player-name">
                {gameMode === 'ai' ? 'You' : 'White'}
              </span>
            </div>
            <div className="captured-tray">
              {capturedByWhite.map((type, idx) => (
                <span key={idx} className="captured-piece-sym white-captured">
                  {PIECE_SYMBOLS[type]}
                </span>
              ))}
              {whiteDiff && <span className="diff-badge">{whiteDiff}</span>}
            </div>
          </div>
        </div>
        {timeControl && (
          <div className={`player-timer ${timers.w < 30 ? 'low-time' : ''}`}>
            ⏱️ {formatTime(timers.w)}
          </div>
        )}
      </div>

      {/* Controls & Configuration */}
      <div className="control-panel">
        <div className="settings-row">
          <label>Mode:</label>
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            className="custom-select"
          >
            <option value="ai">Play vs Computer</option>
            <option value="pvp">Pass & Play (2 Players)</option>
            <option value="analysis">Analysis Sandbox</option>
          </select>
        </div>

        {gameMode === 'ai' && (
          <div className="settings-row">
            <label>AI Level:</label>
            <select
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
              className="custom-select"
            >
              <option value="novice">Novice (Easy)</option>
              <option value="intermediate">Intermediate (Tactical)</option>
              <option value="master">Master (Alpha-Beta)</option>
            </select>
          </div>
        )}

        <div className="settings-row">
          <label>Timer:</label>
          <select
            value={timeControl === null ? 'none' : timeControl}
            onChange={(e) => {
              const val = e.target.value === 'none' ? null : parseInt(e.target.value, 10);
              setTimeControl(val);
            }}
            className="custom-select"
          >
            <option value="none">Untimed</option>
            <option value="180">3 min (Blitz)</option>
            <option value="300">5 min (Blitz)</option>
            <option value="600">10 min (Rapid)</option>
          </select>
        </div>

        <div className="settings-row">
          <label>Board Theme:</label>
          <select
            value={boardTheme}
            onChange={(e) => setBoardTheme(e.target.value)}
            className="custom-select"
          >
            {Object.entries(THEMES).map(([key, t]) => (
              <option key={key} value={key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="action-button-grid">
          <button className="ctrl-btn primary" onClick={onNewGame} title="Start a fresh match">
            🔄 New Game
          </button>
          <button className="ctrl-btn" onClick={onUndo} title="Take back the last move">
            ↩️ Undo
          </button>
          <button className="ctrl-btn" onClick={onFlipBoard} title="Flip board perspective">
            🔄 Flip
          </button>
          <button className="ctrl-btn" onClick={onResign} title="Resign current match">
            🏳️ Resign
          </button>
          <button className="ctrl-btn" onClick={onToggleSound} title="Toggle sound effects">
            {soundMuted ? '🔇 Unmute' : '🔊 Sound'}
          </button>
          <button className="ctrl-btn" onClick={copyFen} title="Copy FEN to clipboard">
            📋 Copy FEN
          </button>
        </div>
      </div>
    </div>
  );
}
