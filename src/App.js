import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import GameSidebar from './components/GameSidebar';
import GameOverModal from './components/GameOverModal';
import { sounds } from './utils/soundEffects';
import { getBestMove } from './utils/chessAI';
import './App.css';

export default function App() {
  // Game instance & core board state
  const chessRef = useRef(new Chess());
  const game = chessRef.current;
  const [, setRenderTrigger] = useState(0);

  // Configuration & display state
  const [gameMode, setGameMode] = useState('ai'); // 'ai' | 'pvp' | 'analysis'
  const [aiDifficulty, setAiDifficulty] = useState('intermediate'); // 'novice' | 'intermediate' | 'master'
  const [boardOrientation, setBoardOrientation] = useState('w');
  const [boardTheme, setBoardTheme] = useState('emerald');
  const [soundMuted, setSoundMuted] = useState(false);

  // Gameplay state
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Time controls (seconds, or null for untimed)
  const [timeControl, setTimeControl] = useState(300); // 5 min default
  const [timers, setTimers] = useState({ w: 300, b: 300 });

  // Game over state
  const [gameOverInfo, setGameOverInfo] = useState({
    isOpen: false,
    winner: null,
    reason: null,
  });

  const forceRender = () => setRenderTrigger((n) => n + 1);

  // Sound mute sync
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sounds.setMuted(next);
  };

  // Check game over condition
  const checkGameOver = useCallback(() => {
    if (game.isGameOver()) {
      let winner = 'draw';
      let reason = 'draw';

      if (game.isCheckmate()) {
        winner = game.turn() === 'w' ? 'b' : 'w';
        reason = 'checkmate';
      } else if (game.isStalemate()) {
        reason = 'stalemate';
      } else if (game.isThreefoldRepetition()) {
        reason = 'threefold';
      } else if (game.isInsufficientMaterial()) {
        reason = 'insufficient';
      }

      sounds.playGameEnd(winner === 'w');
      setGameOverInfo({ isOpen: true, winner, reason });
      return true;
    }
    return false;
  }, [game]);

  // Execute a chess move
  const handleMakeMove = useCallback(
    ({ from, to, promotion = 'q' }) => {
      try {
        const move = game.move({ from, to, promotion });
        if (!move) return false;

        setLastMove({ from, to });
        setMoveHistory((prev) => [...prev, move.san]);
        forceRender();

        // Trigger sounds
        if (move.captured) {
          sounds.playCapture();
        } else if (game.inCheck()) {
          sounds.playCheck();
        } else {
          sounds.playMove();
        }

        checkGameOver();
        return true;
      } catch (e) {
        return false;
      }
    },
    [game, checkGameOver]
  );

  // AI response move trigger
  useEffect(() => {
    if (
      gameMode === 'ai' &&
      game.turn() === 'b' &&
      !game.isGameOver() &&
      !gameOverInfo.isOpen
    ) {
      setIsAiThinking(true);

      const delay = Math.random() * 300 + 350; // realistic thinking time
      const timer = setTimeout(() => {
        const bestMove = getBestMove(game, aiDifficulty);
        if (bestMove) {
          handleMakeMove({
            from: bestMove.from,
            to: bestMove.to,
            promotion: bestMove.promotion || 'q',
          });
        }
        setIsAiThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [game, gameMode, aiDifficulty, gameOverInfo.isOpen, handleMakeMove, moveHistory.length]);

  // Clock countdown timer
  useEffect(() => {
    if (timeControl === null || game.isGameOver() || gameOverInfo.isOpen) {
      return;
    }

    const interval = setInterval(() => {
      setTimers((prev) => {
        const turn = game.turn();
        const currentRemaining = prev[turn];

        if (currentRemaining <= 1) {
          clearInterval(interval);
          const winner = turn === 'w' ? 'b' : 'w';
          sounds.playGameEnd(winner === 'w');
          setGameOverInfo({ isOpen: true, winner, reason: 'timeout' });
          return { ...prev, [turn]: 0 };
        }

        return { ...prev, [turn]: currentRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeControl, game, gameOverInfo.isOpen]);

  // Restart / New Game
  const handleNewGame = () => {
    game.reset();
    setLastMove(null);
    setMoveHistory([]);
    setIsAiThinking(false);
    setGameOverInfo({ isOpen: false, winner: null, reason: null });
    if (timeControl !== null) {
      setTimers({ w: timeControl, b: timeControl });
    }
    forceRender();
  };

  // Undo move
  const handleUndo = () => {
    if (isAiThinking || moveHistory.length === 0) return;

    if (gameMode === 'ai') {
      // Undo both AI move and Player move
      game.undo();
      game.undo();
      setMoveHistory((prev) => prev.slice(0, Math.max(0, prev.length - 2)));
    } else {
      game.undo();
      setMoveHistory((prev) => prev.slice(0, prev.length - 1));
    }

    setLastMove(null);
    setGameOverInfo({ isOpen: false, winner: null, reason: null });
    forceRender();
  };

  // Resign match
  const handleResign = () => {
    if (game.isGameOver() || gameOverInfo.isOpen) return;
    const resigningTurn = game.turn();
    const winner = resigningTurn === 'w' ? 'b' : 'w';
    sounds.playGameEnd(winner === 'w');
    setGameOverInfo({ isOpen: true, winner, reason: 'resignation' });
  };

  // Flip board perspective
  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === 'w' ? 'b' : 'w'));
  };

  // When time control is changed from sidebar
  const handleTimeControlChange = (newControl) => {
    setTimeControl(newControl);
    if (newControl !== null) {
      setTimers({ w: newControl, b: newControl });
    }
  };

  const isInteractive =
    !gameOverInfo.isOpen &&
    !isAiThinking &&
    (gameMode !== 'ai' || game.turn() === boardOrientation);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="brand-logo">
          <div className="logo-icon">♟️</div>
          <div className="brand-text">
            <span className="brand-title">Apex Chess</span>
            <span className="brand-sub">Grandmaster Arena</span>
          </div>
        </div>

        <div className="header-status">
          <div className="turn-pill">
            <span
              className={`turn-indicator-dot ${
                game.turn() === 'w' ? 'turn-white' : 'turn-black'
              }`}
            />
            <span>
              {game.isGameOver()
                ? 'Game Finished'
                : game.turn() === 'w'
                ? 'White to move'
                : 'Black to move'}
            </span>
          </div>
          {game.inCheck() && !game.isGameOver() && (
            <div className="check-alert-pill">⚠️ CHECK!</div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="game-layout">
        <div className="board-column">
          <ChessBoard
            game={game}
            boardOrientation={boardOrientation}
            boardTheme={boardTheme}
            onMakeMove={handleMakeMove}
            lastMove={lastMove}
            isInteractive={isInteractive}
          />
        </div>

        <div className="sidebar-column">
          <GameSidebar
            game={game}
            gameMode={gameMode}
            setGameMode={setGameMode}
            aiDifficulty={aiDifficulty}
            setAiDifficulty={setAiDifficulty}
            boardTheme={boardTheme}
            setBoardTheme={setBoardTheme}
            timeControl={timeControl}
            setTimeControl={handleTimeControlChange}
            timers={timers}
            moveHistory={moveHistory}
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlipBoard={handleFlipBoard}
            onResign={handleResign}
            soundMuted={soundMuted}
            onToggleSound={toggleSound}
            isAiThinking={isAiThinking}
          />
        </div>
      </main>

      {/* Game Over Dialog */}
      <GameOverModal
        isOpen={gameOverInfo.isOpen}
        winner={gameOverInfo.winner}
        reason={gameOverInfo.reason}
        onRestart={handleNewGame}
        onClose={() => setGameOverInfo((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
