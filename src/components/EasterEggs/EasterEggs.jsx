import { useEffect, useState, useCallback } from 'react';
import './EasterEggs.css';

// ============================================
// EASTER EGGS
// 1. Konami Code → Vintage Mode (sepia filter + old-timey font boost)
// 2. Double-click logo → newspaper fold/unfold animation
// 3. Coffee stain click → hidden inspirational quote
// 4. Multiple visits → LOYAL READER stamp
// ============================================

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

const QUOTES = [
  '"Code is the closest thing we have to a superpower." — Drew Houston',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"The best way to get a project done faster is to start sooner." — Jim Highsmith',
  '"Programs must be written for people to read." — Harold Abelson',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
];

export default function EasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [quoteState, setQuoteState] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [loyalReader, setLoyalReader] = useState(false);
  const [konamiSeq, setKonamiSeq] = useState([]);

  // --- Loyal Reader detection ---
  useEffect(() => {
    const visits = parseInt(localStorage.getItem('np-visits') || '0', 10) + 1;
    localStorage.setItem('np-visits', String(visits));
    if (visits >= 2) setLoyalReader(true);
  }, []);

  // --- Konami Code ---
  useEffect(() => {
    const handler = (e) => {
      setKonamiSeq((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.join(',') === KONAMI.join(',')) {
          setKonamiActive((k) => !k);
          return [];
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (konamiActive) {
      document.documentElement.classList.add('vintage-mode');
    } else {
      document.documentElement.classList.remove('vintage-mode');
    }
  }, [konamiActive]);

  // --- Double-click logo fold (dispatched from Navigation) ---
  useEffect(() => {
    const handler = () => {
      const logo = document.querySelector('.nav__brand');
      if (!logo) return;
      logo.classList.add('nav__brand--fold');
      setTimeout(() => logo.classList.remove('nav__brand--fold'), 900);
    };
    window.addEventListener('logo-doubleclick', handler);
    return () => window.removeEventListener('logo-doubleclick', handler);
  }, []);

  // --- Coffee stain click — show quote near cursor ---
  const handleCoffeeClick = useCallback((e) => {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuoteState({ visible: true, text: quote, x: e.clientX, y: e.clientY });
    setTimeout(() => setQuoteState((s) => ({ ...s, visible: false })), 4000);
  }, []);

  return (
    <>
      {/* Coffee stains — decorative + clickable */}
      <div
        className="coffee-stain coffee-stain--1"
        onClick={handleCoffeeClick}
        role="button"
        aria-label="Click for a surprise"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCoffeeClick(e)}
        title="Click me…"
      />
      <div
        className="coffee-stain coffee-stain--2"
        onClick={handleCoffeeClick}
        role="button"
        aria-label="Click for a surprise"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCoffeeClick(e)}
      />

      {/* Ink smudge decorations */}
      <div className="ink-smudge ink-smudge--1" aria-hidden="true" style={{ '--smudge-rot': '-12deg' }} />
      <div className="ink-smudge ink-smudge--2" aria-hidden="true" style={{ '--smudge-rot': '8deg' }} />

      {/* Quote popup on coffee stain click */}
      {quoteState.visible && (
        <div
          className="easter-quote"
          style={{
            left: Math.min(quoteState.x + 16, window.innerWidth - 320),
            top: quoteState.y + 16,
          }}
          role="status"
          aria-live="polite"
        >
          <span className="easter-quote__mark">"</span>
          {quoteState.text}
        </div>
      )}

      {/* Konami mode banner */}
      {konamiActive && (
        <div className="konami-banner" role="status">
          <span>VINTAGE MODE ACTIVATED — Press Konami Code again to exit</span>
        </div>
      )}

      {/* Loyal reader stamp */}
      {/* {loyalReader && (
        <div className="loyal-stamp" aria-label="Loyal reader badge">
          <span>LOYAL</span>
          <span>READER</span>
        </div>
      )} */}
    </>
  );
}
