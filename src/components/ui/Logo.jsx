import React from 'react';
import Image from 'next/image';

export function Logo({ size = 66, showWordmark = true, className = '', priority = false }) {
  // Primary brand logo: unified R-Leaf + Resurox + EDIT ANALYZE ADVANCE horizontal graphic
  const height = size;
  const width = Math.round(height * 3.0);

  if (!showWordmark) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/branding/resurox-mark.png"
          alt="Resurox"
          width={size}
          height={size}
          className="object-contain w-full h-full drop-shadow-sm"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative inline-flex items-center justify-start shrink-0 select-none ${className}`}
      style={{ height, width }}
    >
      <Image
        src="/branding/resurox-logo.png"
        alt="Resurox — Edit • Analyze • Advance"
        width={width}
        height={height}
        className="object-contain w-full h-full"
        priority={priority}
      />
    </div>
  );
}

export default Logo;
