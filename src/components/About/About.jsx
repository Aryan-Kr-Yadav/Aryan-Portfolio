import { FaCode, FaProjectDiagram, FaCodeBranch, FaBookOpen, FaLightbulb } from 'react-icons/fa';
import useReveal from '../../hooks/useReveal';
import './About.css';

const traits = [
  { icon: FaCode,          label: 'Full Stack Developer' },
  { icon: FaProjectDiagram,label: 'DSA Enthusiast' },
  { icon: FaCodeBranch,    label: 'Open Source Explorer' },
  { icon: FaBookOpen,      label: 'Lifelong Learner' },
  { icon: FaLightbulb,     label: 'Always Curious' },
];

export default function About() {
  const [ref, isVisible] = useReveal();
  return (
    <div ref={ref} className={`about reveal ${isVisible ? 'is-visible' : ''}`} id="about">
      <p className="section-label">Chapter One</p>
      <h2 className="section-heading">About Me</h2>

      <p className="about__body">
        I am a Computer Science student at ABES Engineering College, Ghaziabad — passionate about
        building impactful products that solve real-world problems. My journey spans full-stack
        development, computer vision AI, and open source collaboration. I believe the best code
        is invisible: it just works, elegantly and efficiently.
      </p>
      <p className="about__body" style={{ marginTop: '14px' }}>
        Whether it's training a machine learning model to detect student focus, crafting
        responsive UIs, or optimizing an algorithm on LeetCode at midnight — I bring the same
        curiosity and discipline to every challenge. Currently exploring cloud computing and
        always looking for the next problem worth solving.
      </p>

      <ul className="about__traits">
        {traits.map(t => (
          <li key={t.label} className="about__trait">
            <t.icon className="about__trait-icon" />
            <span>{t.label}</span>
          </li>
        ))}
      </ul>

      <blockquote className="about__quote">
        <span className="about__quote-mark">&ldquo;</span>
        <p>Sun will rise again tomorrow.</p>
        <footer>— Rohit Sharma</footer>
      </blockquote>

      {/* Margin note — editorial detail */}
      <div className="about__margin-note">Editor's note: Also a cricket fan.</div>
    </div>
  );
}
