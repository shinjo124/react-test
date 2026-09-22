import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Apex Chess header and title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Apex Chess/i);
  expect(titleElement).toBeInTheDocument();

  const turnElement = screen.getByText(/White to move/i);
  expect(turnElement).toBeInTheDocument();
});

test('renders game controls and new game button', () => {
  render(<App />);
  const newGameBtn = screen.getByText(/New Game/i);
  expect(newGameBtn).toBeInTheDocument();

  const undoBtn = screen.getByText(/Undo/i);
  expect(undoBtn).toBeInTheDocument();

  const flipBtn = screen.getByText(/Flip/i);
  expect(flipBtn).toBeInTheDocument();
});

test('renders chessboard with 64 squares', () => {
  const { container } = render(<App />);
  const squares = container.querySelectorAll('.board-square');
  expect(squares.length).toBe(64);
});

test('allows clicking on a piece to show legal moves', () => {
  const { container } = render(<App />);
  // Click e2 square (White pawn)
  const e2Square = container.querySelector('[data-square="e2"]');
  expect(e2Square).toBeInTheDocument();

  fireEvent.click(e2Square);

  // Legal moves should highlight e3 and e4
  const hints = container.querySelectorAll('.legal-hint');
  expect(hints.length).toBeGreaterThan(0);
});
