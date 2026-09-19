'use client';

import React from 'react';
import { SiteHeader } from '@/src/components/layout/SiteHeader';
import { SiteFooter } from '@/src/components/layout/SiteFooter';
import { Hero } from '@/src/components/landing/Hero';
import { ProblemSection } from '@/src/components/landing/ProblemSection';
import { PipelineSection } from '@/src/components/landing/PipelineSection';
import { ReportShowcase } from '@/src/components/landing/ReportShowcase';
import { EvidenceCompare } from '@/src/components/landing/EvidenceCompare';
import { ImprovementLoop } from '@/src/components/landing/ImprovementLoop';
import { AudienceSection } from '@/src/components/landing/AudienceSection';
import { PrivacySection } from '@/src/components/landing/PrivacySection';
import { FaqSection } from '@/src/components/landing/FaqSection';
import { FinalCta } from '@/src/components/landing/FinalCta';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif selection:bg-[#7A1F1F] selection:text-white flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <PipelineSection />
        <ReportShowcase />
        <EvidenceCompare />
        <ImprovementLoop />
        <AudienceSection />
        <PrivacySection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
