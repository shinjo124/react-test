import React from 'react';

export default function GameOverModal({
  isOpen,
  winner, // 'w' | 'b' | 'draw'
  reason, // 'checkmate' | 'stalemate' | 'threefold' | 'insufficient' | 'timeout' | 'resignation'
  onRestart,
  onClose,
}) {
  if (!isOpen) return null;

  let title = 'Game Over';
  let badgeColor = '#64748b';
  let message = '';

  if (winner === 'draw') {
    title = 'Peaceful Draw';
    badgeColor = '#94a3b8';
    if (reason === 'stalemate') {
      message = 'Stalemate! The active player has no legal moves and is not in check.';
    } else if (reason === 'threefold') {
      message = 'Draw by Threefold Repetition.';
    } else if (reason === 'insufficient') {
      message = 'Draw by Insufficient Material to checkmate.';
    } else {
      message = 'The game ended in a draw.';
    }
  } else {
    const winnerName = winner === 'w' ? 'White' : 'Black';
    title = `${winnerName} Wins!`;
    badgeColor = winner === 'w' ? '#38bdf8' : '#a855f7';

    if (reason === 'checkmate') {
      message = `Checkmate! ${winnerName} delivers the final blow.`;
    } else if (reason === 'timeout') {
      message = `Time Expired! ${winnerName} wins on the clock.`;
    } else if (reason === 'resignation') {
      message = `${winnerName} wins by opponent resignation.`;
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="game-over-card">
        <div
          className="game-over-badge"
          style={{ backgroundColor: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}55` }}
        >
          {winner === 'draw' ? '⚖️ DRAW' : '🏆 VICTORY'}
        </div>
        <h2 className="game-over-title">{title}</h2>
        <p className="game-over-desc">{message}</p>

        <div className="game-over-actions">
          <button className="primary-action-btn" onClick={onRestart}>
            Play Again
          </button>
          <button className="secondary-action-btn" onClick={onClose}>
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
}
