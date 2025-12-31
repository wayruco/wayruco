import { useEffect, useState } from 'react';

/**
 * Hook to detect if a media query matches
 * Useful for responsive behavior based on breakpoints
 *
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 480px)');
 * const isTablet = useMediaQuery('(min-width: 481px) and (max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create listener function
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, isClient]);

  return matches;
}

/**
 * Hook to detect current breakpoint
 * Returns the active breakpoint name based on viewport width
 *
 * @returns Current breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
 *
 * @example
 * const breakpoint = useBreakpoint();
 * if (breakpoint === 'mobile') {
 *   // Mobile-specific logic
 * }
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(min-width: 481px) and (max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  return 'wide';
}

/**
 * Hook to check if viewport is at least a certain breakpoint
 *
 * @param breakpoint - Breakpoint to check: 'mobile' | 'tablet' | 'desktop' | 'wide'
 * @returns boolean indicating if viewport is at least this breakpoint
 *
 * @example
 * const isTabletOrLarger = useIsAtLeast('tablet');
 * const isDesktopOrLarger = useIsAtLeast('desktop');
 */
export function useIsAtLeast(
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
): boolean {
  const breakpointMap = {
    mobile: '(min-width: 320px)',
    tablet: '(min-width: 481px)',
    desktop: '(min-width: 769px)',
    wide: '(min-width: 1025px)',
  };

  return useMediaQuery(breakpointMap[breakpoint]);
}

/**
 * Hook to check if viewport is at most a certain breakpoint
 *
 * @param breakpoint - Breakpoint to check: 'mobile' | 'tablet' | 'desktop' | 'wide'
 * @returns boolean indicating if viewport is at most this breakpoint
 *
 * @example
 * const isMobileOrTablet = useIsAtMost('tablet');
 * const isNotWide = useIsAtMost('desktop');
 */
export function useIsAtMost(
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
): boolean {
  const breakpointMap = {
    mobile: '(max-width: 480px)',
    tablet: '(max-width: 768px)',
    desktop: '(max-width: 1024px)',
    wide: '(max-width: 99999px)',
  };

  return useMediaQuery(breakpointMap[breakpoint]);
}
