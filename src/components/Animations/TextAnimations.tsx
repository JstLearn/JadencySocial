import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  delay?: number;
  stagger?: number;
  triggerOnView?: boolean;
}

export function TextReveal({
  children,
  className = '',
  type = 'words',
  delay = 0,
  stagger = 0.03,
  triggerOnView = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Get the text content
    const text = el.textContent || '';
    el.textContent = '';

    let items: HTMLElement[] = [];

    if (type === 'chars') {
      // Split into characters
      items = text.split('').map((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        return span;
      });
    } else if (type === 'words') {
      // Split into words
      items = text.split(' ').map((word, i, arr) => {
        const span = document.createElement('span');
        span.textContent = word + (i < arr.length - 1 ? '\u00A0' : '');
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        return span;
      });
    }

    // Wrap each item in a container for the animation
    items.forEach((item) => {
      const wrapper = document.createElement('span');
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.appendChild(item);
      el.appendChild(wrapper);
    });

    // Initial state: hidden
    gsap.set(items, {
      y: '100%',
      opacity: 0,
      rotateX: -90,
      transformOrigin: 'top',
    });

    const animation = {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
    };

    let ctx: gsap.Context;

    if (triggerOnView) {
      ctx = gsap.context(() => {
        gsap.to(items, {
          ...animation,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      }, el);
    } else {
      gsap.to(items, { ...animation, delay });
    }

    return () => {
      ctx?.revert();
    };
  }, [type, delay, stagger, triggerOnView]);

  return (
    <div ref={containerRef} className={className} style={{ perspective: '500px' }}>
      {children}
    </div>
  );
}

// Simple fade-up animation for elements
export function FadeUp({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Staggered children animation
export function StaggerIn({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.children;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: staggerDelay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      }
    );
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
