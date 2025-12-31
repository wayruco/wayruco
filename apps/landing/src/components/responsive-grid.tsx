import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Responsive grid configuration
 */
export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at each breakpoint */
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  /** Gap/gutter size at each breakpoint (in pixels) */
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  /** Auto-fit or auto-fill behavior */
  autoFit?: boolean;
  /** Minimum column width for auto-fit (in pixels) */
  minColWidth?: number;
}

/**
 * Responsive Grid Component
 * Provides a flexible grid layout that adapts to different screen sizes
 * Uses CSS Grid with responsive column counts
 * Maintains the existing visual design while adding responsive behavior
 *
 * @example
 * // Fixed columns at each breakpoint
 * <ResponsiveGrid
 *   columns={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
 *   gap={{ mobile: 16, tablet: 20, desktop: 24, wide: 32 }}
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ResponsiveGrid>
 */
export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      columns = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
      gap = { mobile: 16, tablet: 20, desktop: 24, wide: 32 },
      autoFit = false,
      minColWidth = 250,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // For auto-fit, use inline style with CSS Grid
    const gridStyle = autoFit
      ? {
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
          gap: `${gap.mobile}px`,
        }
      : {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.mobile}, minmax(0, 1fr))`,
          gap: `${gap.mobile}px`,
        };

    // Build responsive media queries for non-auto-fit grids
    const responsiveStyle = !autoFit
      ? `
        @media (min-width: 481px) {
          .responsive-grid-${Math.random().toString(36).substr(2, 9)} {
            grid-template-columns: repeat(${columns.tablet || columns.mobile}, minmax(0, 1fr));
            gap: ${gap.tablet || gap.mobile}px;
          }
        }
        @media (min-width: 769px) {
          .responsive-grid-${Math.random().toString(36).substr(2, 9)} {
            grid-template-columns: repeat(${columns.desktop || columns.tablet || columns.mobile}, minmax(0, 1fr));
            gap: ${gap.desktop || gap.tablet || gap.mobile}px;
          }
        }
        @media (min-width: 1025px) {
          .responsive-grid-${Math.random().toString(36).substr(2, 9)} {
            grid-template-columns: repeat(${columns.wide || columns.desktop || columns.tablet || columns.mobile}, minmax(0, 1fr));
            gap: ${gap.wide || gap.desktop || gap.tablet || gap.mobile}px;
          }
        }
      `
      : '';

    return (
      <div
        ref={ref}
        className={cn('responsive-grid', className)}
        style={{ ...gridStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';

/**
 * Responsive Flex Component
 * Provides flexible layout that adapts to different screen sizes
 * Uses Flexbox with responsive direction and wrapping
 * Maintains existing visual design while adding responsive behavior
 *
 * @example
 * // Responsive flex direction
 * <ResponsiveFlex
 *   direction={{ mobile: 'column', tablet: 'row' }}
 *   gap={{ mobile: 16, desktop: 24 }}
 * >
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ResponsiveFlex>
 */
export interface ResponsiveFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction at each breakpoint */
  direction?: {
    mobile?: 'row' | 'column';
    tablet?: 'row' | 'column';
    desktop?: 'row' | 'column';
    wide?: 'row' | 'column';
  };
  /** Gap/gutter size at each breakpoint (in pixels) */
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  /** Justify content alignment */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /** Align items alignment */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  /** Allow wrapping */
  wrap?: boolean;
}

export const ResponsiveFlex = React.forwardRef<HTMLDivElement, ResponsiveFlexProps>(
  (
    {
      direction = { mobile: 'column', tablet: 'row' },
      gap = { mobile: 16, desktop: 24 },
      justify = 'flex-start',
      align = 'flex-start',
      wrap = true,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const flexStyle = {
      display: 'flex',
      flexDirection: direction.mobile as 'row' | 'column',
      gap: `${gap.mobile}px`,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    };

    return (
      <div
        ref={ref}
        className={cn('responsive-flex', className)}
        style={{ ...flexStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveFlex.displayName = 'ResponsiveFlex';
