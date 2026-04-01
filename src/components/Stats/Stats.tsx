import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  target: number;
  suffix: string;
  label: string;
  color: string;
  started: boolean;
}

function Counter({ target, suffix, label, color, started }: CounterProps) {
  const [value, setValue] = useState(0);
  const valueRef = useRef({ val: 0 });

  useEffect(() => {
    if (!started) return;
    const obj = valueRef.current;
    obj.val = 0;
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => setValue(Math.round(obj.val)),
    });
  }, [started, target]);

  return (
    <div className="stat-item" style={{ '--stat-color': color } as React.CSSProperties}>
      <div className="stat-number">
        <span className="stat-value">{value}</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-bar">
        <div
          className="stat-bar-fill"
          style={{
            width: started ? '100%' : '0%',
            background: `linear-gradient(90deg, ${color}, transparent)`,
            transition: 'width 2.2s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stats-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stats-header',
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 80%',
            onEnter: () => setStarted(true),
          },
        }
      );

      // Parallax on mouse move for stats grid
      const statsSection = document.querySelector<HTMLElement>('.stats');
      if (statsSection) {
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth - 0.5) * 2;
          const yPercent = (clientY / innerHeight - 0.5) * 2;

          gsap.to('.stats-grid', {
            x: xPercent * 8,
            y: yPercent * 4,
            duration: 1,
            ease: 'power2.out',
          });

          gsap.to('.stats-bg', {
            x: -xPercent * 15,
            y: -yPercent * 10,
            duration: 1.5,
            ease: 'power2.out',
          });
        };

        statsSection.addEventListener('mousemove', handleMouseMove);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { target: 50, suffix: '+', label: t('stats.clients'), color: '#FFFFFF' },
    { target: 200, suffix: '+', label: t('stats.projects'), color: '#CCCCCC' },
    { target: 3, suffix: '+', label: t('stats.experience'), color: '#888888' },
  ];

  return (
    <section id="stats" className="section stats" ref={sectionRef}>
      {/* Background decoration */}
      <div className="stats-bg" />

      <div className="container">
        <div className="stats-header">
          <span className="section-label">{t('stats.title')}</span>
          <h2 className="section-title">{t('stats.title')}</h2>
          <p className="section-subtitle">{t('stats.subtitle')}</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <Counter
              key={i}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              started={started}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
