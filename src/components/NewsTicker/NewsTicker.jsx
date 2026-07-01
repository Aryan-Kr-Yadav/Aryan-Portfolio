import { useRef, useState } from 'react';
import './NewsTicker.css';

const TICKER_ITEMS = [
  '✦ BREAKING — Open to Internship Opportunities 2025',
  '✦ Building Real-World AI Projects with Python & OpenCV',
  '✦ Active Open Source Contributor on GitHub',
  '✦ Exploring AWS Cloud Architecture',
  '✦ Solved 40+ LeetCode Problems & Counting',
  '✦ GDG ABESEC Technical Society Member',
  '✦ Full Stack Developer in Training',
  '✦ Passionate About Machine Learning & Computer Vision',
  '✦ Building FocusLens — AI Eye-Tracking System',
  '✦ Currently Based in Ballia, Uttar Pradesh, India',
];

export default function NewsTicker() {
  const [paused, setPaused] = useState(false);
  // Duplicate items so the seam is invisible during loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="ticker"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Breaking news ticker"
    >
      <div className="ticker__label" aria-hidden="true">
        <span className="ticker__label-dot" />
        BREAKING
      </div>

      <div className="ticker__track-wrap">
        <div className={`ticker__track ${paused ? 'ticker__track--paused' : ''}`}>
          {items.map((item, i) => (
            <span key={i} className="ticker__item">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
