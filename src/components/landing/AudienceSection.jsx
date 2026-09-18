import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { AUDIENCE_PERSONAS } from '../../data/landingContent';

export function AudienceSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#EFECE6]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="TAILORED RELEVANCE"
          title="Built for Every Career Stage"
          description="Whether you are proving your first project or condensing twenty years of technical leadership."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {AUDIENCE_PERSONAS.map((persona) => (
            <div
              key={persona.role}
              className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 shadow-[3px_3px_0px_#1C1B19] flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-2 border-b border-[#1C1B19]/15 pb-2">
                  {`//`} {persona.role}
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1C1B19] mb-2 leading-snug">
                  {persona.tagline}
                </h3>
              </div>

              <p className="font-serif text-sm text-[#1C1B19]/70 leading-relaxed border-t border-[#1C1B19]/10 pt-3 mt-4">
                {persona.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
