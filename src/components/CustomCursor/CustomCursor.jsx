import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM FOUNTAIN PEN CURSOR
//
// Replaces the native cursor with a vintage fountain-pen nib on desktop/mouse
// devices. Entirely disabled on touch devices (phones, tablets) — the normal
// mobile experience is untouched.
//
// Performance notes:
//   - Position is written directly to the DOM (style.transform) inside a
//     requestAnimationFrame loop, using refs — never React state — so mouse
//     movement never triggers a re-render.
//   - Hover/press are toggled via classList directly on the DOM node for the
//     same reason; the only React state in this file is a single one-time
//     "is this a touch device" flag decided on mount.
//   - Trail dots and click ripples are plain DOM nodes appended/removed
//     directly, capped in number, so they can't accumulate or affect FPS.
// ─────────────────────────────────────────────────────────────────────────────

// Elements the pen should react to with a hover tilt.
const HOVER_SELECTOR = [
  'a', 'button', '[role="button"]', 'input', 'textarea', 'select',
  '.proj-card', '.github__repo', '.lc__stat', '.lc__cell',
].join(', ');

const SMOOTHING_MS   = 100;   // ~80–120ms Apple-style smoothing
const MAX_TILT_DEG   = 8;     // subtle velocity-based tilt, never spins
const TRAIL_MIN_GAP  = 55;    // ms between trail dots while moving fast
const TRAIL_SPEED_PX = 9;     // px/frame-ish threshold to start leaving a trail
const MAX_TRAIL_DOTS = 14;    // hard cap so the trail can never become excessive

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const posRef      = useRef(null);   // outer layer: JS-driven position + tilt
  const penRef       = useRef(null);   // inner layer: hover/press CSS states
  const rippleLayerRef = useRef(null);

  useEffect(() => {
    // Touch/coarse-pointer devices keep the normal mobile experience —
    // don't attach anything, don't hide the native cursor.
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    const target  = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let targetAngle  = 0;
    let currentAngle = 0;
    let lastMove = performance.now();
    let lastTrailAt = 0;
    let trailCount = 0;
    let rafId;

    const onMouseMove = e => {
      const now = performance.now();
      const dt  = Math.max(1, now - lastMove);
      const dx  = e.clientX - target.x;
      const dy  = e.clientY - target.y;
      const speed = Math.hypot(dx, dy) / dt * 16.6; // normalize to ~px/frame

      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = now;

      // Subtle tilt from horizontal velocity only — a simple clamped linear
      // scale, so it can never wrap around or spin, just gently lean.
      const vx = dx / dt; // px/ms
      targetAngle = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, vx * 6));

      // Faint ink trail while moving quickly — throttled and capped.
      if (speed > TRAIL_SPEED_PX && now - lastTrailAt > TRAIL_MIN_GAP && trailCount < MAX_TRAIL_DOTS) {
        spawnTrailDot(current.x, current.y);
        lastTrailAt = now;
        trailCount++;
        setTimeout(() => { trailCount--; }, 500);
      }
    };

    const spawnTrailDot = (x, y) => {
      const dot = document.createElement('div');
      dot.className = 'cc-trail-dot';
      dot.style.left = `${x + (Math.random() - 0.5) * 3}px`;
      dot.style.top  = `${y + (Math.random() - 0.5) * 3}px`;
      rippleLayerRef.current?.appendChild(dot);
      setTimeout(() => dot.remove(), 520);
    };

    const onMouseDown = e => {
      penRef.current?.classList.add('cc-pen--pressed');

      const droplet = document.createElement('div');
      droplet.className = 'cc-droplet';
      droplet.style.left = `${e.clientX}px`;
      droplet.style.top  = `${e.clientY}px`;

      const ripple = document.createElement('div');
      ripple.className = 'cc-ink-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top  = `${e.clientY}px`;

      rippleLayerRef.current?.appendChild(droplet);
      rippleLayerRef.current?.appendChild(ripple);
      setTimeout(() => { droplet.remove(); ripple.remove(); }, 320);
    };

    const onMouseUp = () => {
      penRef.current?.classList.remove('cc-pen--pressed');
    };

    const onMouseOver = e => {
      if (e.target.closest?.(HOVER_SELECTOR)) {
        penRef.current?.classList.add('cc-pen--hover');
      }
    };
    const onMouseOut = e => {
      if (e.target.closest?.(HOVER_SELECTOR) && !e.relatedTarget?.closest?.(HOVER_SELECTOR)) {
        penRef.current?.classList.remove('cc-pen--hover');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup',   onMouseUp,   { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout',  onMouseOut,  { passive: true });

    let lastFrame = performance.now();
    const IDLE_MS = 120; // if no mousemove for this long, ease tilt back to level
    const tick = now => {
      const dt = now - lastFrame;
      lastFrame = now;

      // Frame-rate independent exponential smoothing (~SMOOTHING_MS to settle)
      const factor = 1 - Math.exp(-dt / SMOOTHING_MS);
      current.x += (target.x - current.x) * factor;
      current.y += (target.y - current.y) * factor;

      // Once the pointer has been still for a moment, relax the tilt back
      // to level rather than leaving it stuck at the last movement angle.
      const angleGoal = (now - lastMove > IDLE_MS) ? 0 : targetAngle;
      const angleFactor = 1 - Math.exp(-dt / 90);
      currentAngle += (angleGoal - currentAngle) * angleFactor;

      if (posRef.current) {
        posRef.current.style.transform =
          `translate3d(${current.x}px, ${current.y}px, 0) rotate(${currentAngle.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup',   onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout',  onMouseOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={posRef} className="cc-pos">
        <div ref={penRef} className="cc-pen">
          <FountainPenSVG />
        </div>
      </div>
      <div ref={rippleLayerRef} className="cc-ripple-layer" aria-hidden="true" />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vintage fountain pen nib — matte black body, subtle gold accents.
// Drawn tip-first: the point (the cursor hotspot) sits at (3,3) in local
// coordinates, matching transform-origin and the -3px margin nudge in CSS,
// so rotation pivots around the actual pointer position rather than the
// glyph's bounding box.
// ─────────────────────────────────────────────────────────────────────────────
function FountainPenSVG() {
  return (
    <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nib body — matte black, tapering to a point at the top-left */}
      <path
        d="M3 3
           C 6 9, 11 14, 16 19
           C 20 23, 23 27, 24.5 31
           C 25.3 33, 24.5 34.5, 22.8 33.6
           C 18.5 31.3, 13.5 27, 9.5 22
           C 6 17.6, 3.6 12, 3 3 Z"
        fill="#1B1B1B"
      />
      {/* Center slit, running down to the tip */}
      <path
        className="cc-pen__gold"
        d="M4.2 4.5 L21.5 32.2"
        stroke="#C99A3D"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      {/* Breather hole */}
      <circle className="cc-pen__gold" cx="15.5" cy="20" r="1.3" stroke="#C99A3D" strokeWidth="0.7" fill="#1B1B1B" />
      {/* Gold collar band near the grip end, suggesting a metal ferrule */}
      <path
        className="cc-pen__gold"
        d="M8 10.5 C 10.4 13.4, 12.8 16, 15 18.2"
        stroke="#C99A3D"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
