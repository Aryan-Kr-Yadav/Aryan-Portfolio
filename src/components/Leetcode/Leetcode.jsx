import { useEffect, useState, useCallback } from 'react';
import { FaTrophy, FaFire, FaGlobe, FaMedal, FaStar } from 'react-icons/fa';
import { leetcodeUsername, leetcodeBreakdown } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Leetcode.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 14000;
const HEATMAP_WEEKS    = 53;

// IMPORTANT: leetcode.com/graphql cannot be called directly from a browser —
// leetcode.com does not send CORS headers, so a `fetch()` to it from client-side
// JS is blocked by the browser before a response is ever seen (it silently
// fails, which is why a previous version of this component always showed
// "Unable to reach LeetCode API"). Both data sources below are CORS-enabled
// wrappers built specifically for browser use.

// Primary source: profile stats (solved counts, ranking, acceptance rate)
// and the submission calendar, in one call.
const STATS_API = 'https://leetcode-stats.tashif.codes';

// Secondary source: contest rating/ranking (not exposed by STATS_API), and a
// calendar fallback if the primary source is unavailable.
const ALFA_BASE = 'https://alfa-leetcode-api.onrender.com';

// ─────────────────────────────────────────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wraps fetch with a shared AbortController timeout.
 * Returns parsed JSON on success, null on any error (network, CORS, timeout,
 * non-2xx, or malformed JSON) — callers treat null as "source unavailable"
 * and never fabricate data in its place.
 */
async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;           // AbortError, NetworkError, CORS failure, JSON parse failure
  } finally {
    clearTimeout(timer);
  }
}

/** First defined, non-null value found under any of the given keys. Third-party
 *  LeetCode API wrappers don't agree on field names, so every known variant
 *  is checked rather than assuming one and silently showing nothing. */
function pick(obj, ...keys) {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING — all requests fire in parallel via Promise.all
// ─────────────────────────────────────────────────────────────────────────────

async function fetchLeetCodeData(username) {
  const [stats, contest, alfaCalendar] = await Promise.all([

    // 1. Primary — solved counts, ranking, acceptance rate, submission calendar
    safeFetch(`${STATS_API}/${username}`),

    // 2. Contest rating / ranking (independent — failing here doesn't block stats)
    safeFetch(`${ALFA_BASE}/${username}/contest`),

    // 3. Calendar fallback, only used if the primary source's calendar is missing
    safeFetch(`${ALFA_BASE}/${username}/calendar`),
  ]);

  return { stats, contest, alfaCalendar };
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSE PROFILE — extract clean stats from the API responses
// ─────────────────────────────────────────────────────────────────────────────

function parseProfile(stats, contest) {
  // The stats API returns { status: "error", ... } for unknown usernames,
  // and omits totalSolved entirely on other failure shapes — either way,
  // treat it as "no real data available" rather than guessing.
  if (!stats || stats.status === 'error' || stats.totalSolved == null) return null;

  const acceptanceRate = stats.acceptanceRate != null
    ? Number(stats.acceptanceRate).toFixed(1)
    : null;

  return {
    totalSolved:   stats.totalSolved   ?? 0,
    easySolved:    stats.easySolved    ?? 0,
    mediumSolved:  stats.mediumSolved  ?? 0,
    hardSolved:    stats.hardSolved    ?? 0,
    ranking:       stats.ranking       ?? null,
    acceptanceRate,
    contestRating:       pick(contest, 'contestRating', 'rating')                    ?? null,
    contestGlobalRank:   pick(contest, 'contestGlobalRanking', 'globalRanking')       ?? null,
    contestAttended:     pick(contest, 'contestAttend', 'attendedContestsCount')      ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP BUILDER
//
// Converts LeetCode's submissionCalendar (a JSON string of the form
//   { "1700000000": 3, "1700086400": 1, ... }
// where keys are UTC unix timestamps) into a 53-week × 7-day grid.
//
// TIMEZONE FIX: All date arithmetic uses UTC methods exclusively.
//   - Lookup keys are built with Date.UTC()
//   - Grid cell dates are constructed from UTC epoch offsets
//   - We never mix getFullYear() (local) with getUTCFullYear() (UTC)
// ─────────────────────────────────────────────────────────────────────────────

function buildHeatmapFromCalendar(rawCalendar) {
  if (!rawCalendar) return null;

  // Parse the JSON string if needed
  let cal;
  if (typeof rawCalendar === 'string') {
    try { cal = JSON.parse(rawCalendar); } catch { return null; }
  } else if (typeof rawCalendar === 'object') {
    cal = rawCalendar;
  } else {
    return null;
  }

  if (!cal || typeof cal !== 'object' || Object.keys(cal).length === 0) return null;

  // ── Build UTC-normalized lookup: day-start-UTC-ms → count ──
  // LeetCode timestamps are in seconds, at midnight UTC of each day.
  // We normalize defensively in case of any sub-day variation.
  const lookup = Object.create(null);
  for (const [tsStr, count] of Object.entries(cal)) {
    const ts = Number(tsStr);
    if (!Number.isFinite(ts) || ts <= 0) continue;

    // Snap to midnight UTC of this day
    const d       = new Date(ts * 1000);
    const dayKey  = Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate()
    );
    lookup[dayKey] = (lookup[dayKey] || 0) + Number(count);
  }

  // ── Grid alignment ──
  // We want 53 columns, where column 52 is the week containing today (UTC).
  // Column 0 starts on the Sunday 52 weeks before that.
  const nowUTC = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  );

  // Day-of-week offset so the grid starts on Sunday (0)
  const todayDow     = new Date(nowUTC).getUTCDay(); // 0=Sun … 6=Sat
  const thisSundayMs = nowUTC - todayDow * 86400000;
  const startMs      = thisSundayMs - (HEATMAP_WEEKS - 1) * 7 * 86400000;

  const grid = [];
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellMs  = startMs + (w * 7 + d) * 86400000;
      const count   = lookup[cellMs] || 0;
      const level   = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
      // Store a Date object for tooltip display (constructed from UTC ms)
      week.push({ level, count, date: new Date(cellMs) });
    }
    grid.push(week);
  }
  return grid;
}

// Month labels: one label per month-boundary in the 53-week grid.
// Uses UTC month so it matches the UTC-aligned grid cells.
function buildMonthLabels(grid) {
  if (!grid?.length) return [];
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun', 
                       'Jul','Aug','Sep','Oct','Nov','Dec'];
  const labels  = [];
  let lastMonth = -1;
  grid.forEach((week, wi) => {
    const month = week[0].date.getUTCMonth(); // UTC month, matching UTC grid
    if (month !== lastMonth) {
      labels.push({ label: MONTH_NAMES[month], col: wi });
      lastMonth = month;
    }
  });
  return labels;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// HTML structure, CSS classes, and all prop shapes are identical to before.
// Only the data-fetching layer and heatmap builder were replaced.
// ─────────────────────────────────────────────────────────────────────────────

export default function Leetcode() {
  const [ref, isVisible] = useReveal();

  // Separate loading flags so stats can show before calendar finishes
  const [loading,       setLoading]       = useState(true);
  const [calendarReady, setCalendarReady] = useState(false);

  // Derived stats — null until fetched
  const [stats,   setStats]   = useState(null);
  const [grid,    setGrid]    = useState(null);
  const [months,  setMonths]  = useState([]);
  const [tooltip, setTooltip] = useState(null);

  // Per-source error flags (independent — one failing doesn't kill the other)
  const [statsError,    setStatsError]    = useState(false);
  const [calendarError, setCalendarError] = useState(false);

  useEffect(() => {
    let cancelled = false; // guard against setting state after unmount

    fetchLeetCodeData(leetcodeUsername).then(({ stats, contest, alfaCalendar }) => {
      if (cancelled) return;

      // ── Stats ──
      const parsed = parseProfile(stats, contest);
      if (parsed) {
        setStats(parsed);
        setStatsError(false);
      } else {
        setStatsError(true);
      }

      // ── Submission calendar ──
      // Priority: primary stats API's calendar > alfa calendar > nothing (no fake data)
      const rawCal =
        stats?.submissionCalendar        ??   // primary source
        alfaCalendar?.submissionCalendar ??   // fallback source
        null;

      if (rawCal) {
        const builtGrid = buildHeatmapFromCalendar(rawCal);
        if (builtGrid) {
          setGrid(builtGrid);
          setMonths(buildMonthLabels(builtGrid));
          setCalendarError(false);
        } else {
          // Parsing failed — likely malformed data
          setCalendarError(true);
        }
      } else {
        // Neither API returned calendar data
        setCalendarError(true);
      }

      setCalendarReady(true);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []); // runs once on mount; username is stable for the lifetime of the app

  // ── Format helpers (identical behaviour to before) ──
  const fmtRank = (r) => {
    if (r == null) return '—';
    return typeof r === 'number' ? r.toLocaleString() : String(r);
  };

  const fmtRate = (r) => {
    if (r == null) return '—';
    const n = parseFloat(r);
    return isNaN(n) ? String(r) : `${n}%`;
  };

  // ── Derived display values ──
  const totalSolved   = stats?.totalSolved   ?? null;
  const easySolved    = stats?.easySolved    ?? 0;
  const mediumSolved  = stats?.mediumSolved  ?? 0;
  const hardSolved    = stats?.hardSolved    ?? 0;
  const ranking       = stats?.ranking       ?? null;
  const acceptanceRate= stats?.acceptanceRate ?? null;
  const contestRating = stats?.contestRating  ?? null;
  const globalRank    = stats?.contestGlobalRank ?? null;

  const diffTotal = (easySolved + mediumSolved + hardSolved) || 1;

  // ── Heatmap tooltip handlers ──
  const handleCellEnter = useCallback((e, cell) => {
    const rect    = e.target.getBoundingClientRect();
    // Use UTC date methods to match the UTC-built grid
    const dateStr = cell.date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      timeZone: 'UTC',
    });
    const text = cell.count === 0
      ? `No submissions on ${dateStr}`
      : `${cell.count} submission${cell.count > 1 ? 's' : ''} on ${dateStr}`;
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, text });
  }, []);

  const handleCellLeave = useCallback(() => setTooltip(null), []);

  // ── Status badge logic ──
  // Shows one of: loading / live / stats-only / error
  const statusMode = loading
    ? 'loading'
    : (!statsError && !calendarError)
      ? 'live'
      : (!statsError && calendarError)
        ? 'partial'
        : 'error';

  return (
    <section className="section leetcode" id="leetcode" data-edition="EDITION 07">
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <p className="section-label">Chapter Five</p>
          <h2 className="section-heading">LeetCode</h2>
          <p className="lc__sub">Solving one problem at a time.</p>

          {/* ── Status indicator ── */}
          {statusMode === 'loading' && (
            <div className="lc__status">
              <span className="lc__status-dot lc__status-dot--loading"/>
              Fetching live LeetCode data for {leetcodeUsername}…
            </div>
          )}
          {statusMode === 'live' && (
            <div className="lc__status lc__status--live">
              <span className="lc__status-dot lc__status-dot--live"/>
              Live data · {leetcodeUsername}
            </div>
          )}
          {statusMode === 'partial' && (
            <div className="lc__status lc__status--warn">
              <span className="lc__status-dot lc__status-dot--warn"/>
              Profile stats live · submission calendar unavailable
            </div>
          )}
          {statusMode === 'error' && (
            <div className="lc__status lc__status--warn">
              <span className="lc__status-dot lc__status-dot--warn"/>
              Live LeetCode data is temporarily unavailable.
            </div>
          )}

          {/* ── Stats row — identical structure to before ── */}
          <div className="lc__stats">
            {[
              { icon: FaTrophy, label: 'Problems Solved', value: totalSolved,                        accent: true },
              { icon: FaGlobe,  label: 'Global Ranking',  value: fmtRank(ranking) },
              { icon: FaStar,   label: 'Contest Rating',  value: contestRating != null ? Math.round(contestRating) : '—' },
              { icon: FaFire,   label: 'Acceptance Rate', value: fmtRate(acceptanceRate) },
            ].map(s => (
              <div key={s.label} className={`lc__stat ${s.accent ? 'lc__stat--accent' : ''}`}>
                <s.icon className="lc__stat-icon"/>
                <div>
                  <p className="lc__stat-val">
                    {loading ? '…' : (s.value ?? '—')}
                  </p>
                  <p className="lc__stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Main panel: heatmap + breakdown — identical structure ── */}
          <div className="lc__panel">

            {/* Contribution heatmap */}
            <div className="lc__heatmap-card">
              <div className="lc__heatmap-header">
                <span className="lc__heatmap-title">Submission Activity</span>
                <span className="lc__heatmap-period">Past 12 months</span>
              </div>

              {/* Heatmap: shown only when real data is available */}
              {calendarReady && !calendarError && grid ? (
                <>
                  {/*
                    Month labels + weekday col + grid share ONE horizontal
                    scroll region (mirrors GitHub's calendar widget) so the
                    month labels stay aligned with the columns beneath them
                    as the user scrolls on narrow viewports. On desktop the
                    content already fits, so no scrollbar appears and
                    nothing here is visibly different.
                  */}
                  <div className="lc__heatmap-scroll">
                    {/* Month labels */}
                    <div className="lc__month-row">
                      <div className="lc__month-spacer"/>
                      <div className="lc__month-labels">
                        {months.map((m, i) => (
                          <span
                            key={i}
                            className="lc__month-label"
                            style={{ left: `${m.col * 13}px` }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lc__heatmap-body">
                      {/* Weekday labels */}
                      <div className="lc__weekday-col">
                        <span className="lc__wd"/>
                        <span className="lc__wd">Mon</span>
                        <span className="lc__wd"/>
                        <span className="lc__wd">Wed</span>
                        <span className="lc__wd"/>
                        <span className="lc__wd">Fri</span>
                        <span className="lc__wd"/>
                      </div>

                      {/* Cell grid */}
                      <div className={`lc__grid ${isVisible ? 'lc__grid--show' : ''}`}>
                        {grid.map((week, wi) => (
                          <div key={wi} className="lc__col">
                            {week.map((cell, di) => (
                              <span
                                key={di}
                                className={`lc__cell lc__cell--${cell.level}`}
                                style={{ transitionDelay: `${(wi * 2 + di * 0.5) * 4}ms` }}
                                onMouseEnter={e => handleCellEnter(e, cell)}
                                onMouseLeave={handleCellLeave}
                                aria-label={`${cell.count} submissions`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="lc__legend">
                    <span className="lc__legend-text">Less</span>
                    {[0, 1, 2, 3].map(l => (
                      <span key={l} className={`lc__legend-cell lc__cell--${l}`}/>
                    ))}
                    <span className="lc__legend-text">More</span>
                  </div>
                </>
              ) : calendarReady && calendarError ? (
                /* Honest placeholder — no fake data, no random grid */
                <div className="lc__calendar-unavailable">
                  <p className="lc__calendar-unavailable-msg">
                    Live LeetCode data is temporarily unavailable.
                  </p>
                  <p className="lc__calendar-unavailable-sub">
                    Visit{' '}
                    <a
                      href={`https://leetcode.com/${leetcodeUsername}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="lc__calendar-link"
                    >
                      leetcode.com/{leetcodeUsername}
                    </a>
                    {' '}to view your full submission history.
                  </p>
                </div>
              ) : (
                /* Still loading calendar */
                <div className="lc__calendar-unavailable">
                  <p className="lc__calendar-unavailable-msg">Loading submission calendar…</p>
                </div>
              )}

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="lc__tooltip"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  {tooltip.text}
                </div>
              )}
            </div>

            {/* Breakdown sidebar — identical structure to before */}
            <div className="lc__breakdown">
              <h4>Problem Breakdown</h4>

              {[
                { label: 'Easy',   count: easySolved,  color: '#5B8A6F', pct: Math.round(easySolved  / diffTotal * 100) },
                { label: 'Medium', count: mediumSolved, color: '#C99A3D', pct: Math.round(mediumSolved / diffTotal * 100) },
                { label: 'Hard',   count: hardSolved,   color: '#A8462F', pct: Math.round(hardSolved   / diffTotal * 100) },
              ].map(b => (
                <div key={b.label} className="lc__break-row">
                  <div className="lc__break-top">
                    <span className="lc__break-dot" style={{ background: b.color }}/>
                    <span className="lc__break-label">{b.label}</span>
                    <span className="lc__break-count">
                      {loading ? '…' : b.count}
                    </span>
                  </div>
                  <div className="lc__break-bar">
                    <div
                      className="lc__break-fill"
                      style={{
                        width: isVisible && !loading ? `${b.pct}%` : '0',
                        background: b.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Donut ring */}
              <div className="lc__total-ring">
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="var(--divider)" strokeWidth="6"/>
                  <circle
                    cx="40" cy="40" r="30" fill="none"
                    stroke="var(--accent-brown)" strokeWidth="6"
                    strokeDasharray={`${
                      isVisible && !loading && totalSolved != null
                        ? Math.min(Math.round(totalSolved / 250 * 188), 188)
                        : 0
                    } 188`}
                    strokeDashoffset="47"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.4s var(--ease)' }}
                  />
                </svg>
                <div className="lc__total-text">
                  <p className="lc__total-num">
                    {loading ? '…' : (totalSolved ?? '—')}
                  </p>
                  <p className="lc__total-sub">Solved</p>
                </div>
              </div>

              {/* Contest stats — only rendered when data actually exists */}
              {(contestRating != null || globalRank != null) && (
                <div className="lc__extra-stats">
                  {contestRating != null && (
                    <div className="lc__extra-row">
                      <span className="lc__extra-label">Contest Rating</span>
                      <span className="lc__extra-val">{Math.round(contestRating)}</span>
                    </div>
                  )}
                  {globalRank != null && (
                    <div className="lc__extra-row">
                      <span className="lc__extra-label">Contest Rank</span>
                      <span className="lc__extra-val">{fmtRank(globalRank)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
