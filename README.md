# ♟️ Apex Chess

> A modern, responsive, and visually stunning chess web application built with **React 19**, **chess.js**, and browser-native **Web Audio API**.

---

## ✨ Features

### 🎮 Game Modes
- **Play vs Computer (AI)**:
  - **Novice (Easy)**: Casual, quick play with capture prioritization.
  - **Intermediate (Medium)**: Tactical gameplay powered by depth-2 Minimax with Piece-Square Tables (PST).
  - **Master (Hard)**: Depth-3 Minimax with Alpha-Beta Pruning, move ordering (MVV-LVA), king safety, and endgame awareness.
- **Pass & Play (2 Players)**: Local multiplayer on the same device.
- **Analysis Sandbox**: Free-form board exploration and position analysis.

### 🎨 Customizable Board & Aesthetics
- **Dark Glassmorphism Interface**: Sleek dark slate theme with glowing accents and smooth micro-animations.
- **4 Beautiful Board Themes**:
  - 🌿 **Emerald Green**: Classic tournament aesthetic (inspired by Chess.com).
  - 🌌 **Midnight Cyber**: Futuristic neon slate & deep dark squares.
  - 🪵 **Tournament Walnut**: Warm wooden grain style.
  - 🪨 **Minimal Slate**: Clean modern monochrome style.
- **High-Definition Vector Pieces**: Scalable SVGs with custom drop shadows and crisp contours.
- **Visual Move Indicators**:
  - Legal target dots and capture rings.
  - Selected square aura and last-move origin/destination highlights.
  - Pulsing check warning centered on the King under attack.
- **Interactive Pawn Promotion**: Inline dialog to promote pawns to Queen, Rook, Bishop, or Knight.
- **Flexible Controls**: Seamless click-to-move and drag-and-drop support.

### ⏱️ Clocks & Timers
- **Customizable Time Controls**:
  - Untimed (Casual)
  - 3 min (Blitz)
  - 5 min (Blitz)
  - 10 min (Rapid)
- Active turn indicator with low-time countdown warnings (< 30 seconds).

### 🔊 Pure Web Audio Sound Effects
- Synthesized in real time using the browser's native `AudioContext`.
- **Zero audio lag, 100% offline**, and no external audio asset dependencies:
  - Wooden tap for moves
  - Deep thud for captures
  - Harmonic chime for checks
  - Celebratory arpeggio for victory
  - Sound mute toggle included

### 📊 Sidebar & Utilities
- **Captured Pieces Tray**: Real-time captured piece counts with net material difference (`+1`, `+3`, etc.).
- **Move Notation History**: Standard Algebraic Notation (SAN) table with auto-scrolling.
- **Board Flip**: Toggle between White and Black perspectives.
- **Undo Move**: Retract mistakes (reverts both AI and player moves in AI mode).
- **Copy FEN**: Export current board position to clipboard in one click.
- **Game Over Dialog**: Clear announcements for checkmate, stalemate, 50-move rule, threefold repetition, resignation, and timeout with a "Play Again" or "Review Board" option.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (bundled with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shinjo124/react-test.git
   cd react-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode with hot reloading.
- **`npm test`**: Launches the Jest test runner in CI mode (`npm test -- --watch=false`).
- **`npm run build`**: Builds an optimized production bundle into the `build` folder.

---

## 🧩 Project Structure

```text
src/
├── components/
│   ├── ChessBoard.js       # 8x8 interactive board, squares, themes, & promotion modal
│   ├── ChessPiece.js       # Crisp vector SVG chess piece set
│   ├── GameOverModal.js    # Victory / Draw overlay dialog
│   └── GameSidebar.js      # Player cards, timers, captured pieces, move history, & settings
├── utils/
│   ├── chessAI.js          # Minimax + Alpha-Beta pruning AI engine & piece-square tables
│   └── soundEffects.js     # Web Audio API sound synthesizer
├── App.js                  # Main game state orchestrator & lifecycle management
├── App.css                 # Glassmorphic dark styling, board grid, & responsive layouts
├── App.test.js             # Unit tests for board rendering, pieces, and game actions
└── index.js                # React mount entry point
```

---

## 📜 Tech Stack

- **React 19**: Modern component architecture with hooks (`useRef`, `useCallback`, `useEffect`).
- **chess.js**: Move validation, legal moves generation, check/checkmate/draw conditions, and FEN handling.
- **Web Audio API**: Real-time audio waveform synthesis for instant game sound effects.
- **Vanilla CSS**: Clean, responsive design tokens with glassmorphism and CSS animations.

---

## 📄 License

MIT License. Feel free to use, modify, and distribute this project.
