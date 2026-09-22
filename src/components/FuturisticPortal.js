import React, { useState, useCallback, useRef, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

export const SOFT_THEMES = [
  { id: 'linen',    bg: '#f8f6f0' },
  { id: 'sage',     bg: '#eef3ee' },
  { id: 'lavender', bg: '#f2eff8' },
  { id: 'azure',    bg: '#edf4f8' },
  { id: 'peach',    bg: '#fbf0ea' },
  { id: 'rose',     bg: '#f8eef1' },
  { id: 'stone',    bg: '#f3f3f2' },
];

// ── Milestone definitions ──────────────────────────────────────────────────────
const MILESTONES = [
  { at: 0,   msg: 'There is absolutely nothing useful here.',           btn: 'DO NOT CLICK',          effect: null          },
  { at: 1,   msg: 'You clicked it.',                                    btn: 'DO NOT CLICK AGAIN',    effect: null          },
  { at: 2,   msg: 'Interesting choice.',                                btn: 'OR DO YOU?',            effect: null          },
  { at: 3,   msg: 'Why are you doing this?',                            btn: "I SAID DON'T",          effect: 'wiggle'      },
  { at: 5,   msg: 'Okay, this is becoming a problem.',                  btn: 'PLEASE STOP',           effect: 'shake'       },
  { at: 7,   msg: "I'm literally begging you.",                         btn: 'JUST ONE MORE?',        effect: 'wiggle'      },
  { at: 10,  msg: 'STOP.',                                              btn: 'NO.',                   effect: 'shake-hard'  },
  { at: 13,  msg: 'This button has a family.',                          btn: 'HAVE MERCY',            effect: null          },
  { at: 15,  msg: 'You absolute menace.',                               btn: 'WHY ARE YOU LIKE THIS', effect: 'wiggle'      },
  { at: 20,  msg: 'I have asked you nicely.',                           btn: 'YOU MONSTER',           effect: 'shake'       },
  { at: 25,  msg: "I've informed the authorities.",                     btn: 'TOO LATE NOW',          effect: null          },
  { at: 30,  msg: "Do you feel powerful? You shouldn't.",               btn: 'DO IT AGAIN COWARD',    effect: 'wiggle'      },
  { at: 40,  msg: "At this point I'm just watching.",                   btn: 'FINE. CLICK ME.',       effect: null          },
  { at: 50,  msg: 'Fine. You win.',                                     btn: 'YOU WIN. HAPPY?',       effect: 'confetti'    },
  { at: 60,  msg: 'Actually, are you okay?',                            btn: 'SOMEONE HELP THEM',     effect: null          },
  { at: 75,  msg: 'Achievement Unlocked: You Have No Self-Control.',    btn: 'SEND HELP',             effect: 'achievement' },
  { at: 100, msg: '100 clicks. A legend of our time. Truly.',           btn: 'A TRUE LEGEND',         effect: 'confetti'    },
  { at: 150, msg: "At this point you're basically a developer.",        btn: 'SHIP IT',               effect: null          },
  { at: 200, msg: "I don't know what to say anymore.",                  btn: '...',                   effect: 'confetti'    },
];

function getMilestone(count) {
  let result = MILESTONES[0];
  for (const m of MILESTONES) {
    if (count >= m.at) result = m;
    else break;
  }
  return result;
}

// ── Confetti system ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#f59e0b','#10b981','#6366f1','#f43f5e','#0ea5e9','#a78bfa','#fb923c','#34d399'];

function spawnConfetti(count = 60) {
  const container = document.getElementById('confetti-layer');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.style.setProperty('--x', `${Math.random() * 100}vw`);
    el.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    el.style.setProperty('--duration', `${0.9 + Math.random() * 0.8}s`);
    el.style.setProperty('--color', CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]);
    el.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    el.style.setProperty('--size', `${6 + Math.random() * 8}px`);
    container.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

const BURST_EMOJIS = ['✨','🎉','💥','⚡','🌀','😤','🤡','💫','🎯','🔥','😱','🫠','💀','🎊','😈'];

// ── Component ──────────────────────────────────────────────────────────────────
export default function FuturisticPortal({
  onOpenChess,
  themeIndex = 0,
  onThemeChange,
  themes = SOFT_THEMES,
}) {
  const [clickCount, setClickCount] = useState(0);
  const [localThemeIndex, setLocalThemeIndex] = useState(themeIndex);
  const [shockwaveKey, setShockwaveKey] = useState(0);
  const [particles, setParticles] = useState([]);
  const [screenEffect, setScreenEffect] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [milestoneKey, setMilestoneKey] = useState(0);
  const particleIdRef = useRef(0);
  const prevMilestoneAtRef = useRef(0);

  const activeThemeIndex = onThemeChange ? themeIndex : localThemeIndex;
  const currentTheme = themes[activeThemeIndex % themes.length] || SOFT_THEMES[0];
  const milestone = getMilestone(clickCount);

  // intensity tier 0-4
  const intensity = clickCount >= 100 ? 4 : clickCount >= 50 ? 3 : clickCount >= 20 ? 2 : clickCount >= 10 ? 1 : 0;

  useEffect(() => {
    if (!screenEffect) return;
    const t = setTimeout(() => setScreenEffect(null), 700);
    return () => clearTimeout(t);
  }, [screenEffect]);

  useEffect(() => {
    if (!achievement) return;
    const t = setTimeout(() => setAchievement(null), 4000);
    return () => clearTimeout(t);
  }, [achievement]);

  const handleClick = useCallback((e) => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (sounds.playCyberZap) sounds.playCyberZap();
    else sounds.playMove?.();

    if (onThemeChange) onThemeChange((p) => (p + 1) % themes.length);
    else setLocalThemeIndex((p) => (p + 1) % themes.length);

    setShockwaveKey((k) => k + 1);

    // Milestone effect
    const next = getMilestone(nextCount);
    if (next.at !== prevMilestoneAtRef.current) {
      setMilestoneKey((k) => k + 1);
      switch (next.effect) {
        case 'shake':       setScreenEffect('shake');      break;
        case 'shake-hard':  setScreenEffect('shake-hard'); break;
        case 'confetti':    spawnConfetti(70);             break;
        case 'achievement': spawnConfetti(55); setAchievement(next.msg); break;
        default: break;
      }
      prevMilestoneAtRef.current = next.at;
    }

    // Burst particles (scale with clicks)
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const burstCount = Math.min(2 + Math.floor(nextCount / 10), 10);
    const newP = [];
    for (let i = 0; i < burstCount; i++) {
      const id = ++particleIdRef.current;
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const dist = 50 + Math.random() * 110;
      newP.push({
        id,
        emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
        x: cx, y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 60,
        rot: (Math.random() - 0.5) * 60,
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    setParticles((prev) => [...prev, ...newP]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => !newP.some((n) => n.id === p.id))), 1200);
  }, [clickCount, onThemeChange, themes.length]);

  return (
    <div className={`portal-stage theme-${currentTheme.id} ${screenEffect ? `screen-${screenEffect}` : ''}`}>
      {/* Confetti DOM layer */}
      <div id="confetti-layer" className="confetti-layer" aria-hidden="true" />

      {/* Burst particles */}
      <div className="portal-emoji-layer" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="burst-emoji"
            style={{
              left: `${p.x}px`, top: `${p.y}px`,
              '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`, '--scale': p.scale,
            }}
          >{p.emoji}</span>
        ))}
      </div>

      {/* Achievement toast */}
      {achievement && (
        <div className="achievement-toast" role="alert">
          <span className="achievement-icon">🏆</span>
          <span className="achievement-text">{achievement}</span>
        </div>
      )}

      {/* Main content */}
      <main className="portal-content">

        {/* Headline — fixed height, no wrap */}
        <div className="portal-title-wrapper">
          <h1 className={`huge-portal-title intensity-title-${intensity}`}>
            Hello, World!
          </h1>
        </div>

        {/* Milestone message */}
        <div className="message-card" key={milestoneKey}>
          <p className="milestone-message">{milestone.msg}</p>
        </div>

        {/* Button */}
        <div className="hazard-zone">
          {shockwaveKey > 0 && (
            <div key={shockwaveKey} className="hazard-shockwave" aria-hidden="true" />
          )}
          <button
            type="button"
            key={`btn-${milestone.at}`}
            className={`do-not-click-btn intensity-btn-${intensity} ${milestone.effect === 'wiggle' ? 'wiggle-anim' : ''}`}
            onClick={handleClick}
            aria-label={milestone.btn}
          >
            <span className="btn-hazard-dot" aria-hidden="true" />
            <span className="btn-label">{milestone.btn}</span>
          </button>
        </div>

        {/* Counter */}
        <div className="defiance-counter-card">
          <span className="counter-eyebrow">TIMES CLICKED</span>
          <div className="counter-reading">
            <span className="counter-digits" key={clickCount}>{clickCount}</span>
            <span className="counter-metric">{clickCount === 1 ? 'time' : 'times'}</span>
          </div>
          <div className="counter-progress-bar">
            <div
              className="counter-fill"
              style={{ transform: `scaleX(${Math.min(1, clickCount / 50)})` }}
            />
          </div>
        </div>

        {/* Chess link */}
        {onOpenChess && (
          <div className="portal-footer-link">
            <button type="button" className="quick-chess-launch-btn" onClick={onOpenChess}>
              <span className="launch-icon">♟️</span>
              <span>Open Chess Arena</span>
              <span className="launch-arrow">→</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}