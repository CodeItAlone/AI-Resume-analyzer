'use client';

import React from 'react';
import Image from 'next/image';

interface ResuroxSplashProps {
  onComplete?: () => void;
  className?: string;
}

export const ResuroxSplash: React.FC<ResuroxSplashProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-[#F7F5F0] ${className}`}>
      {/* 1. Primary R + Leaf Mark */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-pulse transition-all duration-700 mb-4">
        <Image
          src="/branding/resurox-mark.png"
          alt="Resurox"
          width={112}
          height={112}
          className="object-contain w-full h-full drop-shadow-md"
          priority
        />
      </div>

      {/* 2. Resurox Wordmark */}
      <div className="relative h-10 w-44 transition-opacity duration-700 mb-2">
        <Image
          src="/branding/resurox-wordmark.png"
          alt="Resurox"
          width={176}
          height={40}
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {/* 3. Subtitle Tagline */}
      <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#0284C7] uppercase mt-1">
        EDIT • ANALYZE • ADVANCE
      </span>
    </div>
  );
};

export default ResuroxSplash;
