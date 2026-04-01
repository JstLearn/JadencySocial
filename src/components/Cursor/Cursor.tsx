import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Cursor.css';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isClickingRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (!cursor || !dot) return;

    // Initialize at center
    posRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => {
      isClickingRef.current = true;
      cursor.classList.add('clicking');
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      cursor.classList.remove('clicking');
    };

    const onMouseEnterLink = () => {
      isHoveringRef.current = true;
      cursor.classList.add('hovering');
    };

    const onMouseLeaveLink = () => {
      isHoveringRef.current = false;
      cursor.classList.remove('hovering');
    };

    // GSAP animation loop - smooth cursor follow
    const animate = () => {
      // Lerp for smooth follow
      const ease = 0.15;

      posRef.current.x += (mouseRef.current.x - posRef.current.x) * ease;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * ease;

      gsap.set(cursor, {
        x: posRef.current.x,
        y: posRef.current.y,
      });

      requestAnimationFrame(animate);
    };

    // Add listeners to interactive elements
    const addListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, .service-card, .process-step, .stat-item, .btn-primary, .btn-ghost'
      );

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
    };

    // Use mutation observer to catch dynamically added elements
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Initial setup
    addListeners();
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
