import React from 'react';
import { SectionMarker } from '../ui/SectionMarker';
import { Panel } from '../ui/Panel';
import { StampBadge } from '../ui/StampBadge';
import { ScoreCell } from '../ui/ScoreCell';
import { VerdictCallout } from '../ui/VerdictCallout';
import { SAMPLE_REPORT } from '../../data/landingContent';

export function ReportShowcase({ sample = SAMPLE_REPORT }) {
  return (
    <section id="report-showcase" className="py-16 sm:py-24 border-b border-[#1C1B19]/15 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionMarker
          kicker="THE OUTPUT"
          title="The Marked-Up Manuscript Report"
          description="Every claim audited against real evidence. Zero black-box score hallucination."
          centered={true}
        />

        {/* Large Mockup Container */}
        <div className="max-w-5xl mx-auto">
          <Panel withShadow={true} className="relative p-6 sm:p-10 md:p-12">
            
            {/* Top Right Stamp */}
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20">
              <StampBadge score={sample.overallScore} label={sample.verdictLabel} />
            </div>

            {/* Header Candidate Info */}
            <div className="border-b-2 border-[#1C1B19] pb-4 mb-6 max-w-[65%] sm:max-w-[70%]">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1B19]">
                {sample.candidateName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#1C1B19]/70 mt-2">
                <span>{sample.candidateEmail}</span>
                <span>• GitHub: {sample.github}</span>
                <span>• {sample.candidateRole}</span>
              </div>
            </div>

            {/* Multi-Dimensional Evaluation Breakdown Header */}
            <div className="border-2 border-[#1C1B19] p-4 mb-6 bg-[#F7F5F0]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#1C1B19]/20 font-mono text-xs">
                <span className="font-bold text-[#1C1B19] uppercase">MULTI-DIMENSIONAL EVALUATION BREAKDOWN</span>
                <span className="text-[#7A1F1F] font-bold">Evidence Coverage: {sample.evidenceCoverage}%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <ScoreCell label="Job Match" value={sample.scores.jobMatch} subtitle="Requirement alignment" />
                <ScoreCell label="Evidence Strength" value={sample.scores.evidenceStrength} subtitle="Work vs claims" />
                <ScoreCell label="Resume Quality" value={sample.scores.resumeQuality} subtitle="Clarity & structure" />
                <ScoreCell label="ATS Compatibility" value={sample.scores.atsCompatibility} subtitle="Machine parseability" />
              </div>
            </div>

            {/* Recruiter Executive Verdict */}
            <VerdictCallout title="Recruiter Executive Verdict" className="mb-8">
              &ldquo;{sample.recruiterVerdict}&rdquo;
            </VerdictCallout>

            {/* Candidate Summary */}
            <div className="mb-8">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]/60 mb-2">
                {`//`} Candidate Summary
              </h4>
              <p className="font-serif text-base sm:text-lg text-[#1C1B19] leading-relaxed border-l-2 border-[#1C1B19]/20 pl-4">
                {sample.candidateSummary}
              </p>
            </div>

            {/* Editor's Marginalia Columns */}
            <div className="border-t-2 border-[#1C1B19] pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Verified Strengths */}
              <div className="space-y-3">
                <h4 className="font-serif italic font-bold text-base text-[#2F5233] flex items-center gap-2">
                  <span className="font-mono text-xs not-italic border border-[#2F5233] px-1.5 py-0.5">VERIFIED</span>
                  Verified Strengths
                </h4>
                <ul className="space-y-2">
                  {sample.verifiedStrengths.map((str, i) => (
                    <li key={i} className="font-serif italic text-sm text-[#1C1B19]/90 border-l-2 border-[#2F5233] pl-3 py-0.5">
                      &ldquo;{str}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Revisions */}
              <div className="space-y-3">
                <h4 className="font-serif italic font-bold text-base text-[#7A1F1F] flex items-center gap-2">
                  <span className="font-mono text-xs not-italic border border-[#7A1F1F] px-1.5 py-0.5">ACTION</span>
                  Actionable Revisions
                </h4>
                <ul className="space-y-2">
                  {sample.actionableRevisions.map((rev, i) => (
                    <li key={i} className="font-serif italic text-sm text-[#1C1B19]/90 border-l-2 border-[#7A1F1F] pl-3 py-0.5">
                      {rev}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </Panel>
        </div>

        {/* Feature Explanations Callout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
          <div className="border border-[#1C1B19]/20 bg-[#F7F5F0] p-4 text-xs font-mono">
            <span className="font-bold text-[#7A1F1F] block mb-1">01. RUBBER STAMP</span>
            <span className="text-[#1C1B19]/70">Instant match tier calculated from deterministic mathematical rubrics.</span>
          </div>
          <div className="border border-[#1C1B19]/20 bg-[#F7F5F0] p-4 text-xs font-mono">
            <span className="font-bold text-[#7A1F1F] block mb-1">02. EVIDENCE COVERAGE</span>
            <span className="text-[#1C1B19]/70">Separates skills with work history proof from unverified bullet lists.</span>
          </div>
          <div className="border border-[#1C1B19]/20 bg-[#F7F5F0] p-4 text-xs font-mono">
            <span className="font-bold text-[#7A1F1F] block mb-1">03. EXECUTIVE VERDICT</span>
            <span className="text-[#1C1B19]/70">Prose summary detailing what hiring managers notice in 6 seconds.</span>
          </div>
          <div className="border border-[#1C1B19]/20 bg-[#F7F5F0] p-4 text-xs font-mono">
            <span className="font-bold text-[#7A1F1F] block mb-1">04. MARGINALIA</span>
            <span className="text-[#1C1B19]/70">Clear edits you can apply immediately to improve interview odds.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
