import { useEffect, useState } from 'react';
import usePrintEffect from '../../hooks/usePrintEffect';
import './Header.css';

// Helper: renders each char with a tiny random vertical/horizontal offset
// to simulate printing imperfections.
function PrintChar({ ch, index, done }) {
  const jitter = index % 3;
  return (
    <span
      className={`ph__char ph__char--j${jitter} ${done ? 'ph__char--inked' : ''}`}
      style={{ transitionDelay: `${index * 0.008}s` }}
      aria-hidden={ch === ' '}
    >
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  );
}

export default function Header({ revealed = true }) {
  // startOnMount gated by `revealed`: on first page load the Hero is mounted
  // behind the loading screen, so the typing effect must wait until the
  // loader has actually faded away — otherwise it types out and finishes
  // while invisible, and appears static (already "typed") the moment the
  // site becomes visible. usePrintEffect re-triggers reactively when
  // startOnMount flips from false → true.
  const { displayText, isDone } = usePrintEffect('ARYAN', { delay: 300, speed: 80, startOnMount: revealed });
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const d = new Date();
    setDateStr(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase());
  }, []);

  return (
    <header className="hero" id="home">
      <div className="container">

        {/* Top masthead strip */}
        <div className="hero__topbar fade-up">
          <span className="hero__topbar-item">Vol. I · No. 1</span>
          <span className="hero__topbar-center">
            Developer&nbsp;·&nbsp;Problem Solver&nbsp;·&nbsp;Dreamer
          </span>
          <span className="hero__topbar-status">⬤&nbsp;Open to Work</span>
        </div>

        <div className="hero__rule" />

        {/* Three-column masthead */}
        <div className="hero__main">

          {/* LEFT editorial block */}
          <div className="hero__aside hero__aside--left fade-up" style={{ animationDelay:'0.1s' }}>
            <p className="hero__tagline">
              The journey of a developer who loves to build, one commit at a time.
            </p>
            <p className="hero__date">{dateStr || 'JUNE 2025'}</p>
            <p className="hero__price">INDIA EDITION · FREE</p>
          </div>

          {/* CENTER — printing press title */}
          <div className="hero__titleblock fade-up" style={{ animationDelay:'0.05s' }}>
            <div className="hero__name-wrap" aria-label="Aryan Yadav">
              {('ARYAN').split('').map((ch, i) => (
                <PrintChar key={i} ch={ch} index={i} done={i < displayText.length} />
              ))}
            </div>
            <div className="hero__rule hero__rule--thin" />
            <p className="hero__subtitle">Software Developer</p>
          </div>

          {/* RIGHT illustration */}
          <div className="hero__aside hero__aside--right fade-up" style={{ animationDelay:'0.2s' }}>
            <svg viewBox="0 0 130 110" className="hero__svg" aria-hidden="true">
              {/* Vintage laptop illustration */}
              <rect x="15" y="50" width="100" height="62" rx="3" fill="none" stroke="var(--ink)" strokeWidth="1.5"/>
              <rect x="15" y="50" width="100" height="50" rx="2" fill="none" stroke="var(--ink)" strokeWidth="1"/>
              <rect x="22" y="56" width="86" height="38" fill="var(--paper-warm)" stroke="var(--divider)" strokeWidth="0.75"/>
              {/* Screen content - code lines */}
              <rect x="28" y="62" width="35" height="2" rx="1" fill="var(--accent-brown)" opacity="0.8"/>
              <rect x="28" y="68" width="55" height="1.5" rx="1" fill="var(--ink)" opacity="0.3"/>
              <rect x="28" y="73" width="48" height="1.5" rx="1" fill="var(--ink)" opacity="0.3"/>
              <rect x="28" y="78" width="60" height="1.5" rx="1" fill="var(--accent-rust)" opacity="0.5"/>
              <rect x="28" y="83" width="40" height="1.5" rx="1" fill="var(--ink)" opacity="0.3"/>
              {/* Keyboard base */}
              <rect x="10" y="110" width="110" height="5" rx="2" fill="var(--ink)" opacity="0.15"/>
              {/* Coffee mug */}
              <rect x="90" y="30" width="22" height="18" rx="3" fill="none" stroke="var(--ink)" strokeWidth="1.2"/>
              <path d="M112 37 Q120 37 120 42 Q120 47 112 47" fill="none" stroke="var(--ink)" strokeWidth="1"/>
              <line x1="94" y1="24" x2="94" y2="30" stroke="var(--ink)" strokeWidth="0.8" opacity="0.5"/>
              <line x1="99" y1="22" x2="99" y2="30" stroke="var(--ink)" strokeWidth="0.8" opacity="0.5"/>
              <line x1="104" y1="24" x2="104" y2="30" stroke="var(--ink)" strokeWidth="0.8" opacity="0.5"/>
            </svg>
            <p className="hero__caption">Building solutions,<br/>one line at a time.</p>
          </div>
        </div>

        <div className="hero__rule hero__rule--thick" />

        {/* Bottom strip — sub-headlines */}
        <div className="hero__substrip fade-up" style={{ animationDelay:'0.3s' }}>
          <span>🔴 AI Projects</span>
          <span>·</span>
          <span>Open Source</span>
          <span>·</span>
          <span>Full Stack</span>
          <span>·</span>
          <span>Problem Solver</span>
          <span>·</span>
          <span>Cloud Learner</span>
        </div>

        {/* Coffee stain decorative */}
        <div
          className="coffee-stain hero__stain"
          title="Click me!"
          onClick={() => {
            const quotes = [
              '"The best error message is the one that never shows up."',
              '"Code is like humor. When you have to explain it, it\'s bad."',
              '"First, solve the problem. Then, write the code."',
            ];
            alert(quotes[Math.floor(Math.random() * quotes.length)]);
          }}
        />
      </div>
    </header>
  );
}
