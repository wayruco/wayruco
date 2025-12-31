/**
 * Responsive breakpoint configuration for mobile-first design
 * Defines breakpoints, columns, gutters, and typography sizes
 */

export interface Breakpoint {
  name: 'mobile' | 'tablet' | 'desktop' | 'wide';
  minWidth: number;
  maxWidth?: number;
  columns: number;
  gutter: number;
  fontSize: {
    base: number;
    heading: number;
  };
  touchTarget: number;
}

/**
 * Breakpoint definitions following mobile-first approach
 * Mobile: 320px-480px (phones)
 * Tablet: 481px-768px (tablets, small laptops)
 * Desktop: 769px-1024px (laptops)
 * Wide: 1025px+ (large monitors)
 */
export const breakpoints: Record<string, Breakpoint> = {
  mobile: {
    name: 'mobile',
    minWidth: 320,
    maxWidth: 480,
    columns: 1,
    gutter: 16,
    fontSize: { base: 16, heading: 24 },
    touchTarget: 44,
  },
  tablet: {
    name: 'tablet',
    minWidth: 481,
    maxWidth: 768,
    columns: 2,
    gutter: 20,
    fontSize: { base: 16, heading: 28 },
    touchTarget: 44,
  },
  desktop: {
    name: 'desktop',
    minWidth: 769,
    maxWidth: 1024,
    columns: 3,
    gutter: 24,
    fontSize: { base: 16, heading: 32 },
    touchTarget: 44,
  },
  wide: {
    name: 'wide',
    minWidth: 1025,
    columns: 4,
    gutter: 32,
    fontSize: { base: 18, heading: 36 },
    touchTarget: 44,
  },
};

/**
 * Get breakpoint configuration by name
 */
export function getBreakpoint(name: string): Breakpoint | undefined {
  return breakpoints[name];
}

/**
 * Get all breakpoint names
 */
export function getBreakpointNames(): string[] {
  return Object.keys(breakpoints);
}

/**
 * Get breakpoint by viewport width
 */
export function getBreakpointByWidth(width: number): Breakpoint {
  if (width >= breakpoints.wide.minWidth) {
    return breakpoints.wide;
  }
  if (width >= breakpoints.desktop.minWidth) {
    return breakpoints.desktop;
  }
  if (width >= breakpoints.tablet.minWidth) {
    return breakpoints.tablet;
  }
  return breakpoints.mobile;
}

/**
 * Tailwind breakpoint values for responsive utilities
 */
export const tailwindBreakpoints = {
  mobile: '320px',
  sm: '480px',
  tablet: '481px',
  md: '768px',
  desktop: '769px',
  lg: '1024px',
  wide: '1025px',
  xl: '1280px',
  '2xl': '1536px',
};
