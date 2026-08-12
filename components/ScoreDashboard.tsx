'use client';

import React from 'react';
import { ScoreBreakdown } from '@/lib/types';
import { Award, Zap, Briefcase, GraduationCap, Sparkles } from 'lucide-react';

interface DashboardProps {
  scores: ScoreBreakdown;
}

export const ScoreDashboard: React.FC<DashboardProps> = ({ scores }) => {
  const getBadgeStyle = (label: string) => {
    switch (label) {
      case 'Excellent Match':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Good Match':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Moderate Match':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const subScoreItems = [
    {
      title: 'Skills Match',
      score: scores.subScores.skillsMatch,
      weight: '40%',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Experience Match',
      score: scores.subScores.experienceMatch,
      weight: '30%',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Semantic Similarity',
      score: scores.subScores.semanticMatch,
      weight: '20%',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Education Match',
      score: scores.subScores.educationMatch,
      weight: '10%',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Top Banner: Overall Score */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
        <div className="flex items-center space-x-6">
          {/* Radial progress ring */}
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="9"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#score-gradient)"
                strokeWidth="9"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (263.89 * scores.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">{scores.overallScore}%</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Score</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <h2 className="text-2xl font-bold text-white tracking-tight">Overall Match</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBadgeStyle(scores.matchLabel)}`}>
                {scores.matchLabel}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Calculated via pure deterministic code using weighted scoring across 4 core candidate dimensions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <Award className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Factual & Objective • No LLM Score Bias</span>
        </div>
      </div>

      {/* Sub-Scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {subScoreItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.title}</span>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{item.score}%</span>
                  <span className="text-xs text-slate-500 font-mono">Weight: {item.weight}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
