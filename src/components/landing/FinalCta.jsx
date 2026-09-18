import React from 'react';
import { Button } from '../ui/Button';
import { APP_URL } from '../../config';

export function FinalCta() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-4 border-[#1C1B19] bg-[#F7F5F0] p-8 sm:p-14 lg:p-16 text-center shadow-[6px_6px_0px_#1C1B19] relative">
          
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-4">
            [ READY FOR YOUR AUDIT ]
          </div>

          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1C1B19] tracking-tight leading-tight mb-4">
            You already have a resume.<br />
            <span className="italic">Now see what the evidence says.</span>
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#1C1B19]/75 max-w-xl mx-auto mb-8">
            Upload your document, paste a job posting, and receive a full manuscript marked-up evaluation in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" href={APP_URL} className="px-10 py-4 text-sm font-black">
              TRY EMUSER NOW
            </Button>
          </div>

          <div className="font-mono text-[11px] text-[#1C1B19]/50 mt-6">
            Free • No Signup Required • In-Session Privacy
          </div>

        </div>

      </div>
    </section>
  );
}
