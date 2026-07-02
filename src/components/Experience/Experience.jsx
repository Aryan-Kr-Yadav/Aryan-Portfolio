import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { experience } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Experience.css';

const experienceDetails = [
  {
    headline: 'Developer Contributes Code to Open Source Projects Worldwide',
    byline: 'By Aryan Yadav · Open Source Desk · 2026–Present',
    body: `In a milestone that reflects a growing passion for software development, Aryan Yadav, a second-year Computer Science student at ABES Engineering College, has begun contributing to open-source projects on GitHub. By submitting pull requests, fixing bugs, improving documentation, and collaborating with maintainers worldwide, he continues to strengthen his skills while giving back to the developer community. For Aryan, every contribution is another step toward becoming a better engineer and lifelong learner.`,
  },
  {
    headline: 'GDG ABESEC Member Contributes to Campus Tech Community',
    byline: 'By Aryan Yadav · Campus Desk · 2025–Present',
    body: `As an active member of Google Developer Groups (GDG) ABESEC, Aryan Yadav contributes to organizing technical events, coding workshops, and hackathons while supporting community initiatives. Working alongside fellow students and mentors, he helps create opportunities for learning, collaboration, and knowledge sharing, further strengthening his leadership, communication, and technical skills.`,
  },
  {
    headline: 'Defense Society Member Develops Leadership Through Discipline and Teamwork',
    byline: 'By Aryan Yadav · Campus Desk · 2025–Present',
    body: `While pursuing Computer Science at ABES Engineering College, Aryan Yadav is also an active member of Trishul ABESEC, the college's defense aspirants' society. Through structured drills, leadership workshops, and physical training, he continues to develop discipline, resilience, and teamwork qualities that influence both his personal growth and his approach to software development.`,
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
