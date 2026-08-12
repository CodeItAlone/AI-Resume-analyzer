'use client';

import React from 'react';
import { ExplanationFeedback } from '@/lib/types';
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface FeedbackSectionProps {
  explanation: ExplanationFeedback;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ explanation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Strengths */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Verified Strengths</h4>
          </div>
          <ul className="space-y-3">
            {explanation.strengths?.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-2.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Areas to Improve */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Areas to Improve</h4>
          </div>
          <ul className="space-y-3">
            {explanation.areasToImprove?.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-2.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white">Actionable Advice</h4>
          </div>
          <ul className="space-y-3">
            {explanation.recommendations?.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 mr-2.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
