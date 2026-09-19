import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { PRIVACY_BULLETS } from '../../data/landingContent';

export function PrivacySection() {
  return (
    <section id="privacy" className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="PRIVACY & INTEGRITY"
          title="Your Resume. Your Data. Your Control."
          description="EMUSER is built on a 'Bring Your Own AI' architecture. You configure your preferred provider and API key directly in your browser."
          centered={true}
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRIVACY_BULLETS.map((bullet, idx) => (
            <div
              key={idx}
              className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 shadow-[3px_3px_0px_#1C1B19] flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1C1B19] mb-2">
                  {bullet.title}
                </h3>
                <p className="font-serif text-sm text-[#1C1B19]/75 leading-relaxed">
                  {bullet.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C1B19]/15">
                <span className="font-mono text-[10px] uppercase font-bold text-[#7A1F1F]">
                  {bullet.policyTag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 font-mono text-xs text-[#1C1B19]/60 max-w-xl mx-auto">
          No third-party tracking, no permanent resume database scraping, and zero marketing spam.
        </div>

      </div>
    </section>
  );
}
