'use client';

import React from 'react';
import { RequirementMatch } from '@/lib/types/matching';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface RequirementMatrixProps {
  matches: RequirementMatch[];
}

export const RequirementMatrix: React.FC<RequirementMatrixProps> = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="bg-[#F7F5F0] border border-[#1C1B19]/20 p-6 shadow-sm my-6 rounded-none font-serif text-[#1C1B19]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1B19]/20 pb-3 mb-4">
        <div>
          <h3 className="font-serif italic font-bold text-lg text-[#1C1B19]">
            Requirement Evidence Analysis
          </h3>
          <p className="font-mono text-[11px] text-[#1C1B19]/60">
            Factual Requirement Alignment & Support Confidence
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono font-semibold mt-2 sm:mt-0">
          <span className="text-[#2F5233]">✓ Supported</span>
          <span className="text-[#B8860B]">~ Claimed Only</span>
          <span className="text-[#8B2E2E]">✗ Missing</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-serif text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#1C1B19]/30 font-mono text-xs text-[#1C1B19]/70">
              <th className="py-2 pr-4 font-bold uppercase">Requirement</th>
              <th className="py-2 px-4 font-bold uppercase">Type</th>
              <th className="py-2 px-4 font-bold uppercase">Match Status</th>
              <th className="py-2 px-4 font-bold uppercase">Confidence</th>
              <th className="py-2 pl-4 font-bold uppercase">Evidence Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1B19]/10">
            {matches.map((item, idx) => {
              const isMatched = item.status === 'MATCHED';
              const isClaimedOnly = item.status === 'CLAIMED_ONLY';
              const isPartial = item.status === 'PARTIAL';

              return (
                <tr key={idx} className="hover:bg-[#1C1B19]/5 transition-colors">
                  <td className="py-3 pr-4 font-bold text-[#1C1B19]">
                    {item.requirement.text}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs uppercase text-[#1C1B19]/70">
                    <span className={`px-1.5 py-0.5 border ${item.requirement.requirementType === 'REQUIRED' ? 'border-[#8B2E2E] text-[#8B2E2E] font-bold' : 'border-[#1C1B19]/30'}`}>
                      {item.requirement.requirementType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">
                    {isMatched && (
                      <span className="text-[#2F5233] font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> MATCHED
                      </span>
                    )}
                    {isClaimedOnly && (
                      <span className="text-[#B8860B] font-bold flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> CLAIMED ONLY
                      </span>
                    )}
                    {isPartial && (
                      <span className="text-[#B8860B] font-bold flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> PARTIAL
                      </span>
                    )}
                    {!isMatched && !isClaimedOnly && !isPartial && (
                      <span className="text-[#8B2E2E] font-bold flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> MISSING
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-[#1C1B19]">
                    {Math.round(item.confidence * 100)}%
                  </td>
                  <td className="py-3 pl-4 text-xs italic text-[#1C1B19]/80">
                    {item.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
