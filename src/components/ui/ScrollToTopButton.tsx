import { useEffect, useState } from 'react';
import ArrowIcon from '../../assets/arrow.svg?react';
import { ScrollToTopButtonProps } from '../../types/types';


const ScrollToTopButton = ({
  target = 'body',
  threshold = 300,
}: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (target === 'body') {
      const handleScroll = () => {
        setVisible(window.scrollY > threshold);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    const el = target.current;
    if (!el) return;

    const handleScroll = () => {
      setVisible(el.scrollTop > threshold);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [target, threshold]);

  const scrollToTop = () => {
    if (target === 'body') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      target.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <button
      className="scrollToTopBtn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowIcon className='arrowIcon' />
    </button>
  );
};

export default ScrollToTopButton;
