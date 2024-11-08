import { useEffect, useState } from "react";

interface UseInViewProps {
    ref: React.MutableRefObject<HTMLElement | null>;
    threshold?: number;
}

/**
 * Lets you easily determine if an element is in view or not.
 */
const useInView = ({
    ref,
    threshold = 0.1
}: UseInViewProps) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isInView;
};

export { useInView };