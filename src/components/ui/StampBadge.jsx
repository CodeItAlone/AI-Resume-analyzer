import React from 'react';

export function StampBadge({ score = 75, label = 'STRONG MATCH', rotated = true, className = '' }) {
  return (
    <div
      className={`relative select-none inline-block p-3 sm:p-4 border-4 border-[#7A1F1F] rounded-sm bg-transparent pointer-events-none transition-transform duration-300 ${rotated ? 'transform -rotate-2 hover:rotate-0' : ''} ${className}`}
      style={{
        boxShadow: 'inset 0 0 0 1px #7A1F1F',
      }}
    >
      {/* Background shadow layer simulating registration offset */}
      <div className="absolute top-[2px] left-[2px] opacity-35 border-4 border-[#7A1F1F] rounded-sm p-3 sm:p-4 inset-0 -z-10 flex flex-col items-center justify-center">
        <span className="font-mono font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-widest text-[#7A1F1F]">
          {score}% MATCH
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#7A1F1F] mt-0.5">
          {label}
        </span>
      </div>

      {/* Main Stamp Front */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-mono font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-widest text-[#7A1F1F]">
          {score}% MATCH
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#7A1F1F] border-t border-[#7A1F1F] pt-1 mt-1 w-full text-center">
          {label}
        </span>
      </div>
    </div>
  );
}
