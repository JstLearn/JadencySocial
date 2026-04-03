import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  const scrollToSection = (id: string) => {
    navigate(`/#${id}`);
    setMenuOpen(false);
  };

  const navLinks = [
    { id: 'services', label: t('nav.services') },
    { id: 'stats', label: t('nav.about') },
    { id: 'process', label: t('nav.process') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <a href="/" className="navbar-logo">
            <img src="/logo-icon.svg" alt="Jadency Social Logo" className="navbar-logo-icon" />
            <span className="navbar-logo-text">
              Jadency<span className="navbar-logo-accent"> Social</span>
            </span>
          </a>

          {/* Desktop Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button className="navbar-link" onClick={() => scrollToSection(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="navbar-actions">
            <button className="navbar-lang" onClick={toggleLang}>
              <span className={i18n.language === 'tr' ? 'active' : ''}>TR</span>
              <span className="navbar-lang-sep">/</span>
              <span className={i18n.language === 'en' ? 'active' : ''}>EN</span>
            </button>
            <button className="btn-primary navbar-cta" onClick={() => scrollToSection('contact')}>
              {t('nav.cta')}
            </button>
            <button
              className={`navbar-burger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t('nav.menu')}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-links">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button className="mobile-menu-link" onClick={() => scrollToSection(link.id)}>
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button className="btn-primary mobile-menu-cta" onClick={() => scrollToSection('contact')}>
              {t('nav.cta')}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
