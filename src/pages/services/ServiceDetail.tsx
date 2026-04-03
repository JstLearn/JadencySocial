import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getServiceData } from '../../data/services';
import './ServiceDetail.css';

const serviceIcons: Record<string, React.ReactNode> = {
  brand: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  web: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  ecommerce: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  ads: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  social: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
    </svg>
  ),
  video: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="15" height="12" rx="2"/>
      <path d="M17 10l5-3v10l-5-3V10z"/>
    </svg>
  ),
};

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function ServiceDetail() {
  const { serviceKey } = useParams<{ serviceKey: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const service = serviceKey ? getServiceData(serviceKey) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [service?.key]);

  if (!service) {
    return (
      <div className="sd-error">
        <div className="sd-error-content">
          <h1>{t('serviceDetail.serviceNotFound')}</h1>
          <Link to="/" className="sd-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  const title = isEn ? (service.titleEn || service.title) : service.title;
  const desc = isEn ? (service.descEn || service.desc) : service.desc;
  const fullDesc = isEn ? (service.fullDescriptionEn || service.fullDescription) : (service.fullDescription || service.desc);

  const whatsappMessage = encodeURIComponent(
    isEn
      ? `Hello, I'd like to get information about the ${title} service.`
      : `Merhaba, ${title} hizmeti hakkında bilgi almak istiyorum.`
  );
  const whatsappUrl = `https://wa.me/905310330687?text=${whatsappMessage}`;

  return (
    <div
      className="service-detail"
      style={{
        '--service-color': service.color,
        '--service-color-rgb': hexToRgb(service.color),
      } as React.CSSProperties}
    >
      {/* Hero */}
      <section className="sd-hero">
        <div className="sd-hero-bg">
          <div className="sd-hero-grid" />
          <div className="sd-hero-glow sd-hero-glow-1" />
          <div className="sd-hero-glow sd-hero-glow-2" />
        </div>
        <div className="container">
          <Link to="/" className="sd-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t('serviceDetail.backToServices')}
          </Link>

          <div className="sd-hero-content">
            <div className="sd-hero-icon">
              {serviceIcons[service.key]}
            </div>
            <div className="sd-hero-text">
              <div className="sd-hero-badge">
                <span className="sd-badge-dot" />
                {t('serviceDetail.service')}
              </div>
              <h1 className="sd-hero-title">{title}</h1>
              <p className="sd-hero-desc">{desc}</p>
              <div className="sd-hero-price">
                <span className="sd-price-label">{t('serviceDetail.startingFrom')}</span>
                <span className="sd-price-value">{service.highlight}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="sd-section" data-animate>
        <div className="sd-section-inner">
          <div className="sd-section-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <div className="sd-section-content">
            <h2 className="sd-section-title">{t('serviceDetail.aboutThisService')}</h2>
            <p className="sd-description-text">{fullDesc}</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="sd-section">
          <div className="sd-section-inner" data-animate>
            <div className="sd-section-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="sd-section-content">
              <h2 className="sd-section-title">{t('serviceDetail.whatYouGet')}</h2>
              <div className="sd-benefits-grid">
                {service.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="sd-benefit-card"
                    data-animate
                    data-delay={Math.min(idx + 1, 5)}
                  >
                    <span className="sd-benefit-num">0{idx + 1}</span>
                    <span className="sd-benefit-icon">✦</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Timeline */}
      {service.process && service.process.length > 0 && (
        <section className="sd-section">
          <div className="sd-section-inner" data-animate>
            <div className="sd-section-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="sd-section-content">
              <h2 className="sd-section-title">{t('serviceDetail.howWeWork')}</h2>
              <div className="sd-timeline">
                {service.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="sd-timeline-item"
                    data-animate
                    data-delay={Math.min(idx + 1, 5)}
                  >
                    <div className="sd-timeline-left">
                      <div className="sd-timeline-dot">{idx + 1}</div>
                      {idx < service.process!.length - 1 && <div className="sd-timeline-line" />}
                    </div>
                    <div className="sd-timeline-body">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="sd-section">
        <div className="sd-section-inner" data-animate>
          <div className="sd-section-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="sd-section-content">
            <h2 className="sd-section-title">{t('serviceDetail.packages')}</h2>
            <div className="sd-packages-grid">
              {service.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`sd-package-card ${pkg.highlight ? 'highlighted' : ''}`}
                  data-animate
                  data-delay={Math.min(idx + 1, 4)}
                >
                  <div className="sd-pkg-badges">
                    {pkg.isMonthly && <span className="sd-badge-pill monthly">{t('serviceDetail.monthly')}</span>}
                    {pkg.isOptional && <span className="sd-badge-pill optional">{t('serviceDetail.optional')}</span>}
                    {pkg.highlight && <span className="sd-badge-pill featured">{t('serviceDetail.recommended')}</span>}
                  </div>

                  <h3 className="sd-pkg-name">{isEn ? pkg.nameEn : pkg.name}</h3>

                  <div className="sd-pkg-price-row">
                    <span className="sd-pkg-price">{pkg.price}</span>
                    {pkg.priceNote && <span className="sd-pkg-price-note">{pkg.priceNote}</span>}
                  </div>
                  <span className="sd-pkg-duration">{pkg.duration}</span>

                  <div className="sd-pkg-deliverables">
                    <h4>{t('serviceDetail.whatsIncluded')}</h4>
                    <ul>
                      {pkg.deliverables.map((item, i) => (
                        <li key={i}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={whatsappUrl}
                    className="sd-pkg-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t('serviceDetail.getStarted')}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {service.faq && service.faq.length > 0 && (
        <section className="sd-section">
          <div className="sd-section-inner" data-animate>
            <div className="sd-section-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="sd-section-content">
              <h2 className="sd-section-title">{t('serviceDetail.frequentlyAskedQuestions')}</h2>
              <div className="sd-faq-list">
                {service.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className={`sd-faq-item ${openFaq === idx ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <div className="sd-faq-question">
                      <span>{item.question}</span>
                      <svg className="sd-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <div className="sd-faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sd-cta">
        <div className="sd-cta-glow" />
        <div className="container">
          <div className="sd-cta-content" data-animate>
            <h2>{t('serviceDetail.readyToStart')}</h2>
            <p>{t('serviceDetail.contactForQuote')}</p>
            <div className="sd-cta-buttons">
              <a href={whatsappUrl} className="sd-cta-btn sd-cta-btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('serviceDetail.whatsapp')}
              </a>
              <a href="mailto:hello@jadencysocial.com" className="sd-cta-btn sd-cta-btn-email">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {t('serviceDetail.email')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
