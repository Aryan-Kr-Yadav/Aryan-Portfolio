import { FaGraduationCap, FaMapMarkerAlt, FaEnvelope, FaDownload } from 'react-icons/fa';
import { profile } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Profile.css';
import profileImg from '../../assets/images/profile.png';

function PortraitPlaceholder() {
  return (
    <svg viewBox="0 0 300 360" xmlns="src/assets/images/profile.png" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="300" height="360" fill="#E8DFC8"/>
      <ellipse cx="150" cy="290" rx="95" ry="75" fill="#C9BCA0"/>
      <circle cx="150" cy="145" r="72" fill="#C9BCA0"/>
      <rect x="128" y="205" width="44" height="40" rx="8" fill="#C9BCA0"/>
      <ellipse cx="150" cy="85" rx="72" ry="45" fill="#8A6A4A"/>
      <ellipse cx="82"  cy="135" rx="14" ry="28" fill="#8A6A4A"/>
      <ellipse cx="218" cy="135" rx="14" ry="28" fill="#8A6A4A"/>
      <ellipse cx="124" cy="145" rx="9" ry="7" fill="white"/>
      <ellipse cx="176" cy="145" rx="9" ry="7" fill="white"/>
      <circle cx="126" cy="146" r="5" fill="#5A3E28"/>
      <circle cx="178" cy="146" r="5" fill="#5A3E28"/>
      <circle cx="128" cy="144" r="1.5" fill="white"/>
      <circle cx="180" cy="144" r="1.5" fill="white"/>
      <path d="M112 132 Q124 126 136 132" stroke="#5A3E28" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M164 132 Q176 126 188 132" stroke="#5A3E28" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M150 155 Q145 170 152 175 Q158 175 155 170 Z" fill="#B8A88A" opacity="0.6"/>
      <path d="M135 188 Q150 198 165 188" stroke="#8A6A4A" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect width="300" height="360" fill="rgba(101,67,33,0.07)"/>
    </svg>
  );
}

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
      <p className="profile-card__role">Software Developer</p>
      <ul className="profile-card__details">
        <li><FaGraduationCap className="profile-card__icon"/><span>B.Tech CSE · ABES EC</span></li>
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
