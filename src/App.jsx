import { useState, useCallback, useEffect } from 'react';
import LoadingScreen         from './components/LoadingScreen/LoadingScreen';
import BreakingTicker        from './components/BreakingTicker/BreakingTicker';
import Navigation            from './components/Navigation/Navigation';
import Header                from './components/Header/Header';
import ProfileSection        from './components/Profile/ProfileSection';
import Experience            from './components/Experience/Experience';
import SkillsProjectsSection from './components/Skills/SkillsProjectsSection';
import Github                from './components/Github/Github';
import Leetcode              from './components/Leetcode/Leetcode';
import Memories              from './components/Memories/Memories';
import Contact               from './components/Contact/Contact';
import Footer                from './components/Footer/Footer';
import MagnifyingGlass       from './components/MagnifyingGlass/MagnifyingGlass';
import CustomCursor          from './components/CustomCursor/CustomCursor';
import useKonami             from './hooks/useKonami';

// ─────────────────────────────────────────────────────────────────────────────
// Intro-complete state is seeded from sessionStorage so that on repeat visits
// (same browser session) the page is immediately visible — no flash of
// invisible content while the LoadingScreen component decides to skip itself.
// ─────────────────────────────────────────────────────────────────────────────
const INTRO_KEY = 'np_seen';

function hasSeenIntro() {
  try { return sessionStorage.getItem(INTRO_KEY) === '1'; } catch { return false; }
}

// ── Vintage Mode overlay (Konami Code easter egg) ─────────────────────────
function VintageModeOverlay({ active }) {
  if (!active) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
        background: 'rgba(101, 67, 33, 0.18)',
        mixBlendMode: 'multiply',
        backdropFilter: 'sepia(0.65) contrast(1.08) brightness(0.94)',
      }}
      aria-hidden="true"
    />
  );
}

// ── Logo double-click easter egg ──────────────────────────────────────────
function LogoFoldFlash({ show }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(245,240,230,0.95)',
        animation: 'fadeUp 0.15s ease both',
      }}
      aria-hidden="true"
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(4rem, 12vw, 9rem)',
        fontWeight: 700,
        animation: 'inkDrop 0.7s ease both',
      }}>
        ARYAN
      </div>
    </div>
  );
}

// // ── Loyal Reader stamp (shows after 3+ visits across sessions) ────────────
function LoyalReaderStamp() {
  const visits = parseInt(localStorage.getItem('ary_visits') || '0') + 1;
  useEffect(() => { localStorage.setItem('ary_visits', String(visits)); }, []);
  if (visits < 3) return null;
  return (
    <div>
      
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // On repeat visits (same session) start as already-complete so the site is
  // instantly visible — no opacity:0 flash while the intro decides to skip.
  const [introComplete, setIntroComplete] = useState(() => hasSeenIntro());
  const [vintageMode,   setVintageMode]   = useState(false);
  const [logoFlash,     setLogoFlash]     = useState(false);

  // Konami code → toggle vintage sepia overlay
  const activateVintage = useCallback(() => setVintageMode(v => !v), []);
  useKonami(activateVintage);

  // Logo double-click easter egg — expose via window for the nav brand link
  const handleLogoDblClick = useCallback(() => {
    setLogoFlash(true);
    setTimeout(() => setLogoFlash(false), 900);
  }, []);
  useEffect(() => { window.__onBrandDblClick = handleLogoDblClick; }, [handleLogoDblClick]);

  return (
    <>
      <CustomCursor />

      {/* LoadingScreen: self-skips on repeat sessions via sessionStorage */}
      {!introComplete && (
        <LoadingScreen onComplete={() => setIntroComplete(true)} />
      )}

      <VintageModeOverlay active={vintageMode} />
      <LogoFoldFlash      show={logoFlash} />
      <LoyalReaderStamp />
      <MagnifyingGlass />

      {/*
        Fade the site in after the loader completes.
        On repeat visits introComplete starts as true so opacity is 1
        immediately — no delay, no flash.

        The 'site-revealed' class gates mount-triggered entrance animations
        (see .fade-up in Header.css) so they play AFTER the site becomes
        visible instead of running silently to completion behind the loader.
        The site itself stays mounted the whole time — only the animation
        start is deferred — so scroll-reveal / IntersectionObserver-driven
        sections are unaffected and initialize correctly on first load.
      */}
      <div
        className={introComplete ? 'site-revealed' : ''}
        style={{
          opacity: introComplete ? 1 : 0,
          transition: introComplete ? 'opacity 0.4s ease' : 'none',
        }}
      >
        <Navigation />
        <BreakingTicker />
        <main>
          <Header revealed={introComplete} />
          <ProfileSection />
          <Experience />
          <SkillsProjectsSection />
          <Github />
          <Leetcode />
          <Memories />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
