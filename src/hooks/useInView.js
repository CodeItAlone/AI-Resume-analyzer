import { useState, useEffect, useRef } from 'react';

export function useInView(options = { threshold: 0.15, rootMargin: '0px' }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(el); // trigger once
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}
