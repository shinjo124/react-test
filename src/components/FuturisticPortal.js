import React, { useState, useCallback, useRef } from 'react';
import { sounds } from '../utils/soundEffects';

export const SOFT_THEMES = [
  { id: 'linen', label: 'WARM LINEN', bg: '#f8f6f0' },
  { id: 'sage', label: 'MUTED SAGE', bg: '#eef3ee' },
  { id: 'lavender', label: 'LAVENDER HAZE', bg: '#f2eff8' },
  { id: 'azure', label: 'ICE AZURE', bg: '#edf4f8' },
  { id: 'peach', label: 'SOFT PEACH', bg: '#fbf0ea' },
  { id: 'rose', label: 'ROSE MIST', bg: '#f8eef1' },
  { id: 'stone', label: 'MINIMAL STONE', bg: '#f3f3f2' },
];

export const GREETINGS = [
  'Hello, World!',
  'Hello, Internet!',
  'Hello, You!',
];

const EMOJI_POOL = [
  '✨', '♟️', '🪐', '☕', '⚡', '🌿', '🔮', '🫧',
  '🎨', '🕊️', '💫', '🎯', '💎', '🌙', '🌊', '👑'
];

export default function FuturisticPortal({
  onOpenChess,
  themeIndex = 0,
  onThemeChange,
  themes = SOFT_THEMES,
}) {
  const [clickCount, setClickCount] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [localThemeIndex, setLocalThemeIndex] = useState(themeIndex);
  const [emojis, setEmojis] = useState([]);
  const [shockwaveKey, setShockwaveKey] = useState(0);

  const emojiIdRef = useRef(0);

  const activeThemeIndex = onThemeChange ? themeIndex : localThemeIndex;
  const currentTheme = themes[activeThemeIndex % themes.length] || SOFT_THEMES[0];
  const currentGreeting = GREETINGS[textIndex % GREETINGS.length];

  const handleDefianceClick = useCallback((e) => {
    // 1. Play subtle audio pulse
    if (sounds.playCyberZap) {
      sounds.playCyberZap();
    } else {
      sounds.playMove();
    }

    // 2. Increment defiance counter
    setClickCount((prev) => prev + 1);

    // 3. Cycle greeting text
    setTextIndex((prev) => (prev + 1) % GREETINGS.length);

    // 4. Change background theme
    if (onThemeChange) {
      onThemeChange((prev) => (prev + 1) % themes.length);
    } else {
      setLocalThemeIndex((prev) => (prev + 1) % themes.length);
    }

    // 5. Trigger subtle shockwave
    setShockwaveKey((k) => k + 1);

    // 6. Spawn floating emojis around the button
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const count = 2;
    const newItems = [];

    for (let i = 0; i < count; i++) {
      const id = ++emojiIdRef.current;
      const emoji = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 60; // drift upward
      const rot = (Math.random() - 0.5) * 40;
      const scale = 0.85 + Math.random() * 0.4;

      newItems.push({
        id,
        emoji,
        x: centerX,
        y: centerY,
        dx,
        dy,
        rot,
        scale,
      });
    }

    setEmojis((prev) => [...prev, ...newItems]);

    // Clean up emojis after animation completes
    setTimeout(() => {
      setEmojis((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 1100);
  }, [onThemeChange, themes.length]);

  return (
    <div className={`portal-stage theme-${currentTheme.id}`}>
      {/* Subtle organic light accent */}
      <div className="portal-ambient-glow" aria-hidden="true" />

      {/* Minimal Telemetry HUD */}
      <div className="portal-hud top-hud">
        <div className="hud-badge">
          <span className="hud-dot" />
          <span className="hud-mono">STATUS: ACTIVE</span>
        </div>
        <div className="hud-badge secondary">
          <span className="hud-mono">TONE: {currentTheme.label}</span>
        </div>
      </div>

      {/* Floating Emojis Layer */}
      <div className="portal-emoji-layer" aria-hidden="true">
        {emojis.map((item) => (
          <span
            key={item.id}
            className="burst-emoji"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              '--dx': `${item.dx}px`,
              '--dy': `${item.dy}px`,
              '--rot': `${item.rot}deg`,
              '--scale': item.scale,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <main className="portal-content">
        {/* Strictly fixed-height title wrapper to prevent layout shift */}
        <div className="portal-title-wrapper">
          <h1 className="huge-portal-title">
            {currentGreeting}
          </h1>
          <p className="portal-caption">
            System reality protocol engaged. Do not alter core parameters.
          </p>
        </div>

        {/* Compact Hazard Action Button */}
        <div className="hazard-zone">
          {shockwaveKey > 0 && (
            <div key={shockwaveKey} className="hazard-shockwave" aria-hidden="true" />
          )}

          <button
            type="button"
            className="do-not-click-btn"
            onClick={handleDefianceClick}
            aria-label="Do not click button"
          >
            <span className="btn-hazard-dot" aria-hidden="true" />
            <span className="btn-label">DO NOT CLICK</span>
          </button>
        </div>

        {/* Simplistic Defiance Counter */}
        <div className="defiance-counter-card">
          <span className="counter-eyebrow">DEFIANCE LEVEL</span>
          <div className="counter-reading">
            <span className="counter-digits" key={clickCount}>
              {clickCount.toString().padStart(2, '0')}
            </span>
            <span className="counter-metric">
              {clickCount === 1 ? 'VIOLATION' : 'VIOLATIONS'}
            </span>
          </div>
          <div className="counter-progress-bar">
            <div
              className="counter-fill"
              style={{ transform: `scaleX(${Math.min(1, clickCount / 10)})` }}
            />
          </div>
        </div>

        {/* Quick link to Chess */}
        {onOpenChess && (
          <div className="portal-footer-link">
            <button
              type="button"
              className="quick-chess-launch-btn"
              onClick={onOpenChess}
            >
              <span className="launch-icon">♟️</span>
              <span>Open Grandmaster Chess Arena</span>
              <span className="launch-arrow">→</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Telemetry HUD */}
      <div className="portal-hud bottom-hud">
        <span className="hud-mono">COORDINATES: 0x7F // SECTOR 9</span>
        <span className="hud-mono">SYSTEM: NORMAL</span>
      </div>
    </div>
  );
}
