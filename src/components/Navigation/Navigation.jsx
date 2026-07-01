import { useEffect, useState } from 'react';
import { FaInstagram, FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { HiMenu, HiX } from 'react-icons/hi';
import { socials } from '../../data/portfolioData';
import './Navigation.css';

const NAV_LINKS = [
  { label: 'Home',       href: '#home' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'GitHub',     href: '#github' },
  { label: 'LeetCode',   href: '#leetcode' },
  { label: 'Memories',   href: '#memories' },
  { label: 'Resume',     href: '#resume' },
  { label: 'Contact',    href: '#contact' },
];

export default function Navigation() {
  const [active, setActive]   = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace('#', ''));
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--shadow' : ''}`}>
      <div className="container nav__inner">
        <a href="#home" className="nav__brand" onClick={() => setOpen(false)} onDoubleClick={() => window.__onBrandDblClick?.()}>
          Aryan<span className="nav__dot">.</span>
        </a>

        <button className="nav__toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <HiX size={22}/> : <HiMenu size={22}/>}
        </button>

        <ul className={`nav__links ${open ? 'nav__links--open' : ''}`}>
          {NAV_LINKS.map(link => {
            const id = link.href.replace('#', '');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="nav__socials">
          <a href={socials.github}    target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href={socials.linkedin}  target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href={socials.leetcode}  target="_blank" rel="noreferrer" aria-label="LeetCode"><SiLeetcode /></a>
          <a href={socials.email}     aria-label="Email"><FaEnvelope /></a>
        </div>
      </div>
    </nav>
  );
}
