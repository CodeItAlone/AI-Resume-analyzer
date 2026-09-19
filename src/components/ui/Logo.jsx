import React from 'react';

export function Logo({ size = 32, showWordmark = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="flex items-center justify-center bg-[#0E131F] border border-[#1F293D] rounded-xl shadow-sm shrink-0"
        style={{ width: size, height: size, padding: size * 0.15 }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="emuserCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="30%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Left Page (White E) */}
          <path
            d="M20 22 L48 29.5 L48 40 L34 36.5 L34 46 L45 49 L45 57 L34 54.5 L34 65.5 L48 69.5 L48 79.5 L20 72 Z"
            fill="#FFFFFF"
          />
          {/* Right Page (Cyan Lines) */}
          <path
            d="M52 30.5 L78 22 L78 72 L52 80.5 Z"
            stroke="url(#emuserCyan)"
            strokeWidth="6"
            strokeLinejoin="round"
            fill="transparent"
          />
          <line x1="56" y1="39" x2="72" y2="34.5" stroke="url(#emuserCyan)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="56" y1="47.5" x2="72" y2="43" stroke="url(#emuserCyan)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="56" y1="56" x2="72" y2="51.5" stroke="url(#emuserCyan)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="56" y1="64.5" x2="68" y2="61" stroke="url(#emuserCyan)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {showWordmark && (
        <span className="font-sans font-black tracking-wider uppercase text-[#1C1B19] text-xl leading-none">
          EMUSER
        </span>
      )}
    </div>
  );
}
