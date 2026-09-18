import React from 'react';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Hero } from '../components/landing/Hero';
import { ProblemSection } from '../components/landing/ProblemSection';
import { PipelineSection } from '../components/landing/PipelineSection';
import { ReportShowcase } from '../components/landing/ReportShowcase';
import { EvidenceCompare } from '../components/landing/EvidenceCompare';
import { ImprovementLoop } from '../components/landing/ImprovementLoop';
import { AudienceSection } from '../components/landing/AudienceSection';
import { PrivacySection } from '../components/landing/PrivacySection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCta } from '../components/landing/FinalCta';

export function LandingPage() {
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

export default LandingPage;
