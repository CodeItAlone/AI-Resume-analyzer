export type EvidenceSource = 'RESUME' | 'GITHUB' | 'PORTFOLIO' | 'CERTIFICATION' | 'OTHER';
export type EvidenceStatus = 'CLAIMED' | 'SUPPORTED' | 'STRONGLY_SUPPORTED' | 'CONTRADICTED' | 'UNKNOWN';

export interface EvidenceItem {
  id: string;
  claimId: string;
  source: EvidenceSource;
  sourceType: 'experience' | 'project' | 'skills_section' | 'summary' | 'github_repo' | 'github_readme';
  location?: {
    section?: string;
    textSnippet?: string;
  };
  text: string;
  strength: number;   // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
}

export interface SkillClaimEvidence {
  skill: string;
  normalizedSkill: string;
  status: EvidenceStatus;
  evidenceItems: EvidenceItem[];
  overallStrength: number;
}
