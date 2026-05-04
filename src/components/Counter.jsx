import { useEffect, useRef, useState } from 'react';

/**
 * Counter — animates from 0 to `value` when scrolled into view.
 * Cubic ease-out, ~1.6s duration.
 */
export const Counter = ({ value, suffix = '', duration = 1600 }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const numericValue = parseFloat(value);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(numericValue * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [numericValue, duration]);

  const formatted = numericValue % 1 !== 0 ? n.toFixed(1) : Math.round(n);
  return <span ref={ref}>{formatted}{suffix}</span>;
};
