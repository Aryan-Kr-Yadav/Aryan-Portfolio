import { skillCategories, skillsStats } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Skills.css';

// Skills displayed as vintage newspaper classified advertisements
export default function Skills() {
  const [ref, isVisible] = useReveal();
  return (
    <aside ref={ref} className={`skills-panel reveal ${isVisible ? 'is-visible' : ''}`} id="skills">
      <div className="skills-panel__masthead">
        <h2 className="skills-panel__heading">CLASSIFIEDS</h2>
        <p className="skills-panel__sub">Technical Capabilities · Vol. I</p>
      </div>

      <ul className="skills-panel__stats">
        {skillsStats.map(s => (
          <li key={s.label}>
            <span>{s.label}</span>
            <span className="skills-panel__stat-val">{s.value}</span>
          </li>
        ))}
      </ul>

      {skillCategories.map(cat => (
        <div key={cat.category} className="skills-classified">
          <div className="skills-classified__header">
            <span className="skills-classified__box">FOR HIRE</span>
            <h4>{cat.category.toUpperCase()}</h4>
          </div>
          <div className="skills-classified__items">
            {cat.items.map(item => (
              <span key={item} className="skills-classified__tag">{item}</span>
            ))}
          </div>
          <p className="skills-classified__footer">— Available immediately —</p>
        </div>
      ))}

      <div className="skills-panel__pull-quote">
        &ldquo;The best error message is the one that never shows up.&rdquo;
      </div>
    </aside>
  );
}
