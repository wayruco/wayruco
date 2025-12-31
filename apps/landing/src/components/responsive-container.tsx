import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Responsive Container Component Props
 */
export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding at each breakpoint */
  padding?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  /** Center content */
  center?: boolean;
  /** Flex direction for centering */
  flexDirection?: 'row' | 'col';
}

/**
 * Responsive Container Component
 * Provides a responsive container with configurable padding and max-width
 * Follows mobile-first design principles
 *
 * @example
 * // Basic container with responsive padding
 * <ResponsiveContainer size="lg" padding={{ mobile: 4, tablet: 6, desktop: 8 }}>
 *   Content here
 * </ResponsiveContainer>
 *
 * @example
 * // Centered container
 * <ResponsiveContainer size="md" center>
 *   Centered content
 * </ResponsiveContainer>
 */
export const ResponsiveContainer = React.forwardRef<
  HTMLDivElement,
  ResponsiveContainerProps
>(
  (
    {
      size = 'lg',
      padding = { mobile: 4, tablet: 6, desktop: 8, wide: 8 },
      center = false,
      flexDirection = 'col',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Size mapping (max-width)
    const sizeMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full',
    };

    // Padding mapping (in Tailwind units)
    const paddingClasses = cn(
      padding.mobile && `px-${padding.mobile}`,
      padding.tablet && `sm:px-${padding.tablet}`,
      padding.desktop && `md:px-${padding.desktop}`,
      padding.wide && `lg:px-${padding.wide}`
    );

    // Center classes
    const centerClasses = center
      ? cn(
          'flex',
          flexDirection === 'col' ? 'flex-col' : 'flex-row',
          'items-center justify-center'
        )
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          sizeMap[size],
          paddingClasses,
          centerClasses,
          'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = 'ResponsiveContainer';

/**
 * Responsive Section Component
 * Convenience component for page sections with responsive padding
 */
export interface ResponsiveSectionProps extends ResponsiveContainerProps {
  /** Section background color */
  background?: 'default' | 'muted' | 'accent' | string;
  /** Add vertical padding */
  verticalPadding?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

export const ResponsiveSection = React.forwardRef<
  HTMLDivElement,
  ResponsiveSectionProps
>(
  (
    {
      background = 'default',
      verticalPadding = { mobile: 8, tablet: 12, desktop: 16, wide: 20 },
      padding = { mobile: 4, tablet: 6, desktop: 8, wide: 8 },
      ...props
    },
    ref
  ) => {
    // Background mapping
    const backgroundMap: Record<string, string> = {
      default: 'bg-background',
      muted: 'bg-muted',
      accent: 'bg-accent',
    };

    const bgClass = backgroundMap[background] || background;

    // Vertical padding classes
    const verticalPaddingClasses = cn(
      verticalPadding.mobile && `py-${verticalPadding.mobile}`,
      verticalPadding.tablet && `sm:py-${verticalPadding.tablet}`,
      verticalPadding.desktop && `md:py-${verticalPadding.desktop}`,
      verticalPadding.wide && `lg:py-${verticalPadding.wide}`
    );

    return (
      <section className={cn(bgClass, verticalPaddingClasses)}>
        <ResponsiveContainer ref={ref} padding={padding} {...props} />
      </section>
    );
  }
);

ResponsiveSection.displayName = 'ResponsiveSection';

/**
 * Responsive Content Wrapper
 * Convenience component for wrapping main content with responsive constraints
 */
export interface ResponsiveContentProps extends ResponsiveContainerProps {
  /** Content type for semantic HTML */
  as?: 'main' | 'article' | 'section' | 'div';
}

export const ResponsiveContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveContentProps
>(
  (
    {
      as: Component = 'div',
      size = 'xl',
      padding = { mobile: 4, tablet: 6, desktop: 8, wide: 8 },
      ...props
    },
    ref
  ) => {
    const sizeMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-4xl',
      full: 'max-w-full',
    };

    const paddingClasses = cn(
      padding.mobile && `px-${padding.mobile}`,
      padding.tablet && `sm:px-${padding.tablet}`,
      padding.desktop && `md:px-${padding.desktop}`,
      padding.wide && `lg:px-${padding.wide}`
    );

    return (
      <Component
        ref={ref}
        className={cn(
          'w-full',
          sizeMap[size],
          paddingClasses,
          'mx-auto',
          props.className
        )}
        {...props}
      />
    );
  }
);

ResponsiveContent.displayName = 'ResponsiveContent';
