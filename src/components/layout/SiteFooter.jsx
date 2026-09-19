import React from 'react';
import Link from 'next/link';
import { Logo } from '../ui/Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1C1B19]/20 bg-[#F7F5F0] py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <Logo size={28} showWordmark={true} />
          <span className="font-mono text-xs text-[#1C1B19]/50 pl-2 border-l border-[#1C1B19]/20">
            EMUSER v2.0 • Editorial Manuscript Resume Intelligence
          </span>
        </div>

        <ul className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider text-[#1C1B19]/70">
          <li>
            <Link href="/privacy" className="hover:text-[#7A1F1F] transition-colors">
              Privacy
            </Link>
          </li>
          <li>
            <a href="#privacy" className="hover:text-[#7A1F1F] transition-colors">
              Terms
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-[#7A1F1F] transition-colors">
              Contact
            </a>
          </li>
          <li>
            <Link href="/" className="hover:text-[#7A1F1F] transition-colors">
              App
            </Link>
          </li>
        </ul>

        <div className="font-mono text-xs text-[#1C1B19]/50">
          &copy; {new Date().getFullYear()} EMUSER. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
