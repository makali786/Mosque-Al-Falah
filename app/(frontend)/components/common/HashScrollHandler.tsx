'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * HashScrollHandler
 * Resolves an issue where Next.js doesn't reliably scroll to an anchor tag (#)
 * when navigating between pages. This component listens for route changes and
 * manually triggers the scroll to the element identified by the URL hash.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    
    // If there's no hash, scroll to top immediately
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    let retries = 0;
    const maxRetries = 20; // Try for ~2 seconds
    let scrollSuccess = false;

    const performScroll = () => {
      const currentHash = window.location.hash;
      if (!currentHash) return;

      const id = currentHash.replace('#', '');
      let element = document.getElementById(id);

      // Fallback for case-insensitivity
      if (!element) {
        element = document.getElementById(id.toLowerCase()) || 
                  document.getElementById(id.charAt(0).toUpperCase() + id.slice(1).toLowerCase());
      }

      if (element) {
        // First, an instant jump to get close
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
        
        // Then, a smooth correction slightly later to ensure it's precisely at the mark
        // after any initial layout shifts
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // One more safety check later for late-loading images/content
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1000);

        scrollSuccess = true;
      } else if (retries < maxRetries && !scrollSuccess) {
        retries++;
        setTimeout(performScroll, 100);
      }
    };

    // Initial trigger
    performScroll();

    // Secondary trigger for general page stability
    const finalTimeout = setTimeout(performScroll, 500);

    window.addEventListener('hashchange', performScroll);
    
    return () => {
      clearTimeout(finalTimeout);
      window.removeEventListener('hashchange', performScroll);
    };
  }, [pathname]);

  return null;
}
