import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { StampBadge } from '../ui/StampBadge';

export function ImprovementLoop() {
  const versions = [
    { version: 'DRAFT 1.0', score: 64, label: 'MODERATE MATCH', note: 'Initial raw upload with claimed-only bullet list' },
    { version: 'DRAFT 2.0', score: 72, label: 'GOOD MATCH', note: 'Added GitHub links and quantified project outcomes' },
    { version: 'FINAL 3.0', score: 81, label: 'STRONG MATCH', note: 'Aligned key responsibilities with job requirements' },
  ];

  return (
    <section className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="THE ITERATION CYCLE"
          title="Revise. Re-submit. Watch the verdict change."
          description="Resume refinement is not a one-time event. As you apply actionable marginalia, track your score growth in real time."
          centered={true}
        />

        {/* 3 Stamped Progression Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          {versions.map((ver, idx) => (
            <div
              key={ver.version}
              className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 shadow-[3px_3px_0px_#1C1B19] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs font-bold text-[#7A1F1F]">
                    {ver.version}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#1C1B19]/50">
                    Step 0{idx + 1}
                  </span>
                </div>

                <div className="my-3 text-center">
                  <StampBadge score={ver.score} label={ver.label} rotated={false} />
                </div>
              </div>

              <div className="border-t border-[#1C1B19]/15 pt-3 mt-4">
                <p className="font-serif italic text-xs text-[#1C1B19]/80">
                  {ver.note}
                </p>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#1C1B19]/40 block mt-1">
                  Illustrative Example
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Moments to Re-check */}
        <div className="border border-[#1C1B19]/20 bg-[#EFECE6]/60 p-6 sm:p-8 max-w-5xl mx-auto">
          <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-4 text-center">
            [ KEY MOMENTS TO RUN AN AUDIT ]
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs text-[#1C1B19]/80">
            <div className="border-l-2 border-[#1C1B19] pl-3 py-1">
              <strong className="block text-[#1C1B19] mb-0.5">01. New Project</strong>
              <span>Verify that new technical stacks are properly backed by work bullets.</span>
            </div>
            <div className="border-l-2 border-[#1C1B19] pl-3 py-1">
              <strong className="block text-[#1C1B19] mb-0.5">02. New Internship</strong>
              <span>Ensure newly acquired responsibilities highlight measurable business impact.</span>
            </div>
            <div className="border-l-2 border-[#1C1B19] pl-3 py-1">
              <strong className="block text-[#1C1B19] mb-0.5">03. Target JD</strong>
              <span>Check requirement overlap and missing keywords before submitting applications.</span>
            </div>
            <div className="border-l-2 border-[#1C1B19] pl-3 py-1">
              <strong className="block text-[#1C1B19] mb-0.5">04. Career Pivot</strong>
              <span>Audit transferable skills and verify alignment with new industry standards.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
