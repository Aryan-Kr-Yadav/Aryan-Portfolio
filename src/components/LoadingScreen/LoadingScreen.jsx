import { useEffect, useState } from 'react';
import './LoadingScreen.css';

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN — shows ONLY on the first page load per browser session.
// sessionStorage key 'np_seen' is set after it completes, so refreshing the
// page (same tab) skips it. Opening a new tab shows it again.
//
// Sequence:
//   0ms     → mounted, name + label fade in, progress line begins filling
//   ~2200ms → progress line finishes filling
//   2200ms  → 'exit' phase → whole overlay fades out (~450ms)
//   2650ms  → onComplete() fires → component unmounts, site is revealed
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY   = 'np_seen';
const LOAD_MS        = 2200;
const FADE_MS        = 450;

export default function LoadingScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false);

  // Check prefers-reduced-motion at render time (server-safe guard)
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check whether we've already shown the loader this session
  const alreadySeen =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem(STORAGE_KEY) === '1';

  useEffect(() => {
    // Skip entirely if reduced-motion requested OR already seen this session
    if (prefersReduced || alreadySeen) {
      onComplete();
      return;
    }

    // Mark as seen immediately so hot-reload / navigation doesn't re-trigger
    sessionStorage.setItem(STORAGE_KEY, '1');

    const t1 = setTimeout(() => setExiting(true), LOAD_MS);
    const t2 = setTimeout(() => onComplete(),      LOAD_MS + FADE_MS);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // intentionally empty — run once on mount

  // Don't render anything if we're skipping
  if (prefersReduced || alreadySeen) return null;

  return (
    <div
      className={`loading-screen ${exiting ? 'loading-screen--exit' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="loading-screen__inner">
        <p className="loading-screen__name">ARYAN</p>
        <p className="loading-screen__label">Loading Portfolio&hellip;</p>
        <div className="loading-screen__bar">
          <div className="loading-screen__bar-fill" />
        </div>
      </div>
    </div>
  );
}
