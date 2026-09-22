import React from 'react';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Button } from '../ui/Button';

export function AppPlaceholder() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif flex flex-col justify-between">
      <SiteHeader />

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="border-2 border-[#1C1B19] bg-[#F7F5F0] p-10 sm:p-16 shadow-[4px_4px_0px_#1C1B19]">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-4">
            [ APPLICATION INTERFACE ]
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1C1B19] mb-4">
            Main App Goes Here
          </h1>
          <p className="font-serif italic text-lg text-[#1C1B19]/70 mb-8 max-w-lg mx-auto">
            This route is connected to the primary Resurox evaluation dashboard where document upload and AI settings live.
          </p>
          <Button variant="primary" href="/" className="px-8 py-3">
            Back to Landing Page
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default AppPlaceholder;
