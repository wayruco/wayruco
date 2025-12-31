import { useMemo } from 'react';
import { useBreakpoint } from './use-media-query';

/**
 * Responsive value configuration for different breakpoints
 */
export interface ResponsiveConfig<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

/**
 * Hook to get a value based on current breakpoint
 * Useful for responsive values that change at different screen sizes
 *
 * @param config - Object with values for each breakpoint
 * @returns The value for the current breakpoint
 *
 * @example
 * const columns = useResponsiveValue({
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 3,
 *   wide: 4
 * });
 *
 * const fontSize = useResponsiveValue({
 *   mobile: 14,
 *   desktop: 16
 * });
 */
export function useResponsiveValue<T>(config: ResponsiveConfig<T>): T | undefined {
  const breakpoint = useBreakpoint();

  return useMemo(() => {
    // Return value for current breakpoint, or fallback to previous breakpoint
    switch (breakpoint) {
      case 'wide':
        return config.wide ?? config.desktop ?? config.tablet ?? config.mobile;
      case 'desktop':
        return config.desktop ?? config.tablet ?? config.mobile;
      case 'tablet':
        return config.tablet ?? config.mobile;
      case 'mobile':
        return config.mobile;
      default:
        return undefined;
    }
  }, [breakpoint, config]);
}

/**
 * Hook to get responsive spacing (padding/margin)
 *
 * @param config - Spacing values for each breakpoint (in pixels)
 * @returns CSS padding/margin value for current breakpoint
 *
 * @example
 * const padding = useResponsiveSpacing({
 *   mobile: 16,
 *   tablet: 20,
 *   desktop: 24,
 *   wide: 32
 * });
 */
export function useResponsiveSpacing(config: ResponsiveConfig<number>): string | undefined {
  const value = useResponsiveValue(config);
  return value !== undefined ? `${value}px` : undefined;
}

/**
 * Hook to get responsive font size
 *
 * @param config - Font sizes for each breakpoint (in pixels)
 * @returns CSS font-size value for current breakpoint
 *
 * @example
 * const fontSize = useResponsiveFontSize({
 *   mobile: 14,
 *   tablet: 16,
 *   desktop: 18
 * });
 */
export function useResponsiveFontSize(config: ResponsiveConfig<number>): string | undefined {
  const value = useResponsiveValue(config);
  return value !== undefined ? `${value}px` : undefined;
}

/**
 * Hook to get responsive grid columns
 *
 * @param config - Column counts for each breakpoint
 * @returns CSS grid-template-columns value for current breakpoint
 *
 * @example
 * const gridCols = useResponsiveGridColumns({
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 3,
 *   wide: 4
 * });
 */
export function useResponsiveGridColumns(config: ResponsiveConfig<number>): string | undefined {
  const value = useResponsiveValue(config);
  return value !== undefined ? `repeat(${value}, minmax(0, 1fr))` : undefined;
}

/**
 * Hook to get responsive gutter (gap) size
 *
 * @param config - Gutter sizes for each breakpoint (in pixels)
 * @returns CSS gap value for current breakpoint
 *
 * @example
 * const gap = useResponsiveGutter({
 *   mobile: 16,
 *   tablet: 20,
 *   desktop: 24,
 *   wide: 32
 * });
 */
export function useResponsiveGutter(config: ResponsiveConfig<number>): string | undefined {
  const value = useResponsiveValue(config);
  return value !== undefined ? `${value}px` : undefined;
}
