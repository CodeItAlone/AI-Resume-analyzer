'use client';

import React from 'react';
import Image from 'next/image';

export interface EmuserLogoProps {
  /**
   * 'full': Logo mark + EMUSER typography + optional tagline
   * 'mark': Standalone emblem mark
   * 'image': High-resolution official raster badge asset
   */
  variant?: 'full' | 'mark' | 'image';
  /**
   * Predefined size or custom pixel size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Whether to display the tagline ('EDIT ANALYZE ADVANCE') in full mode
   */
  showTagline?: boolean;
  /**
   * Whether to wrap the mark in the sleek dark badge container
   */
  withBadge?: boolean;
  /**
   * Optional additional CSS classes
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: { icon: 20, text: 'text-sm', badge: 'p-1 rounded-md' },
  sm: { icon: 28, text: 'text-lg', badge: 'p-1.5 rounded-lg' },
  md: { icon: 36, text: 'text-xl', badge: 'p-2 rounded-xl' },
  lg: { icon: 48, text: 'text-2xl', badge: 'p-2.5 rounded-2xl' },
  xl: { icon: 64, text: 'text-3xl', badge: 'p-3 rounded-2xl' },
};

export const EmuserLogo: React.FC<EmuserLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  withBadge = false,
  className = '',
  onClick,
}) => {
  const sizeConfig = typeof size === 'number' 
    ? { icon: size, text: 'text-base', badge: 'p-1.5 rounded-xl' }
    : SIZE_MAP[size] || SIZE_MAP.md;

  const iconPx = typeof size === 'number' ? size : sizeConfig.icon;

  // Standalone vector representation of the EMUSER book/E emblem
  const renderVectorMark = () => (
    <svg
      width={iconPx}
      height={iconPx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
    >
      <defs>
        <linearGradient id="emuserCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="30%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <filter id="emuserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left Page - Capital 'E' in White */}
      <path
        d="M20 22 L48 29.5 L48 40 L34 36.5 L34 46 L45 49 L45 57 L34 54.5 L34 65.5 L48 69.5 L48 79.5 L20 72 Z"
        fill="#FFFFFF"
      />

      {/* Right Page - Document lines with Cyan Gradient Border */}
      <path
        d="M52 30.5 L78 22 L78 72 L52 80.5 Z"
        stroke="url(#emuserCyanGrad)"
        strokeWidth="6"
        strokeLinejoin="round"
        fill="transparent"
      />

      {/* Horizontal Document Content Lines */}
      <line x1="56" y1="39" x2="72" y2="34.5" stroke="url(#emuserCyanGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="56" y1="47.5" x2="72" y2="43" stroke="url(#emuserCyanGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="56" y1="56" x2="72" y2="51.5" stroke="url(#emuserCyanGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="56" y1="64.5" x2="68" y2="61" stroke="url(#emuserCyanGrad)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );

  // High-res official brand image badge
  if (variant === 'image') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
        style={{ width: iconPx, height: iconPx }}
        onClick={onClick}
      >
        <Image
          src="/emuser-logo.png"
          alt="EMUSER"
          width={iconPx}
          height={iconPx}
          className="rounded-xl object-contain shadow-md"
          priority
        />
      </div>
    );
  }

  // Standalone Mark
  if (variant === 'mark') {
    if (withBadge) {
      return (
        <div 
          onClick={onClick}
          className={`inline-flex items-center justify-center bg-[#0D1117] border border-[#30363D] shadow-sm ${sizeConfig.badge} ${className}`}
        >
          {renderVectorMark()}
        </div>
      );
    }
    return (
      <div onClick={onClick} className={`inline-flex items-center justify-center ${className}`}>
        {renderVectorMark()}
      </div>
    );
  }

  // Full Brand Logo (Mark + Typography)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Icon Mark Badge */}
      <div className="flex items-center justify-center bg-[#0E131F] border border-[#1F293D] p-1.5 rounded-xl shadow-md shrink-0">
        {renderVectorMark()}
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-sans font-black tracking-wider uppercase text-[#1C1B19] ${sizeConfig.text}`}>
          EMUSER
        </span>
        {showTagline && (
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#0284C7] mt-0.5 uppercase">
            EDIT • ANALYZE • ADVANCE
          </span>
        )}
      </div>
    </div>
  );
};

export default EmuserLogo;
