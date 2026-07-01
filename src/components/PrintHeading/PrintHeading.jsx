import { useEffect, useState, useRef } from 'react';
import './PrintHeading.css';

// ============================================
// PRINT HEADING
// Renders text letter-by-letter as if a printing press is stamping each character.
// Each letter gets a tiny ink-spread animation with sub-pixel offset for imperfection.
// ============================================
export default function PrintHeading({ text, tag: Tag = 'h2', className = '', delay = 0 }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let count = 0;
    const letters = text.replace(/\s/g, '\u00A0'); // preserve spaces
    const totalChars = letters.length;

    // Stagger each letter print with a slight random delay (human imperfection feel)
    const timers = [];
    for (let i = 0; i < totalChars; i++) {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
      }, delay + i * 55 + (Math.random() * 25));
      timers.push(t);
    }

    return () => timers.forEach(clearTimeout);
  }, [started, text, delay]);

  const letters = text.replace(/ /g, '\u00A0');

  return (
    <Tag ref={ref} className={`print-heading ${className}`} aria-label={text}>
      {letters.split('').map((char, i) => (
        <span
          key={i}
          className={`print-heading__char ${i < visibleCount ? 'print-heading__char--printed' : ''}`}
          aria-hidden="true"
          style={{
            /* Tiny pseudo-random offset per letter for printing imperfection */
            '--offset-x': `${(((i * 7) + 3) % 5) - 2}px`,
            '--offset-y': `${(((i * 11) + 1) % 5) - 2}px`,
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}
