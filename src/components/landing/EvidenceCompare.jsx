import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';

export function EvidenceCompare() {
  return (
    <section id="evidence-compare" className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#EFECE6]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="PROOF OVER PROMISES"
          title="Claimed vs. Evidence-Backed"
          description="How recruiters and EMUSER differentiate between listed buzzwords and demonstrated competencies."
          centered={true}
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Claimed */}
          <div className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 sm:p-8 relative">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7A1F1F] border border-[#7A1F1F] px-2 py-0.5 bg-[#7A1F1F]/5">
                CLAIMED ONLY
              </span>
              <span className="font-mono text-xs text-[#7A1F1F] font-bold">WEAK EVIDENCE</span>
            </div>

            <p className="font-serif italic text-lg sm:text-xl text-[#1C1B19] mb-4">
              &ldquo;Experienced in REST APIs.&rdquo;
            </p>

            <ul className="space-y-2 font-mono text-xs text-[#1C1B19]/70 border-t border-[#1C1B19]/15 pt-4">
              <li>&times; No framework or language specified</li>
              <li>&times; No database or system context</li>
              <li>&times; Zero verifiable public proof</li>
            </ul>
          </div>

          {/* Column 2: Evidence-Backed */}
          <div className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-6 sm:p-8 shadow-[4px_4px_0px_#1C1B19] relative">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2F5233] border border-[#2F5233] px-2 py-0.5 bg-[#2F5233]/5">
                EVIDENCE-BACKED
              </span>
              <span className="font-mono text-xs text-[#2F5233] font-bold">STRONG EVIDENCE</span>
            </div>

            <p className="font-serif italic text-lg sm:text-xl text-[#1C1B19] mb-4 font-semibold">
              &ldquo;Built REST APIs with Spring Boot and PostgreSQL. Public repository verified.&rdquo;
            </p>

            <ul className="space-y-2 font-mono text-xs text-[#2F5233] border-t border-[#1C1B19]/15 pt-4">
              <li>&check; Explicit stack: Spring Boot + PostgreSQL</li>
              <li>&check; Clear functional application</li>
              <li>&check; Verified public GitHub repository</li>
            </ul>
          </div>

        </div>

        {/* Caption */}
        <div className="text-center mt-10">
          <p className="font-serif font-bold italic text-xl text-[#1C1B19]">
            Same skill. Different weight.
          </p>
          <p className="font-mono text-xs text-[#1C1B19]/60 mt-1 uppercase tracking-wider">
            EMUSER flags claimed-only skills so you can provide the missing context.
          </p>
        </div>

      </div>
    </section>
  );
}
