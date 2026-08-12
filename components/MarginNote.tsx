'use client';

import React from 'react';

interface MarginNoteProps {
  status: 'partial' | 'missing' | 'comment';
  skillOrSubject: string;
  reason?: string;
  delayMs?: number;
}

export const MarginNote: React.FC<MarginNoteProps> = ({
  status,
  skillOrSubject,
  reason,
  delayMs = 0,
}) => {
  const isMissing = status === 'missing';
  const isPartial = status === 'partial';

  const colorClass = isMissing
    ? 'text-[#8B2E2E] border-[#8B2E2E]'
    : isPartial
    ? 'text-[#B8860B] border-[#B8860B]'
    : 'text-[#1C1B19] border-[#1C1B19]';

  return (
    <div
      className="relative flex items-start space-x-2 text-xs sm:text-sm font-serif italic mb-4 group"
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {/* Hairline Leader Line (Desktop anchor indication) */}
      <div className="hidden md:block absolute -left-8 top-3 w-6 h-[1px] bg-[#1C1B19]/30" />

      {/* Left border-rule on mobile / margin callout container */}
      <div className={`pl-3 border-l-2 ${colorClass} py-0.5`}>
        <p className="leading-snug font-bold italic">
          {isMissing && <span className="font-mono not-italic mr-1.5">[ ]</span>}
          {skillOrSubject}
        </p>
        {reason && (
          <p className="text-[11px] sm:text-xs opacity-85 mt-0.5 font-serif italic">
            {reason}
          </p>
        )}
      </div>
    </div>
  );
};
