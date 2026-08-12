import { CandidateProfile } from './resume';
import { JobRequirementModel } from './job';
import { RequirementMatch } from './matching';
import { ScoreBreakdown, MultiDimensionalScores } from './scoring';

export interface ExplanationFeedback {
  strengths: string[];
  areasToImprove: string[];
  recommendations: string[];
  executiveSummary?: string;
  criticalGaps?: string[];
  recruiterVerdict?: string;
}

export interface AuditTrailStage {
  stageName: string;
  timestamp: string;
  durationMs: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  notes?: string;
}

export interface AnalysisResponse {
  resume: CandidateProfile;
  jobDescription: JobRequirementModel;
  scores: ScoreBreakdown;
  multiDimensionalScores?: MultiDimensionalScores;
  requirementMatches?: RequirementMatch[];
  explanation: ExplanationFeedback;
  auditTrail?: AuditTrailStage[];
  rawText: {
    resumeSnippet: string;
    jdSnippet: string;
  };
}
