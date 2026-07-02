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
        I am a Computer Science student at ABES Engineering College, Ghaziabad, passionate about building meaningful digital experiences through technology. Currently, I’m focused on mastering Full Stack Development, strengthening my problem-solving skills with DSA in C++, and exploring UI/UX design to create intuitive and user-centric applications.
      </p>
      <p className="about__body" style={{ marginTop: '14px' }}>
        I enjoy turning ideas into real-world projects while continuously learning and experimenting with new technologies. Alongside development, I have a creative side through graphic design and video editing, and I’m excited to explore Machine Learning and Cloud Computing as I grow into a well-rounded software engineer.
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
