import { useState } from 'react';
import { FaExternalLinkAlt, FaGithub, FaTimes, FaStar, FaCodeBranch } from 'react-icons/fa';
import { projects } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Projects.css';

// Extended article content per project
const articles = [
  {
    feature: 'FEATURE ARTICLE',
    standfirst: 'A developer builds an AI-powered attention monitoring system using computer vision — and the tech world takes notice.',
    body: `FocusLens emerged from a simple observation: students and remote workers struggle to maintain focus during long sessions. Using Python, OpenCV, and MediaPipe, FocusLens tracks eye blinks, head position, and facial landmarks in real time to generate a focus score. The system alerts users when attention drops below threshold — all running locally, no cloud, no privacy concerns.`,
    challenge: 'Real-time performance with MediaPipe while maintaining 30fps on low-spec hardware required careful pipeline optimization.',
    features: ['Real-time blink detection', 'Face mesh tracking', 'Focus score dashboard', 'Alert system', 'Session history'],
  },
  {
    feature: 'SPECIAL REPORT',
    standfirst: 'Farmers across India face crop disease without expert help nearby. One student sets out to change that with AI.',
    body: `KrishiMitra AI is an agricultural assistant that uses AI APIs to identify crop diseases from photos, recommend treatments in local languages, and surface relevant government schemes for farmers. Designed with simplicity first — the interface requires minimal literacy — KrishiMitra brings precision agriculture to the last mile.`,
    challenge: 'Building a reliable AI pipeline that works on poor mobile connectivity in rural areas required aggressive caching and offline fallbacks.',
    features: ['Crop disease identification', 'Treatment recommendations', 'Government scheme lookup', 'Multi-language support', 'Offline mode'],
  },
  {
    feature: 'CAMPUS REPORT',
    standfirst: 'A student-built hostel management portal transforms how 500+ residents interact with ABES Engineering College.',
    body: `The ABES Boys Hostel website provides students with a digital-first portal to explore facilities, check room availability, view amenities, and manage hostel-related activities. Built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies — the site loads in under a second and works on every device.`,
    challenge: 'Designing a fully responsive multi-page site without any framework forced careful attention to vanilla CSS layout techniques.',
    features: ['Facility showcase', 'Room explorer', 'Amenities directory', 'Contact management', 'Mobile-first design'],
  },
];

export default function Projects() {
  const [ref, isVisible] = useReveal();
  const [open, setOpen] = useState(null);

  return (
    <div ref={ref} className={`projects reveal ${isVisible ? 'is-visible' : ''}`} id="projects">
      <p className="section-label">Chapter Three</p>
      <h2 className="section-heading">Projects</h2>

      <div className="projects__grid">
        {projects.map((proj, i) => {
          const art = articles[i] || articles[0];
          return (
            <article key={proj.title} className="proj-card">
              {/* Newspaper-style article preview */}
              <div className="proj-card__image-wrap">
                {/* <div className="proj-card__image">
                  <svg viewBox="0 0 320 180" className="proj-card__svg">
                    <rect width="320" height="180" fill="#1a1a1a"/>
                    <rect x="0" y="0" width="320" height="24" fill="#111"/>
                    <circle cx="14" cy="12" r="4.5" fill="#A8462F"/>
                    <circle cx="28" cy="12" r="4.5" fill="#C99A3D"/>
                    <circle cx="42" cy="12" r="4.5" fill="#5B8A6F"/>
                    <rect x="20" y="44" width={100 + i * 30} height="9" rx="1" fill="var(--accent-brown)" opacity="0.7"/>
                    <rect x="20" y="62" width="220" height="5" rx="1" fill="#555"/>
                    <rect x="20" y="74" width="190" height="5" rx="1" fill="#555"/>
                    <rect x="20" y="86" width="210" height="5" rx="1" fill="#444"/>
                    <rect x="20" y="98" width="170" height="5" rx="1" fill="#555"/>
                    <rect x="20" y="120" width="80" height="26" rx="2" fill="var(--accent-rust)" opacity="0.4"/>
                    <rect x="108" y="120" width="80" height="26" rx="2" fill="none" stroke="#555" strokeWidth="1"/>
                  </svg>
                </div> */}
                <img
                  className="proj-card__image"
                  src={proj.image}
                  alt={proj.title}
                />
              </div>

              <div className="proj-card__body">
                <span className="proj-card__feature">{art.feature}</span>
                <h3 className="proj-card__title">{proj.title}</h3>
                <p className="proj-card__tagline">{proj.tagline}</p>
                <p className="proj-card__standfirst">{proj.description}</p>

                <div className="proj-card__stack">
                  {proj.stack.map(t => <span key={t} className="proj-card__badge">{t}</span>)}
                </div>

                <div className="proj-card__actions">
                  <button className="proj-card__read" onClick={() => setOpen(i)}>
                    Read Story →
                  </button>
                  <div className="proj-card__links">
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-card__link" aria-label="GitHub">
                      <FaGithub size={15}/>
                    </a>
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="proj-card__link" aria-label="Live">
                      <FaExternalLinkAlt size={13}/>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Expanded newspaper article modal */}
      {open !== null && (
        <div className="proj-modal" onClick={() => setOpen(null)}>
          <div className="proj-modal__paper" onClick={e => e.stopPropagation()}>
            <button className="proj-modal__close" onClick={() => setOpen(null)} aria-label="Close">
              <FaTimes/>
            </button>

            <div className="proj-modal__masthead">
              <span className="proj-modal__feature">{articles[open]?.feature}</span>
              <div className="proj-modal__rule"/>
              <h2 className="proj-modal__title">{projects[open].title}</h2>
              <p className="proj-modal__byline">By Aryan Yadav · {projects[open].tagline} · Published 2025</p>
              <div className="proj-modal__rule proj-modal__rule--thick"/>
            </div>

            <p className="proj-modal__standfirst">{articles[open]?.standfirst}</p>

            <div className="proj-modal__cols">
              <p className="proj-modal__body">{articles[open]?.body}</p>

              <aside className="proj-modal__sidebar">
                <p className="proj-modal__sidebar-head">CHALLENGE</p>
                <p className="proj-modal__sidebar-text">{articles[open]?.challenge}</p>

                <p className="proj-modal__sidebar-head" style={{marginTop:'16px'}}>FEATURES</p>
                <ul className="proj-modal__features">
                  {articles[open]?.features.map(f => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>

                <p className="proj-modal__sidebar-head" style={{marginTop:'16px'}}>STACK</p>
                <div className="proj-modal__stack">
                  {projects[open].stack.map(t => <span key={t}>{t}</span>)}
                </div>
              </aside>
            </div>

            <div className="proj-modal__footer">
              <a href={projects[open].githubUrl} target="_blank" rel="noreferrer" className="proj-modal__btn">
                <FaGithub/> View on GitHub
              </a>
              <a href={projects[open].liveUrl} target="_blank" rel="noreferrer" className="proj-modal__btn proj-modal__btn--outline">
                <FaExternalLinkAlt size={12}/> Live Demo
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
