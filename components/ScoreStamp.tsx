'use client';

import React from 'react';

interface ScoreStampProps {
  score: number;
  label: string;
}

export const ScoreStamp: React.FC<ScoreStampProps> = ({ score, label }) => {
  return (
    <div
      className="relative select-none animate-stamp inline-block p-3 sm:p-4 border-4 border-[#7A1F1F] rounded-sm bg-transparent pointer-events-none transform -rotate-2"
      style={{
        boxShadow: 'inset 0 0 0 1px #7A1F1F',
      }}
    >
      {/* Background layer simulating double-strike / registration offset texture */}
      <div className="absolute top-[2px] left-[2px] opacity-40 border-4 border-[#7A1F1F] rounded-sm p-3 sm:p-4 inset-0 -z-10 pointer-events-none flex flex-col items-center justify-center">
        <span className="font-mono font-extrabold text-2xl sm:text-3xl tracking-widest text-[#7A1F1F]">
          {score}% MATCH
        </span>
        <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-[#7A1F1F] mt-0.5">
          {label}
        </span>
      </div>

      {/* Main Stamp Front */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-mono font-extrabold text-2xl sm:text-3xl tracking-widest text-[#7A1F1F]">
          {score}% MATCH
        </span>
        <span className="font-mono text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-[#7A1F1F] border-t border-[#7A1F1F] pt-1 mt-1 w-full text-center">
          {label}
        </span>
      </div>
    </div>
  );
};
