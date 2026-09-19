'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  getStoredConsent,
  saveConsent,
} from '@/lib/consent';
import { ShieldCheck, Cookie, X, SlidersHorizontal } from 'lucide-react';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Granular preference state for the management dialog
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      const stored = getStoredConsent();

      if (!stored) {
        setShowBanner(true);
      } else {
        setAnalyticsAllowed(stored.analytics);
        setMarketingAllowed(stored.marketing);
      }
    }, 300);

    return () => clearTimeout(t);
  }, []);

  // Listen for external requests to re-open cookie settings from footer links
  useEffect(() => {
    const handleOpenSettings = () => {
      const stored = getStoredConsent();
      if (stored) {
        setAnalyticsAllowed(stored.analytics);
        setMarketingAllowed(stored.marketing);
      }
      setShowModal(true);
      setShowBanner(false);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    setAnalyticsAllowed(true);
    setMarketingAllowed(true);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    saveConsent({
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
    });
    setShowBanner(false);
    setShowModal(false);
  };

  const handleOpenManage = () => {
    const stored = getStoredConsent();
    if (stored) {
      setAnalyticsAllowed(stored.analytics);
      setMarketingAllowed(stored.marketing);
    }
    setShowModal(true);
    setShowBanner(false);
  };

  return (
    <>
      {/* 1. Floating Cookie Consent Banner */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="bg-[#F7F5F0] border-2 border-[#1C1B19] p-5 sm:p-6 shadow-[5px_5px_0px_#1C1B19] rounded-none">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] mb-2">
              <Cookie className="w-4 h-4 text-[#7A1F1F]" />
              <span>Cookie &amp; Storage Preferences</span>
            </div>

            <p className="font-serif text-xs sm:text-sm text-[#1C1B19]/85 leading-relaxed mb-4">
              EMUSER processes resume documents strictly in volatile memory. We use essential local browser storage to remember your chosen AI provider and optional API keys. Non-essential tracking scripts are blocked by default.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 min-w-[100px] py-2 px-3 bg-[#1C1B19] text-[#F7F5F0] hover:bg-[#7A1F1F] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 min-w-[100px] py-2 px-3 bg-transparent border-2 border-[#1C1B19] text-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#F7F5F0] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Reject Non-Essential
              </button>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-[#1C1B19]/70 pt-2 border-t border-[#1C1B19]/20">
              <button
                type="button"
                onClick={handleOpenManage}
                className="inline-flex items-center gap-1 hover:text-[#7A1F1F] underline underline-offset-2 uppercase tracking-wide font-semibold cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Manage Preferences</span>
              </button>
              <Link
                href="/privacy"
                className="hover:text-[#7A1F1F] underline underline-offset-2 uppercase tracking-wide"
              >
                Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Granular Preferences Management Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          aria-describedby="cookie-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B19]/60 backdrop-blur-xs"
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg bg-[#F7F5F0] border-3 border-[#1C1B19] shadow-[8px_8px_0px_#1C1B19] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto rounded-none"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-[#1C1B19] pb-4">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7A1F1F]">
                  [ DATA &amp; STORAGE SETTINGS ]
                </span>
                <h2
                  id="cookie-modal-title"
                  className="font-serif font-extrabold text-2xl text-[#1C1B19] mt-0.5"
                >
                  Consent Management
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="p-1 hover:bg-[#1C1B19]/10 text-[#1C1B19] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p
              id="cookie-modal-desc"
              className="font-serif text-xs sm:text-sm text-[#1C1B19]/80 leading-relaxed"
            >
              Control how EMUSER stores data in your browser. Essential items are strictly necessary for core analysis and AI key persistence. Non-essential categories require explicit consent.
            </p>

            {/* Storage Toggles */}
            <div className="space-y-4">
              
              {/* Category 1: Strictly Essential */}
              <div className="border border-[#1C1B19]/30 bg-white/40 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2F5233]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wide text-[#1C1B19]">
                      Essential Storage (Strictly Necessary)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-[#2F5233]/15 text-[#2F5233] border border-[#2F5233]/40">
                    Always Active
                  </span>
                </div>
                <p className="font-serif text-xs text-[#1C1B19]/70 leading-relaxed">
                  Stores your selected AI provider (OpenRouter/Gemini/OpenAI), model preference, and optional API keys locally in your browser to maintain your workbench session. No document text is permanently stored.
                </p>
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="border border-[#1C1B19]/30 bg-white/40 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="analytics-toggle"
                    className="font-mono text-xs font-bold uppercase tracking-wide text-[#1C1B19] cursor-pointer flex items-center gap-2"
                  >
                    <span>Analytics &amp; Performance</span>
                  </label>
                  <input
                    id="analytics-toggle"
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#7A1F1F] cursor-pointer"
                  />
                </div>
                <p className="font-serif text-xs text-[#1C1B19]/70 leading-relaxed">
                  Allows anonymous aggregated metrics to diagnose parsing latency, score computation performance, and improve UI responsiveness. No personal resume content is ever logged.
                </p>
              </div>

              {/* Category 3: Marketing & Preferences */}
              <div className="border border-[#1C1B19]/30 bg-white/40 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="marketing-toggle"
                    className="font-mono text-xs font-bold uppercase tracking-wide text-[#1C1B19] cursor-pointer flex items-center gap-2"
                  >
                    <span>Marketing &amp; Personalization</span>
                  </label>
                  <input
                    id="marketing-toggle"
                    type="checkbox"
                    checked={marketingAllowed}
                    onChange={(e) => setMarketingAllowed(e.target.checked)}
                    className="w-4 h-4 accent-[#7A1F1F] cursor-pointer"
                  />
                </div>
                <p className="font-serif text-xs text-[#1C1B19]/70 leading-relaxed">
                  Permits customized product guidance and feature updates. We do not run third-party advertising tracking pixels or sell your data.
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#1C1B19]/20">
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full sm:w-auto py-2.5 px-4 border border-[#1C1B19] text-[#1C1B19] hover:bg-[#1C1B19]/10 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Reject All Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full sm:w-auto py-2.5 px-4 bg-[#1C1B19] text-[#F7F5F0] hover:bg-[#7A1F1F] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
