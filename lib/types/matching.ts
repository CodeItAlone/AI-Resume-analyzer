import { JobRequirement } from './job';
import { EvidenceItem } from './evidence';

export type MatchStatus = 'MATCHED' | 'PARTIAL' | 'MISSING' | 'CLAIMED_ONLY';

export interface RequirementMatch {
  requirementId: string;
  requirement: JobRequirement;
  status: MatchStatus;
  matchScore: number; // 0 to 100
  confidence: number; // 0 to 1 (0% - 100%)
  evidence: EvidenceItem[];
  reason: string;
}

export interface SkillMatchItem {
  skill: string;
  status: 'matched' | 'partial' | 'missing';
  reason?: string;
}
