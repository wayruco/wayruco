'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Responsive image source configuration
 */
export interface ResponsiveImageSource {
  src: string;
  width: number;
  height: number;
  media?: string; // CSS media query
}

/**
 * Responsive Image Component Props
 */
export interface ResponsiveImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Primary image source */
  src: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Responsive image sources for different breakpoints */
  sources?: ResponsiveImageSource[];
  /** Enable lazy loading */
  lazy?: boolean;
  /** Aspect ratio for responsive sizing */
  aspectRatio?: 'square' | 'video' | 'portrait' | number;
  /** Object fit behavior */
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Use Next.js Image component */
  useNextImage?: boolean;
  /** Responsive sizes for srcSet */
  sizes?: string;
}

/**
 * Responsive Image Component
 * Provides responsive images with srcSet, lazy loading, and aspect ratio support
 * Optimizes images for different breakpoints and device pixel ratios
 *
 * @example
 * // Basic responsive image
 * <ResponsiveImage
 *   src="/image.jpg"
 *   alt="Description"
 *   width={1200}
 *   height={600}
 *   sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 80vw"
 * />
 *
 * @example
 * // With multiple sources for different breakpoints
 * <ResponsiveImage
 *   src="/image-desktop.jpg"
 *   alt="Description"
 *   width={1200}
 *   height={600}
 *   sources={[
 *     { src: '/image-mobile.jpg', width: 480, height: 240, media: '(max-width: 480px)' },
 *     { src: '/image-tablet.jpg', width: 768, height: 384, media: '(max-width: 768px)' },
 *   ]}
 *   lazy
 * />
 */
export const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(
  (
    {
      src,
      alt,
      width,
      height,
      sources,
      lazy = true,
      aspectRatio = 'video',
      objectFit = 'cover',
      showSkeleton = true,
      useNextImage = true,
      sizes = '(max-width: 480px) 100vw, (max-width: 768px) 90vw, 80vw',
      className,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(showSkeleton);
    const [error, setError] = useState(false);

    // Aspect ratio mapping
    const aspectRatioMap: Record<string, string> = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
    };

    // Object fit mapping
    const objectFitMap: Record<string, string> = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      'scale-down': 'object-scale-down',
    };

    const aspectClass =
      typeof aspectRatio === 'number'
        ? `aspect-[${aspectRatio}]`
        : aspectRatioMap[aspectRatio] || 'aspect-video';

    const objectFitClass = objectFitMap[objectFit] || 'object-cover';

    // Build srcSet from sources
    const srcSet = sources
      ?.map((source) => `${source.src} ${source.width}w`)
      .join(', ');

    // Build picture element with sources
    if (sources && sources.length > 0) {
      return (
        <picture className={cn('block overflow-hidden rounded-lg', className)}>
          {sources.map((source, index) => (
            <source key={index} media={source.media} srcSet={source.src} />
          ))}
          <img
            ref={ref}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={lazy ? 'lazy' : 'eager'}
            className={cn(
              'w-full h-full',
              aspectClass,
              objectFitClass,
              isLoading && 'animate-pulse bg-muted'
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
            {...props}
          />
        </picture>
      );
    }

    // Use Next.js Image component if enabled and dimensions provided
    if (useNextImage && width && height) {
      return (
        <div
          className={cn(
            'relative block overflow-hidden rounded-lg',
            aspectClass,
            className
          )}
        >
          {isLoading && showSkeleton && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            ref={ref}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={lazy ? 'lazy' : 'eager'}
            className={cn(
              'w-full h-full',
              objectFitClass,
              isLoading && 'animate-pulse'
            )}
            onLoadingComplete={() => setIsLoading(false)}
            {...(props as any)}
          />
        </div>
      );
    }

    // Fallback to standard img element
    return (
      <div
        className={cn(
          'relative block overflow-hidden rounded-lg',
          aspectClass,
          className
        )}
      >
        {isLoading && showSkeleton && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          srcSet={srcSet}
          sizes={sizes}
          className={cn(
            'w-full h-full',
            aspectClass,
            objectFitClass,
            isLoading && 'animate-pulse'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          {...props}
        />
      </div>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

/**
 * Responsive Picture Component
 * Convenience component for picture elements with multiple sources
 */
export interface ResponsivePictureProps
  extends Omit<ResponsiveImageProps, 'sources'> {
  /** Picture sources for different breakpoints */
  picture: ResponsiveImageSource[];
}

export const ResponsivePicture = React.forwardRef<
  HTMLImageElement,
  ResponsivePictureProps
>(({ picture, ...props }, ref) => (
  <ResponsiveImage ref={ref} sources={picture} {...props} />
));

ResponsivePicture.displayName = 'ResponsivePicture';
