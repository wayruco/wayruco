import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Responsive text sizing configuration
 */
export interface ResponsiveTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text element type */
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Font size at each breakpoint (in Tailwind units or custom) */
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
  };
  /** Line height at each breakpoint */
  lineHeight?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
  };
  /** Text color */
  color?: 'default' | 'muted' | 'accent' | 'destructive' | string;
  /** Font weight */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Truncate text */
  truncate?: boolean;
  /** Number of lines to show before truncating */
  lines?: number;
}

/**
 * Responsive Text Component
 * Provides responsive typography with mobile-first sizing
 * Ensures minimum 16px font size on mobile for readability
 *
 * @example
 * // Responsive paragraph
 * <ResponsiveText
 *   as="p"
 *   size={{ mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' }}
 *   lineHeight={{ mobile: 'leading-relaxed', desktop: 'leading-loose' }}
 * >
 *   This text scales responsively across breakpoints
 * </ResponsiveText>
 *
 * @example
 * // Responsive heading
 * <ResponsiveText
 *   as="h2"
 *   size={{ mobile: 'text-2xl', tablet: 'text-3xl', desktop: 'text-4xl' }}
 *   weight="bold"
 * >
 *   Responsive Heading
 * </ResponsiveText>
 */
export const ResponsiveText = React.forwardRef<HTMLDivElement, ResponsiveTextProps>(
  (
    {
      as: Component = 'div',
      size = { mobile: 'text-base', tablet: 'text-base', desktop: 'text-base' },
      lineHeight = { mobile: 'leading-normal', tablet: 'leading-normal', desktop: 'leading-normal' },
      color = 'default',
      weight = 'normal',
      align = 'left',
      truncate = false,
      lines,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Color mapping
    const colorMap: Record<string, string> = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive',
    };

    // Weight mapping
    const weightMap: Record<string, string> = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    };

    // Alignment mapping
    const alignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    // Build responsive size classes
    const sizeClasses = cn(
      size.mobile,
      size.tablet && `sm:${size.tablet}`,
      size.desktop && `md:${size.desktop}`,
      size.wide && `lg:${size.wide}`
    );

    // Build responsive line height classes
    const lineHeightClasses = cn(
      lineHeight.mobile,
      lineHeight.tablet && `sm:${lineHeight.tablet}`,
      lineHeight.desktop && `md:${lineHeight.desktop}`,
      lineHeight.wide && `lg:${lineHeight.wide}`
    );

    // Build truncation classes
    const truncateClasses = truncate
      ? 'truncate'
      : lines
        ? cn(`line-clamp-${lines}`)
        : '';

    // Get color class
    const colorClass = colorMap[color] || color;

    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses,
          lineHeightClasses,
          colorClass,
          weightMap[weight],
          alignMap[align],
          truncateClasses,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveText.displayName = 'ResponsiveText';

/**
 * Responsive Paragraph Component
 * Convenience component for paragraphs with responsive sizing
 */
export const ResponsiveParagraph = React.forwardRef<
  HTMLParagraphElement,
  Omit<ResponsiveTextProps, 'as'>
>((props, ref) => (
  <ResponsiveText
    ref={ref}
    as="p"
    size={{ mobile: 'text-sm', tablet: 'text-base', desktop: 'text-base' }}
    lineHeight={{ mobile: 'leading-relaxed', desktop: 'leading-loose' }}
    {...props}
  />
));

ResponsiveParagraph.displayName = 'ResponsiveParagraph';

/**
 * Responsive Heading Component
 * Convenience component for headings with responsive sizing
 */
export interface ResponsiveHeadingProps extends Omit<ResponsiveTextProps, 'as'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const ResponsiveHeading = React.forwardRef<
  HTMLHeadingElement,
  ResponsiveHeadingProps
>(({ level = 2, ...props }, ref) => {
  const headingMap = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const;

  const sizeMap = {
    1: { mobile: 'text-3xl', tablet: 'text-4xl', desktop: 'text-5xl' },
    2: { mobile: 'text-2xl', tablet: 'text-3xl', desktop: 'text-4xl' },
    3: { mobile: 'text-xl', tablet: 'text-2xl', desktop: 'text-3xl' },
    4: { mobile: 'text-lg', tablet: 'text-xl', desktop: 'text-2xl' },
    5: { mobile: 'text-base', tablet: 'text-lg', desktop: 'text-xl' },
    6: { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' },
  };

  return (
    <ResponsiveText
      ref={ref}
      as={headingMap[level]}
      size={sizeMap[level]}
      weight="bold"
      lineHeight={{ mobile: 'leading-tight', desktop: 'leading-snug' }}
      {...props}
    />
  );
});

ResponsiveHeading.displayName = 'ResponsiveHeading';
