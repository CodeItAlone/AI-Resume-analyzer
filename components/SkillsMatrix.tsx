'use client';

import React from 'react';
import { SkillMatchItem } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SkillsMatrixProps {
  matrix: SkillMatchItem[];
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({ matrix }) => {
  const matched = matrix.filter(s => s.status === 'matched');
  const partial = matrix.filter(s => s.status === 'partial');
  const missing = matrix.filter(s => s.status === 'missing');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Skills Breakdown</h3>
          <p className="text-slate-400 text-sm mt-0.5">Required and preferred skills extracted from the job description</p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <span className="flex items-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4 mr-1" /> {matched.length} Matched
          </span>
          <span className="flex items-center text-amber-400">
            <AlertTriangle className="w-4 h-4 mr-1" /> {partial.length} Partial
          </span>
          <span className="flex items-center text-rose-400">
            <XCircle className="w-4 h-4 mr-1" /> {missing.length} Missing
          </span>
        </div>
      </div>

      {matrix.length === 0 ? (
        <p className="text-slate-400 text-sm italic">No specific skills parsed from job description.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matrix.map((item, idx) => {
            const isMatched = item.status === 'matched';
            const isPartial = item.status === 'partial';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start justify-between transition-all ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : isPartial
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="pr-2">
                  <p className="font-semibold text-sm leading-snug">{item.skill}</p>
                  <p className="text-[11px] opacity-80 mt-0.5">{item.reason}</p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isPartial && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {!isMatched && !isPartial && <XCircle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
