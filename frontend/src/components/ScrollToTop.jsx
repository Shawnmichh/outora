import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that navigation to a new route
 * automatically scrolls to the top of the page.
 * 
 * This provides a consistent UX where users always start at the
 * top of a page when navigating, rather than maintaining scroll
 * position from the previous page.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
