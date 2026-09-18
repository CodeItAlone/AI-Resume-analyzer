import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { Accordion } from '../ui/Accordion';
import { FAQ_ITEMS } from '../../data/landingContent';

export function FaqSection() {
  return (
    <section id="faq" className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#EFECE6]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="TRANSPARENCY FIRST"
          title="Frequently Asked Questions"
          description="Clear, honest answers about EMUSER's scoring mechanism, supported formats, and AI provider integration."
          centered={true}
        />

        <div className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 sm:p-10 shadow-[4px_4px_0px_#1C1B19]">
          <Accordion items={FAQ_ITEMS} />
        </div>

      </div>
    </section>
  );
}
