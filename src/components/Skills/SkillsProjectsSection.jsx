import Skills from '../Skills/Skills';
import Projects from '../Projects/Projects';
import './SkillsProjectsSection.css';

export default function SkillsProjectsSection() {
  return (
    <section className="section skills-projects" data-edition="EDITION 04 & 05">
      <div className="container skills-projects__grid">
        <Skills />
        <Projects />
      </div>
    </section>
  );
}
