import { useEffect, useRef, useState } from 'react';

// Typing/printing effect — reveals characters one at a time with a tiny
// random jitter per character to simulate a mechanical printing press.
// Returns { displayText, isDone } — rendered chars are in displayText.
export default function usePrintEffect(text, { delay = 0, speed = 55, startOnMount = true } = {}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!startOnMount) return;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay, startOnMount]);

  useEffect(() => {
    if (!started) return;
    if (count >= text.length) return;
    timerRef.current = setTimeout(() => {
      setCount(c => c + 1);
    }, speed + Math.random() * 30 - 10); // ±10ms jitter
    return () => clearTimeout(timerRef.current);
  }, [started, count, text, speed]);

  return { displayText: text.slice(0, count), isDone: count >= text.length };
}
