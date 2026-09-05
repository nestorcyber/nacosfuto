import React, { useState } from 'react';
import { getOptimizedImageUrl } from './cloudinary.js';

/**
 * CloudinaryImage - Optimized Responsive Image Component
 * Provides equivalent functionality to next/image for Cloudinary assets
 */
export const CloudinaryImage = ({
  src,
  alt = 'NACOS Media',
  preset,
  width,
  height,
  crop,
  gravity,
  quality = 'auto',
  format = 'auto',
  sizes,
  priority = false,
  className = '',
  style = {},
  crossOrigin,
  fallbackSrc,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src && !fallbackSrc) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-[#083002] flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%', ...style }}
      >
        <span>No image</span>
      </div>
    );
  }

  const effectiveSrc = hasError && fallbackSrc ? fallbackSrc : src;

  // Generate primary optimized URL
  const optimizedUrl = getOptimizedImageUrl(effectiveSrc, {
    preset,
    width,
    height,
    crop,
    gravity,
    quality,
    format
  });

  // If this is a Cloudinary URL and responsive sizes are appropriate, generate srcSet
  let srcSet = undefined;
  if (
    typeof effectiveSrc === 'string' &&
    (effectiveSrc.includes('res.cloudinary.com') || !effectiveSrc.startsWith('http')) &&
    !effectiveSrc.startsWith('data:') &&
    !width // only auto-srcset if specific fixed width is not locked
  ) {
    const responsiveWidths = [320, 480, 640, 768, 1024, 1280];
    srcSet = responsiveWidths
      .map(w => {
        const url = getOptimizedImageUrl(effectiveSrc, {
          preset,
          width: w,
          crop: crop || 'fill',
          gravity,
          quality,
          format
        });
        return `${url} ${w}w`;
      })
      .join(', ');
  }

  return (
    <img
      src={optimizedUrl}
      srcSet={srcSet}
      sizes={sizes || (srcSet ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      crossOrigin={crossOrigin}
      onError={() => {
        if (!hasError && fallbackSrc) {
          setHasError(true);
        }
      }}
      className={className}
      style={style}
      {...props}
    />
  );
};

export default CloudinaryImage;
