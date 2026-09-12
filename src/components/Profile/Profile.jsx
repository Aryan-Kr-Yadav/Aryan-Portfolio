import { FaGraduationCap, FaMapMarkerAlt, FaEnvelope, FaDownload } from 'react-icons/fa';
import { profile } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Profile.css';
import profileImg from '../../assets/images/profile.jpeg';

export default function Profile() {
  const [ref, isVisible] = useReveal();
  return (
    <aside ref={ref} className={`profile-card reveal ${isVisible ? 'is-visible' : ''}`}>
      <p className="profile-card__label">Profile</p>
      <div className="profile-card__portrait">
        <img
        src={profileImg}
        alt="Aryan Kumar Yadav"
        className="portrait-image"
        />
        <span className="profile-card__pin" aria-hidden="true">📌</span>
      </div>
      <h3 className="profile-card__name">{profile.name}</h3>
      <p className="profile-card__role">Aspiring Software Developer</p>
      <ul className="profile-card__details">
        <li><FaGraduationCap className="profile-card__icon"/><span>B.Tech CSE · ABESEC</span></li>
        <li><FaMapMarkerAlt  className="profile-card__icon"/><span>{profile.location}</span></li>
        <li><FaEnvelope      className="profile-card__icon"/><span className="profile-card__email">{profile.email}</span></li>
      </ul>
      <a href={profile.resumePath} download className="profile-card__btn">
        Download Resume <FaDownload size={12}/>
      </a>
      <p className="profile-card__subtext">View / Download My Resume</p>
      <div className="profile-card__stamp"><span>OPEN<br/>TO WORK</span></div>
    </aside>
  );
}
