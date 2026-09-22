import React, { useState, useCallback, useRef, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

const GREETINGS = [
  'HELLO, WORLD!',
  'HELLO, INTERNET!',
  'HELLO, YOU!',
  'HELLO, MULTIVERSE!',
  'HELLO, CYBERSPACE!',
  'HELLO, TIME TRAVELER!',
  'HELLO, QUANTUM BEING!',
];

const THEMES = [
  { id: 'cyber-void', label: 'CYBER VOID', accent: '#06b6d4' },
  { id: 'neon-hyperdrive', label: 'NEON HYPERDRIVE', accent: '#a855f7' },
  { id: 'solar-core', label: 'SOLAR SINGULARITY', accent: '#f59e0b' },
  { id: 'matrix-phosphor', label: 'MATRIX PHOSPHOR', accent: '#10b981' },
  { id: 'crimson-paradox', label: 'CRIMSON OVERDRIVE', accent: '#f43f5e' },
  { id: 'synthwave-horizon', label: 'SYNTHWAVE HORIZON', accent: '#ec4899' },
];

const EMOJI_POOL = [
  '🚀', '🤖', '⚡', '🔮', '👾', '🌌', '💥', '🧬',
  '🛸', '☢️', '🧿', '🔥', '🪐', '💫', '🧨', '💎',
  '♟️', '👑'
];

export default function FuturisticPortal({ onOpenChess }) {
  const [clickCount, setClickCount] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [emojis, setEmojis] = useState([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [shockwaveKey, setShockwaveKey] = useState(0);

  const emojiIdRef = useRef(0);
  const glitchTimerRef = useRef(null);

  // Clean up emoji particles and timer on unmount
  useEffect(() => {
    return () => {
      if (glitchTimerRef.current) {
        clearTimeout(glitchTimerRef.current);
      }
    };
  }, []);

  const handleDefianceClick = useCallback((e) => {
    // 1. Play synth sound if available
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
    setThemeIndex((prev) => (prev + 1) % THEMES.length);

    // 5. Trigger animation shockwave & glitch
    setShockwaveKey((k) => k + 1);
    setIsGlitching(true);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 450);

    // 6. Spawn random floating emojis around the button
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const count = Math.floor(Math.random() * 2) + 2; // 2 to 3 emojis per click
    const newItems = [];

    for (let i = 0; i < count; i++) {
      const id = ++emojiIdRef.current;
      const emoji = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
      // Spread angle
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = 80 + Math.random() * 120;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 80; // bias upward
      const rot = (Math.random() - 0.5) * 60;
      const scale = 0.8 + Math.random() * 0.7;

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

    // Schedule cleanup of these emojis
    setTimeout(() => {
      setEmojis((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 1100);
  }, []);

  const currentTheme = THEMES[themeIndex];
  const currentGreeting = GREETINGS[textIndex];

  return (
    <div
      className={`portal-stage theme-${currentTheme.id} ${isGlitching ? 'portal-glitch-active' : ''}`}
      style={{ '--theme-accent': currentTheme.accent }}
    >
      {/* Dynamic Cyber Grid & Star Horizon */}
      <div className="portal-grid-overlay" aria-hidden="true" />
      <div className="portal-ambient-glow" aria-hidden="true" />
      <div className="portal-scanline" aria-hidden="true" />

      {/* Futuristic Telemetry HUD */}
      <div className="portal-hud top-hud">
        <div className="hud-badge">
          <span className="hud-dot" />
          <span className="hud-mono">CORE STATUS: STABLE</span>
        </div>
        <div className="hud-badge secondary">
          <span className="hud-mono">THEME: {currentTheme.label}</span>
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

      {/* Main Hero Content */}
      <main className="portal-content">
        <div className="portal-title-wrapper">
          <h1
            className={`huge-portal-title ${isGlitching ? 'title-shake' : ''}`}
            data-text={currentGreeting}
          >
            {currentGreeting}
          </h1>
          <p className="portal-caption">
            System reality protocol engaged. Do not alter core parameters.
          </p>
        </div>

        {/* Hazard Action Button */}
        <div className="hazard-zone">
          {shockwaveKey > 0 && (
            <div key={shockwaveKey} className="hazard-shockwave" aria-hidden="true" />
          )}

          <button
            type="button"
            className={`do-not-click-btn ${isGlitching ? 'btn-defiance-active' : ''}`}
            onClick={handleDefianceClick}
            aria-label="Do not click button"
          >
            <span className="btn-hazard-stripes" aria-hidden="true" />
            <span className="btn-icon">⚠️</span>
            <span className="btn-label">DO NOT CLICK</span>
            <span className="btn-glow-ring" aria-hidden="true" />
          </button>
        </div>

        {/* Defiance Counter Display */}
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

        {/* Subtle quick launcher to Chess */}
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
        <span className="hud-mono">QUANTUM ANOMALY DETECTOR: ACTIVE</span>
      </div>
    </div>
  );
}
