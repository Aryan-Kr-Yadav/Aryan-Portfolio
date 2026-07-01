import { useEffect, useState } from 'react';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function useKonami(callback) {
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    const handler = e => {
      setKeys(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.join(',') === KONAMI.join(',')) callback();
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [callback]);
}
