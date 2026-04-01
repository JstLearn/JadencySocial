import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CTA.css';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaInnerRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-inner',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.cta-inner',
            start: 'top 80%',
          },
        }
      );

      // Magnetic effect on buttons
      const buttons = [btn1Ref.current, btn2Ref.current];
      buttons.forEach((btn) => {
        if (!btn) return;

        const handleMouseMove = (e: MouseEvent) => {
          const rect = btn!.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distX = e.clientX - centerX;
          const distY = e.clientY - centerY;

          gsap.to(btn, {
            x: distX * 0.15,
            y: distY * 0.15,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section cta" ref={sectionRef}>
      <div className="container">
        <div ref={ctaInnerRef} className="cta-inner">
          {/* Animated background */}
          <div className="cta-bg-animated" />

          <div className="cta-content">
            <span className="section-label">{t('nav.contact')}</span>
            <h2 className="cta-title">{t('cta.title')}</h2>
            <p className="cta-subtitle">{t('cta.subtitle')}</p>
            <p className="cta-desc">{t('cta.description')}</p>

            <div className="cta-actions">
              <a
                ref={btn1Ref}
                href="https://wa.me/905310330687"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary cta-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('cta.whatsapp')}
              </a>
              <a
                ref={btn2Ref}
                href="mailto:hello@jadencysocial.com"
                className="btn-ghost cta-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {t('cta.email')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
