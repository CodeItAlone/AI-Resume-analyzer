'use client';

import React from 'react';
import { MultiDimensionalScores } from '@/lib/types/scoring';

interface MultiScoreBreakdownProps {
  scores: MultiDimensionalScores;
}

export const MultiScoreBreakdown: React.FC<MultiScoreBreakdownProps> = ({ scores }) => {
  if (!scores) return null;

  const items = [
    { label: 'Job Match', score: scores.jobMatchScore, desc: 'Requirement alignment' },
    { label: 'Evidence Strength', score: scores.evidenceStrengthScore, desc: 'Demonstrated experience vs listed claims' },
    { label: 'Resume Quality', score: scores.resumeQualityScore, desc: 'Clarity, metrics & structure' },
    { label: 'ATS Compatibility', score: scores.atsCompatibilityScore, desc: 'Machine parseability' },
  ];

  return (
    <div className="bg-[#1C1B19]/5 border border-[#1C1B19]/20 p-5 font-mono text-xs my-6 rounded-none">
      <div className="flex items-center justify-between border-b border-[#1C1B19]/20 pb-2 mb-3">
        <span className="font-bold text-sm uppercase text-[#1C1B19]">Multi-Dimensional Evaluation Breakdown</span>
        <span className="text-[#2F5233] font-bold">Evidence Coverage: {Math.round(scores.evidenceCoverage * 100)}%</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {items.map((item, idx) => (
          <div key={idx} className="border-r border-[#1C1B19]/10 last:border-0 pr-2">
            <span className="block text-[10px] uppercase text-[#1C1B19]/60 font-semibold">{item.label}</span>
            <span className="text-xl font-extrabold text-[#1C1B19]">{item.score}%</span>
            <span className="block text-[9px] text-[#1C1B19]/50 font-sans mt-0.5">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
