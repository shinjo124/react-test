# ♟️ Apex Chess

> A modern, responsive, and visually stunning chess web application built with **React 19**, **chess.js**, **Web Audio API**, and an integrated **Node.js + Express RESTful API** ready for deployment on **Render**.

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

## 🌐 RESTful API Endpoints

The project includes an integrated Node.js + Express REST API on port `5000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & uptime status (Render liveness) |
| `GET` | `/api/games` | Retrieve list of active and recent game sessions |
| `POST` | `/api/games` | Create a new game session (`{ mode, difficulty }`) |
| `GET` | `/api/games/:id` | Fetch complete game state (FEN, PGN, move history, turn) |
| `POST` | `/api/games/:id/move` | Validate and execute a move (`{ from, to, promotion }`) |
| `POST` | `/api/games/:id/ai-move` | Request an AI move generated on the server |
| `DELETE` | `/api/games/:id` | Terminate and remove a game session |

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

3. Launch in development:
   - To run the **React frontend** locally:
     ```bash
     npm run client
     ```
     Open [http://localhost:3000](http://localhost:3000) in your browser.
   - To run the **Express backend** server:
     ```bash
     npm start
     ```
     Running on [http://localhost:5000](http://localhost:5000).

---

## 🛠️ Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the Express server (serves REST API `/api/*` and production React `build/`).
- **`npm run client`**: Runs the React development server locally at `http://localhost:3000`.
- **`npm test`**: Launches the Jest test runner in CI mode (`npm test -- --watch=false`).
- **`npm run build`**: Compiles an optimized production React build into `build/`.

---

## ☁️ Deployment on Render

This repository includes a `render.yaml` blueprint for automatic 1-click deployment on Render:

1. Push your latest code to your GitHub repository:
   ```bash
   git push -u origin main
   ```
2. Log into **[dashboard.render.com](https://dashboard.render.com/)**.
3. Click **New +** > **Blueprint** (or **Web Service**).
4. Connect your repository: `https://github.com/shinjo124/react-test.git`.
5. If creating a manual **Web Service**:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click **Deploy**. Render will install dependencies, compile the React frontend, and start Express serving both the REST API and the web app on your free `.onrender.com` domain!

---

## 🧩 Project Structure

```text
├── build/                 # Compiled production React frontend
├── server/
│   └── index.js           # Express REST API & SPA static server
├── src/
│   ├── components/
│   │   ├── ChessBoard.js       # Interactive board, themes, & promotion modal
│   │   ├── ChessPiece.js       # Crisp vector SVG chess piece set
│   │   ├── GameOverModal.js    # Victory / Draw overlay dialog
│   │   └── GameSidebar.js      # Player cards, timers, captured pieces, move history
│   ├── utils/
│   │   ├── chessAI.js          # Minimax + Alpha-Beta pruning AI engine
│   │   └── soundEffects.js     # Web Audio API sound synthesizer
│   ├── App.js                  # Main game state orchestrator
│   ├── App.css                 # Glassmorphic dark styling & responsive grid
│   ├── App.test.js             # Unit tests
│   └── index.js                # React mount point
├── render.yaml            # Render blueprint deployment configuration
└── package.json           # Unified scripts for Render & dependencies
```

---

## 📜 Tech Stack

- **Frontend**: React 19, Vanilla CSS (Glassmorphism & animations), Web Audio API
- **Backend API**: Node.js, Express, CORS, `chess.js`
- **Deployment**: Render (Web Service / Blueprint)

---

## 📄 License

MIT License. Feel free to use, modify, and distribute this project.
