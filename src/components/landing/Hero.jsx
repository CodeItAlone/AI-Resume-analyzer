import React from 'react';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';
import { StampBadge } from '../ui/StampBadge';
import { ScoreCell } from '../ui/ScoreCell';
import { VerdictCallout } from '../ui/VerdictCallout';
import { SAMPLE_REPORT } from '../../data/landingContent';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';
import { APP_URL } from '../../config';

export function Hero({ sample = SAMPLE_REPORT }) {
  const [heroRef, isInView] = useInView({ threshold: 0.1 });
  const animatedScore = useCountUp(sample.overallScore, 1000, isInView);

  return (
    <section ref={heroRef} className="py-12 sm:py-20 lg:py-24 border-b border-[#1C1B19]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Value Prop & Primary CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F]">
              [ EVIDENCE-BACKED CANDIDATE EVALUATION ]
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1C1B19] tracking-tight leading-[1.08]">
              Your Resume, Marked Up Like a Manuscript.
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-[#1C1B19]/80 leading-relaxed max-w-xl">
              Upload your resume and a job description. EMUSER checks every claim against evidence and returns a verdict you can act on.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <Button variant="primary" href={APP_URL} className="px-8 py-4 text-sm">
                ANALYZE MY RESUME
              </Button>
              <a
                href="#report-showcase"
                className="font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]/70 hover:text-[#7A1F1F] transition-colors py-2"
              >
                See a sample report &darr;
              </a>
            </div>

            <div className="font-mono text-[11px] text-[#1C1B19]/60 flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 bg-[#7A1F1F] inline-block" />
              <span>Supports PDF & DOCX up to 5MB • 100% Deterministic Scoring</span>
            </div>
          </div>

          {/* Right Column: Mini Report Replica */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Sample Label Tag */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A1F1F] border border-[#7A1F1F] px-2 py-0.5 bg-[#7A1F1F]/5">
                  SAMPLE REPORT
                </span>
                <span className="font-mono text-[11px] text-[#1C1B19]/60">
                  Candidate: {sample.candidateName}
                </span>
              </div>

              <Panel withShadow={true} className="relative overflow-hidden">
                {/* Stamp placed top right */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                  <StampBadge score={animatedScore} label={sample.verdictLabel} />
                </div>

                {/* Candidate Header */}
                <div className="border-b-2 border-[#1C1B19] pb-3 mb-5 max-w-[65%] sm:max-w-[70%]">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1B19]">
                    {sample.candidateName}
                  </h3>
                  <p className="font-mono text-xs text-[#1C1B19]/70 mt-1">
                    {sample.candidateRole} • {sample.github}
                  </p>
                </div>

                {/* 4 Multi-Dimensional Score Cells */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 font-mono text-xs">
                  <ScoreCell label="Job Match" value={sample.scores.jobMatch} subtitle="Requirement alignment" />
                  <ScoreCell label="Evidence Strength" value={sample.scores.evidenceStrength} subtitle="Work vs claims" />
                  <ScoreCell label="Resume Quality" value={sample.scores.resumeQuality} subtitle="Clarity & structure" />
                  <ScoreCell label="ATS Compatibility" value={sample.scores.atsCompatibility} subtitle="Machine parseability" />
                </div>

                {/* Recruiter Verdict Callout */}
                <VerdictCallout title="Recruiter Executive Verdict">
                  &ldquo;Candidate demonstrates moderate alignment (70% Job Match). Evidence supporting claimed skills is weak (64% Evidence Strength). Strengthen with quantifiable outcomes.&rdquo;
                </VerdictCallout>
              </Panel>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
