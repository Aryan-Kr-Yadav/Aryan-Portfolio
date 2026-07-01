import { FaArrowUp, FaHeart } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__rule footer__rule--thick"/>
      <div className="container footer__grid">
        <p className="footer__left">Thank you for visiting</p>
        <div className="footer__center">
          <p className="footer__copy">© 2025 Aryan Yadav. All rights reserved.</p>
          <p className="footer__made">Made with <FaHeart className="footer__heart"/> &amp; too much coffee</p>
        </div>
        <p className="footer__right">Keep coding. Keep growing.</p>
      </div>
      <div className="footer__rule"/>

      <button className="footer__back-top" onClick={scrollTop} aria-label="Back to top">
        <FaArrowUp/>
      </button>
    </footer>
  );
}
