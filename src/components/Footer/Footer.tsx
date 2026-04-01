import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          {/* Logo + tagline */}
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <img src="/logo-icon.svg" alt="" className="footer-logo-icon" aria-hidden="true" />
              <span className="footer-logo-text">
                Jadency<span className="footer-logo-accent"> Social</span>
              </span>
            </a>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>

          {/* Nav links */}
          <nav className="footer-nav">
            <a href="#services" className="footer-link">{t('nav.services')}</a>
            <a href="#stats" className="footer-link">{t('nav.about')}</a>
            <a href="#process" className="footer-link">{t('nav.process')}</a>
            <a href="#contact" className="footer-link">{t('nav.contact')}</a>
          </nav>

          {/* Social icons */}
          <div className="footer-social">
            <a href="https://instagram.com/jadencysocial" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/jadencysocial" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://twitter.com/jadencysocial" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} Jadency Social. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
