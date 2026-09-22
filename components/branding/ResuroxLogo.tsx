'use client';

import React from 'react';
import Image from 'next/image';

export interface ResuroxLogoProps {
  /**
   * 'combined': Favicon R-mark + Wordmark on the right (Default)
   * 'mark': Standalone 'R + leaf' emblem
   * 'wordmark': Horizontal Resurox wordmark only
   * 'full': Complete branding with tagline ('EDIT • ANALYZE • ADVANCE')
   */
  variant?: 'combined' | 'mark' | 'wordmark' | 'full';
  /**
   * Predefined size or custom pixel size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Whether to display the tagline in applicable layouts
   */
  showTagline?: boolean;
  /**
   * Optional additional CSS classes
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { mark: 22, height: 16, width: 55 },
  sm: { mark: 30, height: 22, width: 75 },
  md: { mark: 40, height: 28, width: 95 },
  lg: { mark: 48, height: 34, width: 115 },
  xl: { mark: 60, height: 42, width: 142 },
};

export const ResuroxLogo: React.FC<ResuroxLogoProps> = ({
  variant = 'combined',
  size = 'md',
  className = '',
  onClick,
  priority = false,
}) => {
  const sizeConfig = typeof size === 'number'
    ? { mark: size, height: Math.round(size * 0.72), width: Math.round(size * 0.72 * 3.4) }
    : SIZE_MAP[size] || SIZE_MAP.md;

  // 1. Full stacked branding (R + leaf mark + Resurox wordmark + EDIT • ANALYZE • ADVANCE)
  if (variant === 'full') {
    const fullHeight = typeof size === 'number' ? size : sizeConfig.height * 2;
    const fullWidth = fullHeight * 1.5;

    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ width: fullWidth, height: fullHeight }}
      >
        <Image
          src="/branding/resurox-logo.png"
          alt="Resurox — Edit • Analyze • Advance"
          width={fullWidth}
          height={fullHeight}
          className="object-contain w-full h-full"
          priority={priority}
        />
      </div>
    );
  }

  // 2. Wordmark only
  if (variant === 'wordmark') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ height: sizeConfig.height, width: sizeConfig.width }}
      >
        <Image
          src="/branding/resurox-wordmark.png"
          alt="Resurox"
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="object-contain w-full h-full"
          priority={priority}
        />
      </div>
    );
  }

  // 3. Mark only
  if (variant === 'mark') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center shrink-0 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ width: sizeConfig.mark, height: sizeConfig.mark }}
      >
        <Image
          src="/branding/resurox-mark.png"
          alt="Resurox"
          width={sizeConfig.mark}
          height={sizeConfig.mark}
          className="object-contain w-full h-full drop-shadow-sm"
          priority={priority}
        />
      </div>
    );
  }

  // 4. Combined / Primary: Unified R+Quill + Resurox Serif
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-start select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ height: sizeConfig.height, width: Math.round(sizeConfig.height * 4.1) }}
    >
      <Image
        src="/branding/resurox-logo-v3.png"
        alt="Resurox"
        width={Math.round(sizeConfig.height * 4.1)}
        height={sizeConfig.height}
        className="object-contain w-full h-full"
        priority={priority}
        unoptimized={true}
      />
    </div>
  );
};

// Aliases for compatibility
export const EmuserLogo = ResuroxLogo;
export type EmuserLogoProps = ResuroxLogoProps;
export default ResuroxLogo;
