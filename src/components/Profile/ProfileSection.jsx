import Profile from '../Profile/Profile';
import About from '../About/About';
import Resume from '../Resume/Resume';
import './ProfileSection.css';

export default function ProfileSection() {
  return (
    <section className="section profile-section" data-edition="EDITION 01 & 02">
      <div className="container profile-section__grid">
        <Profile />
        <About />
        <Resume />
      </div>
    </section>
  );
}
