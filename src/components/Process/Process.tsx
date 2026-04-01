import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const stepIcons = [
  // Analysis
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
    <path d="M8 11h6M11 8v6"/>
  </svg>,
  // Strategy
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>,
  // Production
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>,
  // Growth
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>,
];

const stepColors = ['#FFFFFF', '#CCCCCC', '#888888', '#AAAAAA'];

export default function Process() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const stepKeys = ['analysis', 'strategy', 'production', 'growth'] as const;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-header',
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        '.process-step',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 80%',
          },
        }
      );

      // Magnetic effect on process steps
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = step.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distX = e.clientX - centerX;
          const distY = e.clientY - centerY;

          gsap.to(step, {
            x: distX * 0.06,
            y: distY * 0.06,
            duration: 0.4,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(step, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        step.addEventListener('mousemove', handleMouseMove);
        step.addEventListener('mouseleave', handleMouseLeave);
      });

      gsap.fromTo(
        '.process-connector',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 75%',
          },
        }
      );

      // Parallax on mouse move
      const processSection = document.querySelector<HTMLElement>('.process');
      if (processSection) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth - 0.5) * 2;
          const yPercent = (clientY / innerHeight - 0.5) * 2;

          gsap.to('.process-steps', {
            x: xPercent * 6,
            y: yPercent * 3,
            duration: 1,
            ease: 'power2.out',
          });
        };

        processSection.addEventListener('mousemove', handleMouseMove);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="section process" ref={sectionRef}>
      <div className="container">
        <div className="process-header">
          <span className="section-label">{t('nav.process')}</span>
          <h2 className="section-title">{t('process.title')}</h2>
          <p className="section-subtitle">{t('process.subtitle')}</p>
        </div>

        <div className="process-steps">
          {stepKeys.map((key, i) => (
            <div
              key={key}
              className="process-step"
              style={{ '--step-color': stepColors[i] } as React.CSSProperties}
            >
              {/* Connector line (between steps) */}
              {i < stepKeys.length - 1 && (
                <div className="process-connector">
                  <div className="process-connector-line" />
                  <svg className="process-connector-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Step number */}
              <div className="process-step-num">0{i + 1}</div>

              {/* Icon */}
              <div className="process-step-icon">{stepIcons[i]}</div>

              {/* Content */}
              <div className="process-step-content">
                <h3 className="process-step-title">
                  {t(`process.steps.${key}.title`)}
                </h3>
                <p className="process-step-desc">
                  {t(`process.steps.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
