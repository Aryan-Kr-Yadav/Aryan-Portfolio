import './BreakingTicker.css';

const items = [
  '✦ OPEN TO INTERNSHIP OPPORTUNITIES',
  '✦ BUILDING AI PROJECTS WITH PYTHON & OPENCV',
  '✦ OPEN SOURCE CONTRIBUTOR — GDG ABESEC',
  '✦ AWS CLOUD PRACTITIONER IN PROGRESS',
  '✦ LEETCODE PROBLEMS SOLVER',
  '✦ ASPIRING FULL STACK DEVELOPER · REACT + NODE',
  '✦ FOCUSLENS: AI EYE-TRACKING MONITOR SHIPPED',
  '✦ KRISHIMITRA AI: HELPING FARMERS WITH MACHINE LEARNING',
  '✦ AVAILABLE FOR FREELANCE & COLLABORATION',
];

export default function BreakingTicker() {
  // Duplicate array so the seamless loop never shows a gap
  const doubled = [...items, ...items];

  return (
    <div className="ticker" aria-label="Breaking news ticker">
      <span className="ticker__label">BREAKING NEWS</span>
      <div className="ticker__track-wrapper">
        <div className="ticker__track">
          {doubled.map((item, i) => (
            <span key={i} className="ticker__item">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
