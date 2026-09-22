import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders portal with Hello, World! headline and initial state', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Hello, World!/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /DO NOT CLICK/i })).toBeInTheDocument();
  expect(screen.getByText(/There is absolutely nothing useful here/i)).toBeInTheDocument();
  expect(screen.getByText(/TIMES CLICKED/i)).toBeInTheDocument();
});

test('clicking the button increments counter and changes message at milestone 1', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /DO NOT CLICK/i }));
  expect(screen.getByText(/^1$/)).toBeInTheDocument();
  expect(screen.getByText(/You clicked it/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: /Hello, World!/i })).toBeInTheDocument();
});

test('renders corner dock tabs and chess navigation works', () => {
  const { container } = render(<App />);
  const portalTab = screen.getByTestId('tab-portal');
  const chessTab = screen.getByTestId('tab-chess');
  expect(portalTab).toHaveClass('active');

  fireEvent.click(chessTab);
  expect(chessTab).toHaveClass('active');
  expect(portalTab).not.toHaveClass('active');
  expect(container.querySelectorAll('.board-square').length).toBe(64);
  expect(screen.getByText(/White to move/i)).toBeInTheDocument();

  fireEvent.click(portalTab);
  expect(portalTab).toHaveClass('active');
  expect(screen.getByRole('button', { name: /DO NOT CLICK/i })).toBeInTheDocument();
});

test('chess move state preserved across tab switches', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByTestId('tab-chess'));
  fireEvent.click(container.querySelector('[data-square="e2"]'));
  fireEvent.click(container.querySelector('[data-square="e4"]'));
  expect(screen.getByText('e4')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('tab-portal'));
  fireEvent.click(screen.getByTestId('tab-chess'));
  expect(screen.getByText('e4')).toBeInTheDocument();
});
