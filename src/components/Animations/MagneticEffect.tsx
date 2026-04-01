import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook that adds magnetic attraction effect to an element
 * When mouse hovers near element, it pulls toward cursor
 */
export function useMagnetic(elementRef: React.RefObject<HTMLElement | null>, strength = 0.3) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // If mouse is within 100px, apply magnetic effect
      if (distance < 150) {
        const pull = (1 - distance / 150) * strength;
        gsap.to(el, {
          x: distX * pull,
          y: distY * pull,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Reset position
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);
}

/**
 * Magnetic wrapper component for buttons/links
 */
export function MagneticWrapper({
  children,
  strength = 0.3,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useMagnetic(wrapperRef, strength);

  return (
    <div ref={wrapperRef} className={className} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
}
