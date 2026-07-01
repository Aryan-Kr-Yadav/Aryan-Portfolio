import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { experience } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Experience.css';

const experienceDetails = [
  {
    headline: 'Developer Contributes Code to Open Source Projects Worldwide',
    byline: 'By Aryan Yadav · Open Source Desk · 2025–Present',
    body: `In a move that surprised many, a first-year Computer Science student from ABES Engineering College began submitting pull requests to open source repositories on GitHub — and getting them merged. Contributing fixes, documentation improvements, and new features, the developer has collaborated with maintainers from across the globe. "Every merged PR feels like a front page story," the contributor noted.`,
  },
  {
    headline: 'GDG ABESEC Member Organizes Campus Tech Events, Mentors Peers',
    byline: 'By Aryan Yadav · Campus Desk · 2024–Present',
    body: `As an active member of Google Developer Group ABESEC, the developer has been instrumental in organizing coding workshops, hackathons, and tech talks that have seen participation from hundreds of students. The society has grown its active membership by 40% since the developer joined. Peers describe the member as "someone who lifts everyone around them."`,
  },
  {
    headline: 'Defense Society Member Builds Leadership Through Physical Discipline',
    byline: 'By Aryan Yadav · Campus Desk · 2024–Present',
    body: `Trishul ABESEC, the college's defense aspirants society, welcomed a new member who brings both technical acumen and an iron work ethic forged through early morning drills and leadership workshops. The dual commitment to physical training and software engineering has produced what teammates call "a rare combination of discipline and creativity."`,
  },
];

export default function Experience() {
  const [ref, isVisible] = useReveal();
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="section experience" id="experience" data-edition="EDITION 03">
      <div className="container">
        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <p className="section-label">Chapter Two</p>
          <h2 className="section-heading">Experience</h2>

          <div className="exp__list">
            {experience.map((item, i) => {
              const detail = experienceDetails[i] || experienceDetails[0];
              const isOpen = expanded === i;
              return (
                <article key={item.title} className={`exp-article ${isOpen ? 'exp-article--open' : ''}`}>
                  {/* Newspaper headline row */}
                  <button className="exp-article__header" onClick={() => setExpanded(isOpen ? null : i)}>
                    <div className="exp-article__meta">
                      <span className="exp-article__year">{item.period.split('—')[0].trim()}</span>
                      <span className="exp-article__dash">—</span>
                    </div>
                    <div className="exp-article__headline-block">
                      <h3 className="exp-article__headline">{detail.headline}</h3>
                      <p className="exp-article__byline">{detail.byline}</p>
                    </div>
                    <span className="exp-article__cta">
                      {isOpen ? <><FaChevronUp size={11}/> Close</> : <>Read Story <FaChevronDown size={11}/></>}
                    </span>
                  </button>

                  {/* Expandable article body */}
                  <div className="exp-article__body" style={{ maxHeight: isOpen ? '600px' : '0' }}>
                    <div className="exp-article__inner">
                      <div className="exp-article__cols">
                        <p className="exp-article__text">{detail.body}</p>
                        <div className="exp-article__sidebar">
                          <p className="exp-article__role-label">Official Title</p>
                          <p className="exp-article__role">{item.title}</p>
                          <p className="exp-article__period">{item.period}</p>
                          <div className="exp-article__divider"/>
                          <p className="exp-article__summary">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
