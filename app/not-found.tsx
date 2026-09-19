import React from 'react';
import Link from 'next/link';
import { EmuserLogo } from '@/components/branding';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full border-2 border-[#1C1B19] bg-[#F7F5F0] p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <EmuserLogo size="md" showTagline={false} />
        </div>

        <h1 className="font-mono text-4xl font-bold text-[#7A1F1F] mb-2">404</h1>
        <h2 className="text-xl font-serif font-bold text-[#1C1B19] mb-4">
          Manuscript Page Not Found
        </h2>
        
        <p className="text-sm font-serif italic text-[#1C1B19]/70 mb-8">
          The evaluation document or path you requested does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#1C1B19] text-[#F7F5F0] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#7A1F1F] transition-colors"
        >
          Return to Resume Analyzer
        </Link>
      </div>
    </main>
  );
}
