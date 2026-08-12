import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/extractor';
import { parseResume } from '@/lib/ai/resumeParser';
import { parseJobDescription } from '@/lib/ai/jobParser';
import { fetchGitHubPublicEvidence } from '@/lib/enrichment/github';
import { resolveCandidateEvidence } from '@/lib/evidence/resolver';
import { matchRequirements } from '@/lib/matching/requirements';
import { computeMultiDimensionalScores } from '@/lib/scoring/rubric';
import { computeScores } from '@/lib/scorer';
import { computeTextSimilarityScore, generateExplanationLayer } from '@/lib/ai';
import { generateUpgradedExplanation } from '@/lib/ai/explanation';
import { AnalysisResponse, AuditTrailStage } from '@/lib/types';

export const maxDuration = 60; // 60s timeout limit

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const auditTrail: AuditTrailStage[] = [];

  const logStage = (stageName: string, durationMs: number, status: 'SUCCESS' | 'WARNING' | 'FAILED', notes?: string) => {
    auditTrail.push({ stageName, timestamp: new Date().toISOString(), durationMs, status, notes });
  };

  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const jdText = formData.get('jobDescription') as string | null;
    const provider = (formData.get('provider') as any) || 'openrouter';
    const apiKey = (formData.get('apiKey') as string | null) || undefined;
    const model = (formData.get('model') as string | null) || undefined;

    const aiConfig = { provider, apiKey, model };

    // 1. File Validation
    if (!file) {
      return NextResponse.json({ error: 'Please upload a valid resume file.' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'docx') {
      return NextResponse.json({ error: 'Invalid file format. Only PDF (.pdf) and Word (.docx) documents are supported.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size exceeds the 5MB maximum limit.' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }

    if (!jdText || !jdText.trim()) {
      return NextResponse.json({ error: 'Please provide a non-empty job description.' }, { status: 400 });
    }

    // 2. Extract Document Text
    const t0 = Date.now();
    const rawResumeText = await extractTextFromFile(file);
    if (!rawResumeText || rawResumeText.trim().length < 20) {
      return NextResponse.json({ error: 'Could not extract sufficient text from the uploaded document.' }, { status: 400 });
    }
    logStage('Document Extraction', Date.now() - t0, 'SUCCESS');

    // 3. Parallel AI Candidate & Job Parsing
    const t1 = Date.now();
    const [candidateProfile, jobRequirementModel] = await Promise.all([
      parseResume(rawResumeText, aiConfig),
      parseJobDescription(jdText, aiConfig),
    ]);
    logStage('Candidate & Job Parsing', Date.now() - t1, 'SUCCESS');

    // 4. Optional GitHub Evidence Enrichment
    const t2 = Date.now();
    const githubRepos = candidateProfile.basics?.github
      ? await fetchGitHubPublicEvidence(candidateProfile.basics.github)
      : [];
    logStage('GitHub Enrichment', Date.now() - t2, githubRepos.length > 0 ? 'SUCCESS' : 'SUCCESS', githubRepos.length > 0 ? `Enriched ${githubRepos.length} public repos` : 'No GitHub URL provided');

    // 5. Evidence Collection & Requirement Matching
    const t3 = Date.now();
    const evidenceList = resolveCandidateEvidence(candidateProfile, githubRepos);
    const requirementMatches = matchRequirements(jobRequirementModel, evidenceList);
    logStage('Evidence & Requirement Matching', Date.now() - t3, 'SUCCESS');

    // 6. Multi-Dimensional & Backward-Compatible Pure Scoring Engine
    const t4 = Date.now();
    const semanticSimilarity = computeTextSimilarityScore(rawResumeText, jdText);
    const legacyScores = computeScores(candidateProfile, jobRequirementModel, semanticSimilarity);

    const { scores: multiDimensionalScores, evidenceCoverage } = computeMultiDimensionalScores(
      requirementMatches,
      evidenceList,
      legacyScores.subScores.skillsMatch,
      legacyScores.subScores.experienceMatch,
      legacyScores.subScores.educationMatch
    );
    logStage('Deterministic Rubric Scoring', Date.now() - t4, 'SUCCESS');

    // 7. Factual Explanation Engine Generation
    const t5 = Date.now();
    const upgradedExplanation = await generateUpgradedExplanation(
      candidateProfile,
      jobRequirementModel,
      legacyScores,
      multiDimensionalScores,
      requirementMatches,
      aiConfig
    );

    // Fallback legacy explanation check
    const legacyExplanation = await generateExplanationLayer(candidateProfile, jobRequirementModel, legacyScores, aiConfig);
    logStage('Explanation Engine', Date.now() - t5, 'SUCCESS');

    logStage('Total Analysis Pipeline', Date.now() - startTime, 'SUCCESS');

    const responseData: AnalysisResponse = {
      resume: candidateProfile,
      jobDescription: jobRequirementModel,
      scores: legacyScores,
      multiDimensionalScores,
      requirementMatches,
      explanation: {
        ...upgradedExplanation,
        strengths: upgradedExplanation.strengths || legacyExplanation.strengths,
        areasToImprove: upgradedExplanation.areasToImprove || legacyExplanation.areasToImprove,
        recommendations: upgradedExplanation.recommendations || legacyExplanation.recommendations,
      },
      auditTrail,
      rawText: {
        resumeSnippet: rawResumeText.substring(0, 300) + '...',
        jdSnippet: jdText.substring(0, 300) + '...',
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error('Upgraded Analysis API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during analysis.' },
      { status: 500 }
    );
  }
}
