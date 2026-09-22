import React from 'react';
import Image from 'next/image';

export function Logo({ size = 52, showWordmark = true, className = '', priority = false }) {
  // Primary brand logo: unified R-Quill + Resurox serif horizontal graphic
  const height = size;
  const width = Math.round(height * 4.1);

  if (!showWordmark) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/branding/resurox-mark-v3.png"
          alt="Resurox"
          width={size}
          height={size}
          className="object-contain w-full h-full drop-shadow-sm"
          priority={priority}
          unoptimized={true}
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
        src="/branding/resurox-logo-v3.png"
        alt="Resurox"
        width={width}
        height={height}
        className="object-contain w-full h-full"
        priority={priority}
        unoptimized={true}
      />
    </div>
  );
}

export default Logo;
