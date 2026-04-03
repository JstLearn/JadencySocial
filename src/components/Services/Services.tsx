import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const serviceIcons = [
  <svg key="brand" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>,
  <svg key="web" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>,
  <svg key="ecommerce" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>,
  <svg key="ads" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>,
  <svg key="video" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="15" height="12" rx="2"/>
    <path d="M17 10l5-3v10l-5-3V10z"/>
  </svg>,
  <svg key="social" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
  </svg>,
];

const serviceKeys = ['brand', 'web', 'ecommerce', 'ads', 'video', 'social'] as const;

const serviceColors = [
  '#E8B86D',  // brand - altın
  '#5BA4E6',  // web - mavi
  '#7B68EE',  // ecommerce - mor
  '#4ECDC4',  // ads - turkuaz
  '#FF8C42',  // video - turuncu
  '#FF6B9D',  // social - pembe
];

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  const handleCardClick = (key: string) => {
    navigate(`/hizmetler/${key}`);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.services-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-header',
            start: 'top 85%',
          },
        }
      );

      // Each step animates on scroll and activates when centered
      gsap.utils.toArray<HTMLElement>('.journey-step').forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
            },
          }
        );
      });

      // Center step detection - progress aligned to viewport center
      const updateActiveStep = () => {
        const steps = document.querySelectorAll('.journey-step');
        const stepsContainer = document.querySelector('.journey-steps') as HTMLElement;
        if (steps.length === 0 || !stepsContainer) return;

        const viewportCenter = window.innerHeight / 2;
        const scrollY = window.scrollY;

        // Get the first and last step's initial (page-relative) top positions
        const firstStep = steps[0];
        const lastStep = steps[steps.length - 1];

        const firstRect = firstStep.getBoundingClientRect();
        const lastRect = lastStep.getBoundingClientRect();

        // Initial top = current viewport top + scroll
        const firstInitialTop = firstRect.top + scrollY;
        const lastInitialTop = lastRect.top + scrollY;

        // Total scroll distance from first center at viewport center to last center at viewport center
        const totalTravel = lastInitialTop - firstInitialTop;
        if (totalTravel <= 0) return;

        // How far we've scrolled past the first step's ideal position
        // First step is at ideal position when: firstInitialTop - scrollY = viewportCenter (step's top at viewport center)
        // But we want the CENTER of the step at viewport center:
        // firstInitialTop + stepHeight/2 - scrollY = viewportCenter
        // scrollY = firstInitialTop + stepHeight/2 - viewportCenter
        const stepHeight = firstRect.height;
        const scrollYWhenFirstAtCenter = firstInitialTop + stepHeight / 2 - viewportCenter;

        // Progress from 0 to 6 as we scroll from firstAtCenter to lastAtCenter
        const progress = ((scrollY - scrollYWhenFirstAtCenter) / totalTravel) * 6;

        // Round to 0.5 increments
        const steppedProgress = Math.floor(progress) + (progress % 1 >= 0.5 ? 0.5 : 0);

        setActiveStep(Math.min(Math.max(steppedProgress, 0), 5.5));
      };

      // Initial check
      updateActiveStep();

      // Update on scroll with rAF for smooth animation
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updateActiveStep();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

    // Sync SVG path height with journey-steps container
    useEffect(() => {
      const syncPathHeight = () => {
        const pathEl = document.querySelector('.journey-path') as HTMLElement;
        const stepsEl = document.querySelector('.journey-steps') as HTMLElement;
        if (pathEl && stepsEl) {
          pathEl.style.height = stepsEl.offsetHeight + 'px';
        }
      };

      syncPathHeight();
      window.addEventListener('resize', syncPathHeight);
      return () => window.removeEventListener('resize', syncPathHeight);
    }, []);

  const currentStepIndex = Math.max(0, Math.min(serviceColors.length - 1, Math.floor(activeStep)));
  const currentPathColor = activeStep >= 0 ? serviceColors[currentStepIndex] : serviceColors[0];

  return (
    <>
      <section id="services" className="section services" ref={sectionRef}>
        <div className="container">
          <div className="services-header">
            <span className="section-label">{t('nav.services')}</span>
            <h2 className="section-title">{t('services.title')}</h2>
            <p className="section-subtitle">{t('services.subtitle')}</p>
          </div>

          {/* Vertical Journey */}
          <div className="services-journey" style={{ '--active-step': activeStep, '--current-path-color': currentPathColor } as React.CSSProperties}>
            {/* S-Curve Path */}
            <div className="journey-path">
              <svg className="journey-path-svg" viewBox="0 0 400 350" preserveAspectRatio="none">
                <defs></defs>
                {/* S-Curve with 200px amplitude - bulges to x=100 (left) and x=300 (right) */}
                {/* Cards stay inside the curve valleys */}
                <path
                  className="journey-path-bg"
                  d="M 200 0
                     C 250 15, 300 30, 300 45
                     C 300 60, 250 75, 200 90
                     C 150 105, 100 125, 100 140
                     C 100 155, 150 170, 200 185
                     C 250 200, 300 220, 300 245
                     C 300 270, 250 290, 200 305
                     C 150 320, 100 335, 100 350"
                />
                <path
                  className="journey-path-inner"
                  d="M 200 0
                     C 250 15, 300 30, 300 45
                     C 300 60, 250 75, 200 90
                     C 150 105, 100 125, 100 140
                     C 100 155, 150 170, 200 185
                     C 250 200, 300 220, 300 245
                     C 300 270, 250 290, 200 305
                     C 150 320, 100 335, 100 350"
                />
                <path
                  className="journey-path-glow"
                  d="M 200 0
                     C 250 15, 300 30, 300 45
                     C 300 60, 250 75, 200 90
                     C 150 105, 100 125, 100 140
                     C 100 155, 150 170, 200 185
                     C 250 200, 300 220, 300 245
                     C 300 270, 250 290, 200 305
                     C 150 320, 100 335, 100 350"
                />
              </svg>
            </div>

            {/* Steps */}
            <div className="journey-steps">
              {serviceKeys.map((key, i) => (
                <div
                  key={key}
                  data-index={i}
                  className={`journey-step ${i % 2 === 0 ? 'left' : 'right'} ${activeStep >= i ? 'active' : ''} ${Math.floor(activeStep) === i ? 'centered' : ''}`}
                  style={{ '--step-color': serviceColors[i] } as React.CSSProperties}
                  onClick={() => handleCardClick(key)}
                >

                  <div className="step-card">
                    <div className="step-icon">
                      {serviceIcons[i]}
                    </div>
                    <div className="step-info">
                      <h3 className="step-title">
                        {t(`services.items.${key}.title`)}
                      </h3>
                      <p className="step-desc">
                        {t(`services.items.${key}.desc`)}
                      </p>
                      <ul className="step-bullets">
                        {(t(`services.items.${key}.bullets`, { returnObjects: true }) as string[]).slice(0, 3).map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                      <button className="step-cta">
                        {t('common.seeDetails')}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
