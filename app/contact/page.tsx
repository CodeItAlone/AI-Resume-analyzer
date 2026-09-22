import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';
import { ContactForm } from '@/components/contact/ContactForm';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Code, 
  Sparkles, 
  Bug, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contact & Support — Resurox",
  description: "Get in touch with the Resurox team for technical inquiries, bug reports, feature suggestions, and open-source collaboration.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif selection:bg-[#7A1F1F] selection:text-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]/70 hover:text-[#7A1F1F] transition-colors no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </Link>
        </div>

        {/* Page Header */}
        <header className="border-b-2 border-[#1C1B19] pb-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F]">
              [ INQUIRIES & COLLABORATION ]
            </span>
            <span className="font-mono text-xs text-[#1C1B19]/60">
              Direct Contact Desk
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#1C1B19] tracking-tight leading-tight mb-3">
            Contact Resurox
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#1C1B19]/75 leading-relaxed max-w-2xl">
            Have a question about deterministic resume scoring, want to suggest new AI models, report a bug, or collaborate on open source? We&apos;d love to hear from you.
          </p>
        </header>

        {/* 2-Column Layout: Contact Desk Details & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Email Card */}
            <div className="border-2 border-[#1C1B19] bg-white p-6 shadow-[3px_3px_0px_#1C1B19] space-y-4">
              <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#7A1F1F]">
                <Mail className="w-4 h-4" />
                <span>Direct Inquiries Email</span>
              </div>
              <p className="font-serif text-xs text-[#1C1B19]/80 leading-relaxed">
                Reach out for questions, partnerships, or assistance. We typically reply within 24–48 hours.
              </p>
              <a
                href="mailto:subrato213432@gmail.com"
                className="inline-block font-mono text-sm font-bold text-[#7A1F1F] hover:text-[#1C1B19] underline break-all"
              >
                subrato213432@gmail.com
              </a>
            </div>

            {/* Location & Team Card */}
            <div className="border border-[#1C1B19]/30 bg-white/60 p-6 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
                <MapPin className="w-4 h-4 text-[#7A1F1F]" />
                <span>Location & Engineering Team</span>
              </div>
              
              <div className="font-serif text-xs text-[#1C1B19]/80 space-y-2 leading-relaxed">
                <div><strong>Base:</strong> Jharkhand, India</div>
                <div className="pt-2"><strong>Core Developers:</strong></div>
                <div className="flex flex-col gap-1.5 font-mono text-xs pl-2 border-l-2 border-[#7A1F1F]/40">
                  <a
                    href="https://github.com/CodeItAlone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#7A1F1F] hover:text-[#1C1B19] no-underline font-semibold"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>github.com/CodeItAlone</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <a
                    href="https://github.com/Srijal-io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#7A1F1F] hover:text-[#1C1B19] no-underline font-semibold"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>github.com/Srijal-io</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            </div>

            {/* GitHub Repository Card */}
            <div className="border border-[#1C1B19]/30 bg-white/60 p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
                <GithubIcon className="w-4 h-4 text-[#7A1F1F]" />
                <span>Open Source Repository</span>
              </div>
              <p className="font-serif text-xs text-[#1C1B19]/80 leading-relaxed">
                Report bugs, request features, or review the codebase on GitHub.
              </p>
              <a
                href="https://github.com/Srijal-io/Resurox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#1C1B19] hover:text-[#7A1F1F] border border-[#1C1B19] px-3 py-2 bg-[#F7F5F0] hover:bg-white transition-all shadow-[2px_2px_0px_#1C1B19] no-underline"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Srijal-io / Resurox &rarr;</span>
              </a>
            </div>

            {/* Quick Inquiries Guide */}
            <div className="p-4 border border-[#7A1F1F]/40 bg-[#7A1F1F]/5 space-y-2">
              <div className="font-mono text-[11px] font-bold uppercase text-[#7A1F1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Common Inquiries Handled</span>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 font-serif text-xs text-[#1C1B19]/80">
                <li><strong>Scoring Formulas:</strong> Questions on evidence audit & ATS compatibility.</li>
                <li><strong>Free Provider Models:</strong> Requests for new LLM connection templates.</li>
                <li><strong>Bug Reports:</strong> Parsing edge-cases in specific PDF/DOCX layouts.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
