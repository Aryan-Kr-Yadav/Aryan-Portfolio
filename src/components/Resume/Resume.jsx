import { FaFileAlt, FaDownload } from 'react-icons/fa';
import { profile } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Resume.css';

export default function Resume() {
  const [ref, isVisible] = useReveal();

  return (
    <aside ref={ref} className={`archive reveal ${isVisible ? 'is-visible' : ''}`} id="resume">

      {/* ── Masthead ── */}
      <div className="archive__masthead">
        <div className="archive__rule archive__rule--top"/>

        <p className="archive__eyebrow">The Developer Gazette</p>

        <div className="archive__rule"/>

        <h2 className="archive__title">ARCHIVES</h2>

        <div className="archive__rule archive__rule--thick"/>

        <p className="archive__edition">Developer Edition</p>

        <div className="archive__meta-row">
          <span className="archive__meta-item">
            <span className="archive__meta-label">Issue No.</span>
            <span className="archive__meta-val">01</span>
          </span>
          <span className="archive__meta-sep">·</span>
          <span className="archive__meta-item">
            <span className="archive__meta-label">Published</span>
            <span className="archive__meta-val">2025</span>
          </span>
        </div>

        <div className="archive__rule"/>
      </div>

      {/* ── Brief description ── */}
      <p className="archive__desc">
        A complete record of education,<br/>skills, experience &amp; achievements.
      </p>

      {/* ── Action buttons ── */}
      <div className="archive__actions">
        <a
          href={profile.resumePath}
          target="_blank"
          rel="noreferrer"
          className="archive__btn archive__btn--outline"
        >
          <FaFileAlt size={11}/> View Issue
        </a>
        <a
          href={profile.resumePath}
          download
          className="archive__btn archive__btn--solid"
        >
          <FaDownload size={11}/> Download Issue
        </a>
      </div>

      {/* ── Decorative issue stamp ── */}
      {/* <div className="archive__stamp" aria-hidden="true">
        <span><br/></span>
      </div> */}

    </aside>
  );
}
