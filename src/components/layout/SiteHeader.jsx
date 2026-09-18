import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { VersionBadge } from '../ui/VersionBadge';
import { Button } from '../ui/Button';
import { APP_URL } from '../../config';

export function SiteHeader({ className = '' }) {
  return (
    <header className={`border-b border-[#1C1B19]/20 bg-[#F7F5F0] sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding: Logo + Wordmark + Version Badge */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href="/" className="flex items-center gap-2 text-inherit no-underline">
            <Logo size={32} showWordmark={true} />
          </Link>
          <VersionBadge />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]/70">
          <a href="#how-it-works" className="hover:text-[#7A1F1F] transition-colors">
            How It Works
          </a>
          <a href="#report-showcase" className="hover:text-[#7A1F1F] transition-colors">
            The Report
          </a>
          <a href="#evidence-compare" className="hover:text-[#7A1F1F] transition-colors">
            Evidence
          </a>
          <a href="#privacy" className="hover:text-[#7A1F1F] transition-colors">
            Privacy
          </a>
          <a href="#faq" className="hover:text-[#7A1F1F] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center">
          <Button variant="outline" href={APP_URL} className="px-4 py-2">
            TRY NOW
          </Button>
        </div>
      </div>
    </header>
  );
}
