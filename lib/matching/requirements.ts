import { JobRequirementModel } from '../types/job';
import { SkillClaimEvidence } from '../types/evidence';
import { RequirementMatch, MatchStatus } from '../types/matching';

export function matchRequirements(
  jd: JobRequirementModel,
  evidenceList: SkillClaimEvidence[]
): RequirementMatch[] {
  const matches: RequirementMatch[] = [];
  const evidenceMap = new Map(evidenceList.map(e => [e.normalizedSkill.toLowerCase(), e]));

  for (const req of jd.requirements) {
    const normReq = (req.normalizedSkill || req.text).toLowerCase();
    const foundEvidence = evidenceMap.get(normReq);

    let status: MatchStatus = 'MISSING';
    let matchScore = 0;
    let confidence = 0.9;
    let reason = 'Requirement not demonstrated in resume';

    if (foundEvidence) {
      if (foundEvidence.status === 'STRONGLY_SUPPORTED') {
        status = 'MATCHED';
        matchScore = 100;
        confidence = 0.98;
        reason = 'Requirement strongly supported by resume experience/projects';
      } else if (foundEvidence.status === 'SUPPORTED') {
        status = 'MATCHED';
        matchScore = 90;
        confidence = 0.92;
        reason = 'Requirement supported by resume work/projects';
      } else if (foundEvidence.status === 'CLAIMED') {
        status = 'CLAIMED_ONLY';
        matchScore = 50;
        confidence = 0.5;
        reason = 'Requirement listed in skills section only (no work experience evidence)';
      }
    } else {
      // Partial string matching check
      const partialEvidence = evidenceList.find(e =>
        e.skill.toLowerCase().includes(normReq) || normReq.includes(e.skill.toLowerCase())
      );
      if (partialEvidence) {
        status = 'PARTIAL';
        matchScore = 65;
        confidence = 0.7;
        reason = `Partial match found with related skill: ${partialEvidence.skill}`;
      }
    }

    matches.push({
      requirementId: req.id,
      requirement: req,
      status,
      matchScore,
      confidence,
      evidence: foundEvidence ? foundEvidence.evidenceItems : [],
      reason,
    });
  }

  return matches;
}
