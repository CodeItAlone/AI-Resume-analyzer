import React from 'react';

export function SectionMarker({ kicker, title, description, centered = false, className = '' }) {
  return (
    <div className={`mb-10 sm:mb-14 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {kicker && (
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-2.5">
          [ {kicker} ]
        </div>
      )}
      {title && (
        <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#1C1B19] tracking-tight leading-tight mb-3">
          {title}
        </h2>
      )}
      {description && (
        <p className="font-serif italic text-base sm:text-lg text-[#1C1B19]/70 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
