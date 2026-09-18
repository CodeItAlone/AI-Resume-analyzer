'use client';

import React from 'react';
import { EmuserLogo } from '@/components/branding';

interface ProcessingStateProps {
  currentStageIdx: number;
  stages: string[];
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  currentStageIdx,
  stages,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#F7F5F0] border border-[#1C1B19]/20 shadow-lg p-8 sm:p-12 my-8 text-[#1C1B19] rounded-none select-none">
      {/* Quiet Manuscript Silhouette Preview */}
      <div className="space-y-6 opacity-30 animate-pulse">
        <div className="h-8 bg-[#1C1B19] w-1/3 rounded-none" />
        <div className="h-4 bg-[#1C1B19] w-1/2 rounded-none" />
        <div className="space-y-2 pt-4">
          <div className="h-3 bg-[#1C1B19] w-full" />
          <div className="h-3 bg-[#1C1B19] w-5/6" />
          <div className="h-3 bg-[#1C1B19] w-4/6" />
        </div>
      </div>

      {/* Editor's Desk Staged Pipeline Overlay */}
      <div className="mt-8 border-t-2 border-[#1C1B19] pt-6 flex flex-col items-center text-center">
        <div className="mb-3">
          <EmuserLogo variant="mark" withBadge size="md" className="animate-pulse" />
        </div>

        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-2">
          [ EMUSER PIPELINE — EVIDENCE EVALUATION ]
        </div>

        <h3 className="font-serif italic text-2xl font-bold text-[#1C1B19] mb-4">
          {stages[currentStageIdx] || 'Processing Analysis...'}
        </h3>

        {/* Monospace Staged Stepper Bar */}
        <div className="w-full max-w-md bg-[#1C1B19]/5 border border-[#1C1B19]/20 p-2 font-mono text-xs mb-4">
          <div className="flex justify-between items-center mb-1 text-[11px] text-[#1C1B19]/70">
            <span>STAGE {currentStageIdx + 1}/{stages.length}</span>
            <span>{Math.round(((currentStageIdx + 1) / stages.length) * 100)}%</span>
          </div>
          <div className="w-full bg-[#1C1B19]/20 h-1.5 rounded-none">
            <div
              className="bg-[#7A1F1F] h-full transition-all duration-500"
              style={{ width: `${((currentStageIdx + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 font-mono text-[10px]">
          {stages.map((stage, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 border ${
                idx === currentStageIdx
                  ? 'border-[#7A1F1F] text-[#7A1F1F] font-bold bg-[#7A1F1F]/5'
                  : idx < currentStageIdx
                  ? 'border-[#2F5233] text-[#2F5233] line-through opacity-70'
                  : 'border-[#1C1B19]/20 text-[#1C1B19]/40'
              }`}
            >
              {stage}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
