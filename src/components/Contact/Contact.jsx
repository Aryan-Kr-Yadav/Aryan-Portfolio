import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedinIn, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { profile, socials } from '../../data/portfolioData';
import useReveal from '../../hooks/useReveal';
import './Contact.css';

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const HAS_EMAILJS = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

export default function Contact() {
  const [ref, isVisible] = useReveal();
  const [form, setForm]  = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!HAS_EMAILJS) { window.location.href = socials.email; return; }
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
  };

  return (
    <section className="section contact" id="contact" data-edition="EDITION 09">
      <div className="container">
        <div ref={ref} className={`contact__grid reveal ${isVisible ? 'is-visible' : ''}`}>

          {/* Left */}
          <div className="contact__left">
            <p className="section-label">Final Chapter</p>
            <h2 className="contact__heading">Let's Create<br/>Something<br/>Together.</h2>
            <ul className="contact__info">
              <li><FaEnvelope/><a href={socials.email}>{profile.email}</a></li>
              <li><FaMapMarkerAlt/><span>{profile.location}</span></li>
              <li><FaGithub/><a href={socials.github} target="_blank" rel="noreferrer">Aryan-Kr-Yadav</a></li>
              <li><FaLinkedinIn/><a href={socials.linkedin} target="_blank" rel="noreferrer">aryan-kumar-yadav</a></li>
              <li><FaInstagram/><a href={socials.instagram} target="_blank" rel="noreferrer">wakeeuparyan</a></li>
              <li><SiLeetcode/><a href={socials.leetcode} target="_blank" rel="noreferrer">Aryan_Kumar_Yadav</a></li>
            </ul>
          </div>

          {/* Right — handwritten letter form */}
          <div className="contact__right">
            <div className={`letter ${status === 'sent' ? 'letter--sent' : ''}`}>
              <div className="letter__paper">
                <div className="letter__top-rule"/>
                <p className="letter__salutation">Dear Aryan,</p>

                <form className="letter__form" onSubmit={handleSubmit}>
                  <div className="letter__field-row">
                    <div className="letter__field">
                      <label className="letter__label">From</label>
                      <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required className="letter__input"/>
                    </div>
                    <div className="letter__field">
                      <label className="letter__label">Email</label>
                      <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required className="letter__input"/>
                    </div>
                  </div>

                  <div className="letter__field letter__field--full">
                    <label className="letter__label">Message</label>
                    <textarea name="message" placeholder="I'd love to connect about…" value={form.message} onChange={handleChange} required rows={5} className="letter__textarea"/>
                  </div>

                  <p className="letter__sign">Sincerely,</p>
                  <div className="letter__sign-line"/>

                  <button type="submit" className="letter__send" disabled={status === 'sending'}>
                    <FaPaperPlane size={13}/>
                    {status === 'sending' ? 'Sending…' : 'Send Letter'}
                  </button>
                </form>

                <div className="letter__bottom-rule"/>
              </div>

              {/* Envelope animation overlay */}
              {status === 'sent' && (
                <div className="letter__sent-overlay">
                  <div className="envelope">
                    <div className="envelope__body"/>
                    <div className="envelope__flap"/>
                    <div className="envelope__stamp">✉</div>
                  </div>
                  <p className="letter__sent-msg">Letter sent! I'll write back soon.</p>
                </div>
              )}
            </div>

            {status === 'error' && (
              <p className="letter__error">
                Something went wrong. Email me directly at <a href={socials.email}>{profile.email}</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
