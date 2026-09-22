import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders futuristic portal with HELLO, WORLD! headline and DO NOT CLICK button', () => {
  render(<App />);

  // Should render huge HELLO, WORLD! headline
  const headline = screen.getByRole('heading', { level: 1, name: /HELLO, WORLD!/i });
  expect(headline).toBeInTheDocument();

  // Should render DO NOT CLICK button
  const hazardBtn = screen.getByRole('button', { name: /DO NOT CLICK/i });
  expect(hazardBtn).toBeInTheDocument();

  // Should render defiance counter initial state
  expect(screen.getByText(/00/)).toBeInTheDocument();
  expect(screen.getByText(/DEFIANCE LEVEL/i)).toBeInTheDocument();
});

test('clicking DO NOT CLICK cycles text from HELLO, WORLD! to HELLO, INTERNET! to HELLO, YOU! and increments counter', () => {
  render(<App />);

  const hazardBtn = screen.getByRole('button', { name: /DO NOT CLICK/i });

  // Click 1: Hello, Internet!
  fireEvent.click(hazardBtn);
  expect(screen.getByRole('heading', { level: 1, name: /HELLO, INTERNET!/i })).toBeInTheDocument();
  expect(screen.getByText(/01/)).toBeInTheDocument();

  // Click 2: Hello, You!
  fireEvent.click(hazardBtn);
  expect(screen.getByRole('heading', { level: 1, name: /HELLO, YOU!/i })).toBeInTheDocument();
  expect(screen.getByText(/02/)).toBeInTheDocument();

  // Click 3: Hello, Multiverse!
  fireEvent.click(hazardBtn);
  expect(screen.getByRole('heading', { level: 1, name: /HELLO, MULTIVERSE!/i })).toBeInTheDocument();
  expect(screen.getByText(/03/)).toBeInTheDocument();
});

test('renders top-right corner dock with Portal and Chess tabs and allows navigation', () => {
  const { container } = render(<App />);

  const portalTab = screen.getByTestId('tab-portal');
  const chessTab = screen.getByTestId('tab-chess');

  expect(portalTab).toBeInTheDocument();
  expect(chessTab).toBeInTheDocument();
  expect(portalTab).toHaveClass('active');

  // Switch to Chess tab
  fireEvent.click(chessTab);

  expect(chessTab).toHaveClass('active');
  expect(portalTab).not.toHaveClass('active');

  // Chessboard should now be rendered with 64 squares
  const squares = container.querySelectorAll('.board-square');
  expect(squares.length).toBe(64);

  // Turn status and controls should be visible
  expect(screen.getByText(/White to move/i)).toBeInTheDocument();
  expect(screen.getByText(/New Game/i)).toBeInTheDocument();
  expect(screen.getByText(/Undo/i)).toBeInTheDocument();
  expect(screen.getByText(/Flip/i)).toBeInTheDocument();

  // Can switch back to Portal
  fireEvent.click(portalTab);
  expect(portalTab).toHaveClass('active');
  expect(screen.getByRole('button', { name: /DO NOT CLICK/i })).toBeInTheDocument();
});

test('allows playing a move in chess tab and preserves state across tab navigation', () => {
  const { container } = render(<App />);

  // Navigate to Chess
  const chessTab = screen.getByTestId('tab-chess');
  fireEvent.click(chessTab);

  // Click e2 square (White pawn)
  const e2Square = container.querySelector('[data-square="e2"]');
  expect(e2Square).toBeInTheDocument();
  fireEvent.click(e2Square);

  // Click e4 to make the move
  const e4Square = container.querySelector('[data-square="e4"]');
  expect(e4Square).toBeInTheDocument();
  fireEvent.click(e4Square);

  // Check move history contains e4
  expect(screen.getByText('e4')).toBeInTheDocument();

  // Switch to Portal
  const portalTab = screen.getByTestId('tab-portal');
  fireEvent.click(portalTab);
  expect(screen.getByRole('button', { name: /DO NOT CLICK/i })).toBeInTheDocument();

  // Switch back to Chess: move e4 must still be in history!
  fireEvent.click(chessTab);
  expect(screen.getByText('e4')).toBeInTheDocument();
});
