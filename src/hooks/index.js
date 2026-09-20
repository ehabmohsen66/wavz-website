import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — IntersectionObserver hook for scroll-in animations.
 *
 * Usage:
 *   const [ref, visible] = useReveal();
 *   <div ref={ref} className={visible ? 'opacity-100' : 'opacity-0'}>...</div>
 */
export const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/**
 * useScrolled — true when window.scrollY exceeds threshold.
 * Used for sticky-nav background switch.
 */
export const useScrolled = (threshold = 30) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
};

export { useSettings } from './useSettings.js';
export { 
  useTimeline, 
  useTestimonials, 
  useNavigation, 
  useBlog, 
  useNews, 
  useTeam, 
  usePartners, 
  useServices,
  usePages,
  useClients,
  useBlogCategories
} from './useContent.js';

