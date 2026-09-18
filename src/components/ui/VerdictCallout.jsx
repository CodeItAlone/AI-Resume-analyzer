import React from 'react';

export function VerdictCallout({ title = 'Recruiter Executive Verdict', children, className = '' }) {
  return (
    <div className={`border-l-4 border-[#7A1F1F] bg-[#7A1F1F]/5 p-4 sm:p-5 my-4 ${className}`}>
      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A1F1F] block mb-1.5">
        {title}
      </span>
      <div className="font-serif italic text-sm sm:text-base text-[#1C1B19] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
