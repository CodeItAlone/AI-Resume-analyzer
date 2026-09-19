import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';
import { FileQuestion, ArrowLeft, Play } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif selection:bg-[#7A1F1F] selection:text-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-28 flex items-center justify-center">
        <div className="w-full border-4 border-[#1C1B19] bg-[#F7F5F0] p-8 sm:p-14 shadow-[8px_8px_0px_#1C1B19] text-center relative">
          
          {/* Top Stamp Tag */}
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] border border-[#7A1F1F] px-3 py-1 bg-[#7A1F1F]/5 mb-6">
            <FileQuestion className="w-4 h-4 text-[#7A1F1F]" />
            <span>[ 404 • MANUSCRIPT MISSING ]</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-[#1C1B19] tracking-tight leading-tight mb-4">
            Document Not Found
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#1C1B19]/75 max-w-lg mx-auto leading-relaxed mb-8">
            The manuscript, section, or analysis route you requested does not exist in the editorial archive or may have been relocated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent border-2 border-[#1C1B19] text-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#F7F5F0] font-mono text-xs font-bold uppercase tracking-wider transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>

            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1C1B19] text-[#F7F5F0] hover:bg-[#7A1F1F] font-mono text-xs font-bold uppercase tracking-wider transition-colors no-underline"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Workbench</span>
            </Link>
          </div>

          <div className="font-mono text-[11px] text-[#1C1B19]/50 mt-10 pt-6 border-t border-[#1C1B19]/15">
            EMUSER • EDIT • ANALYZE • ADVANCE — Error Reference: ERR_404_PAGE_MISSING
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
