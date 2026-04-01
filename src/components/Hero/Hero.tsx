import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleSystem from './ParticleSystem';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate label
      gsap.fromTo(
        '.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );

      // Animate title - simple fade up
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 50, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, delay: 0.4, ease: 'power4.out' }
      );

      // Subtitle
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' }
      );

      // Description
      gsap.fromTo(
        '.hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.1, ease: 'power3.out' }
      );

      // Actions
      gsap.fromTo(
        '.hero-actions',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'power3.out' }
      );

      // Scroll indicator
      gsap.fromTo(
        '.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.8, ease: 'power2.out' }
      );

      // Scroll indicator bounce
      gsap.to('.hero-scroll-arrow', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
      });

      // Parallax on mouse move
      const hero = document.querySelector<HTMLElement>('.hero');
      if (hero) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth - 0.5) * 2;
          const yPercent = (clientY / innerHeight - 0.5) * 2;

          gsap.to('.hero-content', {
            x: xPercent * 20,
            y: yPercent * 10,
            duration: 1,
            ease: 'power2.out',
          });
        };

        hero.addEventListener('mousemove', handleMouseMove);
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) servicesEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      {/* WebGL Canvas */}
      <div className="hero-canvas">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 75, near: 0.01, far: 100 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
        >
          <ParticleSystem />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="hero-overlay-top" />
      <div className="hero-overlay-bottom" />
      <div className="hero-overlay-radial" />

      {/* Content */}
      <div className="hero-content" ref={contentRef}>
        <div className="container">
          <div className="hero-inner">
            <span className="hero-label section-label">
              Social Media Agency
            </span>

            <h1 className="hero-title">
              <span className="gradient-text">Jadency</span>
              <br />
              Social
            </h1>

            <p className="hero-subtitle">{t('hero.subtitle')}</p>
            <p className="hero-desc">{t('hero.description')}</p>

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {t('hero.cta')}
              </a>
              <a href="#services" className="btn-ghost">
                {t('nav.services')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" ref={scrollRef} onClick={handleScrollDown}>
        <span className="hero-scroll-text">{t('hero.scroll')}</span>
        <div className="hero-scroll-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
