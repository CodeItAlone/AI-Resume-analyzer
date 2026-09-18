import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { PROBLEM_CARDS } from '../../data/landingContent';

export function ProblemSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionMarker
          kicker="THE RECRUITER'S FILTER"
          title="A resume can claim anything. Recruiters look for proof."
          description="Most applications get discarded not from a lack of talent, but because claimed competencies lack supporting factual evidence."
          centered={true}
        />

        {/* 4 Hard-bordered problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PROBLEM_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 sm:p-8 relative hover:shadow-[4px_4px_0px_#1C1B19] transition-all duration-150"
            >
              <div className="font-mono text-xs font-bold text-[#7A1F1F] mb-3">
                [ GAP 0{idx + 1} ]
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1B19] mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="font-serif text-base text-[#1C1B19]/70 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Transition Line */}
        <div className="mt-14 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] border-b-2 border-[#7A1F1F] pb-1">
            EMUSER AUDITS THE EVIDENCE &rarr;
          </span>
        </div>
      </div>
    </section>
  );
}
