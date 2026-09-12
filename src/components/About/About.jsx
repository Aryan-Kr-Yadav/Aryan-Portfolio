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
  I’m a Computer Science and Engineering student at ABES Engineering College, Ghaziabad, who
  enjoys the space where <strong>code, creativity, and curiosity</strong> meet.
  Right now, I’m diving deeper into <strong>Full Stack Development</strong>,
  sharpening my problem-solving skills with <strong>DSA in C++</strong>, and
  exploring <strong>Data Analytics and UI/UX</strong> to understand both the
  information behind decisions and the experiences behind great products.
</p>

<p className="about__body" style={{ marginTop: '14px' }}>
  Most of my learning happens by <strong>building</strong> — turning ideas into
  real-world projects, experimenting with new technologies, breaking things
  along the way, and figuring out how to make them better. From web applications
  and <strong>open-source contributions</strong> to working with data and
  experimenting with AI, I’m always looking for the next interesting problem
  to solve.
</p>

<p className="about__body" style={{ marginTop: '14px' }}>
  There’s a creative side to the story too. <strong>Graphic design, video editing,
  and visual storytelling</strong> have shaped the way I think about the things
  I build. As I move forward, I’m also exploring <strong>Machine Learning and
  Cloud Computing</strong>, with one simple goal: becoming an engineer who can
  analyze, think, design, and <strong>build beyond the obvious.</strong>
</p>

<p className="about__closing">
  Still learning. Still building. Still writing the next chapter.
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
