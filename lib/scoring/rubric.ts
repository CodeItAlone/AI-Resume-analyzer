import { RequirementMatch } from '../types/matching';
import { SkillClaimEvidence } from '../types/evidence';
import { MultiDimensionalScores } from '../types/scoring';

export interface RubricConfig {
  jobMatchWeight: number;      // 0.30
  technicalCapWeight: number;  // 0.20
  experienceWeight: number;    // 0.15
  projectsWeight: number;      // 0.10
  evidenceWeight: number;      // 0.10
  educationWeight: number;     // 0.05
  resumeQualityWeight: number; // 0.10
}

export const DEFAULT_RUBRIC_CONFIG: RubricConfig = {
  jobMatchWeight: 0.30,
  technicalCapWeight: 0.20,
  experienceWeight: 0.15,
  projectsWeight: 0.10,
  evidenceWeight: 0.10,
  educationWeight: 0.05,
  resumeQualityWeight: 0.10,
};

export function computeMultiDimensionalScores(
  requirementMatches: RequirementMatch[],
  evidenceList: SkillClaimEvidence[],
  skillsMatchScore: number,
  experienceMatchScore: number,
  educationMatchScore: number,
  rubric: RubricConfig = DEFAULT_RUBRIC_CONFIG
): { scores: MultiDimensionalScores; evidenceCoverage: number } {
  // 1. Calculate Requirement Match Score
  const totalReqs = requirementMatches.length;
  let jobMatchScore = 70; // Fallback default
  if (totalReqs > 0) {
    const matchedWeightedScore = requirementMatches.reduce((acc, m) => {
      return acc + (m.matchScore * m.requirement.criticality);
    }, 0);
    const maxPossibleReqScore = requirementMatches.reduce((acc, m) => acc + (100 * m.requirement.criticality), 0) || 1;
    jobMatchScore = Math.round((matchedWeightedScore / maxPossibleReqScore) * 100);
  } else {
    jobMatchScore = skillsMatchScore;
  }

  // 2. Calculate Evidence Strength Score
  const totalClaims = evidenceList.length;
  let evidenceStrengthScore = Math.round(skillsMatchScore * 0.8);
  if (totalClaims > 0) {
    const totalEvidenceStrengthSum = evidenceList.reduce((acc, e) => acc + e.overallStrength, 0);
    evidenceStrengthScore = Math.round((totalEvidenceStrengthSum / totalClaims) * 100);
  }

  // 3. Calculate Evidence Coverage
  const supportedReqs = requirementMatches.filter(m => m.status === 'MATCHED').length;
  const evidenceCoverage = totalReqs > 0 ? Math.round((supportedReqs / totalReqs) * 100) / 100 : (skillsMatchScore > 50 ? 0.75 : 0.4);

  // 4. Resume Quality & ATS Compatibility Scores
  const resumeQualityScore = Math.min(100, Math.round(skillsMatchScore * 0.5 + evidenceStrengthScore * 0.5));
  const atsCompatibilityScore = Math.min(100, Math.round(jobMatchScore * 0.6 + skillsMatchScore * 0.4));

  // 5. Deterministic Overall Evaluation Score
  const overallEvaluation = Math.round(
    jobMatchScore * rubric.jobMatchWeight +
    skillsMatchScore * rubric.technicalCapWeight +
    experienceMatchScore * rubric.experienceWeight +
    evidenceStrengthScore * rubric.evidenceWeight +
    educationMatchScore * rubric.educationWeight +
    resumeQualityScore * rubric.resumeQualityWeight +
    atsCompatibilityScore * 0.10
  );

  return {
    scores: {
      overallEvaluation,
      jobMatchScore,
      evidenceStrengthScore,
      resumeQualityScore,
      atsCompatibilityScore,
      evidenceCoverage,
    },
    evidenceCoverage,
  };
}
