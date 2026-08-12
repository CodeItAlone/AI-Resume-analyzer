import { CandidateProfile } from '../types/resume';
import { JobRequirementModel } from '../types/job';
import { ScoreBreakdown, MultiDimensionalScores } from '../types/scoring';
import { RequirementMatch } from '../types/matching';
import { ExplanationFeedback } from '../types/analysis';
import { callAIClient, AIProviderConfig } from './client';

export async function generateUpgradedExplanation(
  candidate: CandidateProfile,
  jd: JobRequirementModel,
  scores: ScoreBreakdown,
  multiScores: MultiDimensionalScores,
  requirementMatches: RequirementMatch[],
  config?: AIProviderConfig
): Promise<ExplanationFeedback> {
  const matchedReqs = requirementMatches.filter(m => m.status === 'MATCHED').map(m => m.requirement.text);
  const claimedOnlyReqs = requirementMatches.filter(m => m.status === 'CLAIMED_ONLY').map(m => m.requirement.text);
  const missingReqs = requirementMatches.filter(m => m.status === 'MISSING').map(m => m.requirement.text);

  const prompt = `You are a top executive hiring evaluator. Generate transparent, highly factual feedback for a candidate based on pre-calculated match scores and evidence data.

NON-NEGOTIABLE AI RULES:
1. Do NOT recalculate or modify numerical scores. Computed Overall Evaluation is ${multiScores.overallEvaluation}%, Job Match is ${multiScores.jobMatchScore}%, Evidence Strength is ${multiScores.evidenceStrengthScore}%.
2. EXECUTIVE SUMMARY: Write a 2-3 sentence recruiter verdict.
3. STRENGTHS: List 3-4 bullet points highlighting verified skills with strong evidence (${matchedReqs.join(', ') || 'none'}).
4. CRITICAL GAPS: List any missing critical requirements (${missingReqs.join(', ') || 'none'}) or skills that are claimed only in the skills section without work experience evidence (${claimedOnlyReqs.join(', ') || 'none'}).
5. RECOMMENDATIONS: List 3-5 actionable steps to improve the candidate's resume/evidence. NEVER suggest fabricating experience.

Return ONLY valid JSON matching this schema:
{
  "executiveSummary": "string",
  "strengths": ["string"],
  "criticalGaps": ["string"],
  "areasToImprove": ["string"],
  "recommendations": ["string"],
  "recruiterVerdict": "string"
}`;

  try {
    const jsonStr = await callAIClient(prompt, true, config);
    return JSON.parse(jsonStr) as ExplanationFeedback;
  } catch (err) {
    console.error('Explanation Engine Fallback:', err);
    return {
      executiveSummary: `Candidate demonstrates a ${multiScores.jobMatchScore}% job requirement alignment with ${Math.round(multiScores.evidenceCoverage * 100)}% evidence coverage.`,
      strengths: matchedReqs.slice(0, 3).map(r => `Strong evidence supporting requirement: ${r}`),
      criticalGaps: missingReqs.slice(0, 3).map(r => `Missing requirement: ${r}`),
      areasToImprove: claimedOnlyReqs.slice(0, 3).map(r => `Skill listed in skills section only (needs work experience context): ${r}`),
      recommendations: [
        'Add project descriptions or responsibilities demonstrating claimed skills',
        'Quantify achievements with measurable outcomes',
      ],
      recruiterVerdict: multiScores.overallEvaluation >= 80 ? 'STRONG MATCH — REVIEW RECOMMENDED' : 'GOOD MATCH — REVIEW GAPS',
    };
  }
}
