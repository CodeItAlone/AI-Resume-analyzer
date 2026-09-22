import React, { useState, useEffect } from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { StageChip } from '../ui/StageChip';
import { HOW_IT_WORKS_STEPS, PIPELINE_STAGES } from '../../data/landingContent';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function PipelineSection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const [currentStageIdx, setCurrentStageIdx] = useState(prefersReducedMotion ? PIPELINE_STAGES.length - 1 : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  const progressPercent = Math.round(((currentStageIdx + 1) / PIPELINE_STAGES.length) * 100);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#EFECE6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionMarker
          kicker="THE 11-STAGE PIPELINE"
          title="From Raw Document to Marked-Up Verdict"
          description="How Resurox transforms unparsed resumes into evidence-audited candidate evaluations."
          centered={true}
        />

        {/* 4 Step Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 shadow-[3px_3px_0px_#1C1B19]"
            >
              <div className="font-mono text-xl font-black text-[#7A1F1F] mb-2">
                {step.step}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1C1B19] mb-1">
                {step.title}
              </h3>
              <p className="font-serif text-sm text-[#1C1B19]/70 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Live 11-Stage Interactive Stepper Box */}
        <div className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 sm:p-10 shadow-[4px_4px_0px_#1C1B19] max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-1">
              [ STAGE SIMULATION ]
            </div>
            <h4 className="font-serif italic font-bold text-2xl text-[#1C1B19]">
              {PIPELINE_STAGES[currentStageIdx]}
            </h4>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#1C1B19]/10 border border-[#1C1B19]/30 h-3 mb-6 relative">
            <div
              className="bg-[#7A1F1F] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center font-mono text-xs text-[#1C1B19]/70 mb-6 border-b border-[#1C1B19]/15 pb-3">
            <span>PIPELINE PROGRESS</span>
            <span className="font-bold text-[#7A1F1F]">{progressPercent}% COMPLETED</span>
          </div>

          {/* 11 Stage Chips Grid */}
          <div className="flex flex-wrap justify-center gap-2">
            {PIPELINE_STAGES.map((stageName, idx) => {
              let status = 'pending';
              if (idx < currentStageIdx) status = 'completed';
              else if (idx === currentStageIdx) status = 'active';

              return (
                <StageChip
                  key={stageName}
                  stage={stageName}
                  index={idx}
                  status={status}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
