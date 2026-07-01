import { useEffect, useState, useRef } from 'react';
import './MagnifyingGlass.css';

// Holds ALT key to show a vintage magnifying glass that magnifies content underneath.
export default function MagnifyingGlass() {
  const [active, setActive] = useState(false);
  const [pos, setPos]       = useState({ x: 0, y: 0 });
  const glassRef = useRef(null);

  useEffect(() => {
    const onKeyDown = e => { if (e.key === 'Alt') { e.preventDefault(); setActive(true); } };
    const onKeyUp   = e => { if (e.key === 'Alt') setActive(false); };
    const onMove    = e => setPos({ x: e.clientX, y: e.clientY });

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  if (!active) return null;

  const RADIUS = 90;
  const ZOOM   = 2;

  return (
    <div
      ref={glassRef}
      className="magnify"
      style={{
        left: pos.x - RADIUS,
        top:  pos.y - RADIUS,
        // Zoom the underlying page by zooming a background copy
        backgroundImage: `url(${window.location.href})`,
        backgroundSize:  `${window.innerWidth * ZOOM}px ${window.innerHeight * ZOOM}px`,
        backgroundPosition: `${-(pos.x * ZOOM - RADIUS)}px ${-(pos.y * ZOOM - RADIUS)}px`,
      }}
      aria-hidden="true"
    >
      {/* Vintage lens ring SVG overlay */}
      <svg className="magnify__ring" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="85" fill="none" stroke="#8A6A4A" strokeWidth="6"/>
        <circle cx="90" cy="90" r="78" fill="none" stroke="#1B1B1B" strokeWidth="1.5"/>
        <circle cx="90" cy="90" r="73" fill="none" stroke="#D8D0C4" strokeWidth="0.5" strokeDasharray="4 4"/>
        {/* Handle */}
        <line x1="148" y1="148" x2="174" y2="174" stroke="#8A6A4A" strokeWidth="8" strokeLinecap="round"/>
        <line x1="148" y1="148" x2="174" y2="174" stroke="#6A4A2A" strokeWidth="4" strokeLinecap="round"/>
      </svg>

      {/* Glass sheen */}
      <div className="magnify__sheen"/>
    </div>
  );
}
