import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { memories } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Memories.css';

// Muted vintage photo tones
const TONES = ['#C9BCA0','#A8B5A0','#B5A0A8','#A0A8B5','#B8A87E','#9DAFA0','#AFA0AC','#A0A0B0'];

// Each photo gets a slight random rotation (seeded, not random each render)
const ROTATIONS = [-2.1, 1.4, -0.8, 2.6, -1.7, 0.9, -2.4, 1.1];

export default function Memories() {
  const [ref, isVisible] = useReveal();
  const [active, setActive] = useState(null);
  const [flash, setFlash]   = useState(false);

  const open = (i) => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    setActive(i);
  };
  const close = () => setActive(null);
  const prev  = () => setActive(i => (i - 1 + memories.length) % memories.length);
  const next  = () => setActive(i => (i + 1) % memories.length);

  useEffect(() => {
    if (active === null) return;
    const onKey = e => {
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <section className="section memories" id="memories" data-edition="EDITION 08">
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <p className="section-label">Chapter Six</p>
          <h2 className="section-heading">Best Clicks of Memories</h2>

          <div className="memories__grid">
            {memories.map((mem, i) => (
              <button
                key={mem.title}
                className="mem-photo"
                onClick={() => open(i)}
                style={{ '--rotation': `${ROTATIONS[i % ROTATIONS.length]}deg` }}
                aria-label={`Open photo: ${mem.title}`}
              >
                {/* White photo border (Polaroid-style) */}
                <div className="mem-photo__frame">
                  {/* Tape corners */}
                  <span className="mem-photo__tape mem-photo__tape--tl"/>
                  <span className="mem-photo__tape mem-photo__tape--tr"/>

                  <div className="mem-photo__image">
                   <img
                   src={mem.image}
                   alt={mem.title}
                   loading="lazy"
                   />
                  </div>
                  <div className="mem-photo__overlay"/>
                  <p className="mem-photo__caption">{mem.title}</p>
                </div>
                <span className="mem-photo__label">{mem.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera flash overlay */}
      {flash && <div className="mem-flash" aria-hidden="true"/>}

      {/* Lightbox */}
      {active !== null && (
        <div className="mem-lightbox" onClick={close}>
          <button className="mem-lightbox__close" onClick={close} aria-label="Close"><FaTimes/></button>
          <button className="mem-lightbox__nav mem-lightbox__nav--prev" onClick={e => { e.stopPropagation(); prev(); }}><FaChevronLeft/></button>

          <div className="mem-lightbox__content" onClick={e => e.stopPropagation()}>
            <div className="mem-lightbox__frame">
              <div className="mem-lightbox__image">
              <img
              src={memories[active].image}
              alt={memories[active].title}
              />
              </div>
            </div>
            <p className="mem-lightbox__caption">{memories[active].title}</p>
            <p className="mem-lightbox__cat">{memories[active].category}</p>
          </div>

          <button className="mem-lightbox__nav mem-lightbox__nav--next" onClick={e => { e.stopPropagation(); next(); }}><FaChevronRight/></button>
        </div>
      )}
    </section>
  );
}
