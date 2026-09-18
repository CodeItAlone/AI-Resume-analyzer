import React from 'react';

export function ScoreCell({ label, value, subtitle, className = '' }) {
  return (
    <div className={`border border-[#1C1B19]/20 bg-[#F7F5F0] p-3 sm:p-4 text-left ${className}`}>
      <span className="block font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#1C1B19]/60 mb-1">
        {label}
      </span>
      <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1B19]">
        {value}%
      </div>
      {subtitle && (
        <span className="block font-mono text-[9px] sm:text-[10px] text-[#1C1B19]/50 mt-1 leading-tight">
          {subtitle}
        </span>
      )}
    </div>
  );
}
