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

export type PipelineConfidence = 'high' | 'medium' | 'limited';

export type DegradedReason =
  | 'resume_extraction'
  | 'job_extraction'
  | 'explanation'
  | 'github_enrichment'
  | 'input_truncated';

export interface AnalysisMeta {
  requestId: string;
  pipelineVersion: string;
  confidence: PipelineConfidence;
  degraded: DegradedReason[];
  layaExtraction?: {
    seniorityLevel: string;
    primaryDomain: string;
    hasQuantifiedAchievements: boolean;
    resumeLengthAppropriate: string;
    confidence: number;
  };
  layaGuard?: {
    passed: boolean;
    isPromptInjection: boolean;
    contentFlag: string;
    mode: 'soft-flag' | 'hard-block';
    source: 'laya-model' | 'pattern-match-fallback';
  };
}

export interface AnalysisResponse {
  resume: CandidateProfile;
  jobDescription: JobRequirementModel;
  scores: ScoreBreakdown;
  multiDimensionalScores?: MultiDimensionalScores;
  requirementMatches?: RequirementMatch[];
  headlineScore: number;
  meta: AnalysisMeta;
  explanation: ExplanationFeedback;
  auditTrail?: AuditTrailStage[];
  rawText: {
    resumeSnippet: string;
    jdSnippet: string;
  };
}
