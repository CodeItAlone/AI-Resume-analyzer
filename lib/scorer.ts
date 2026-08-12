import { ResumeData, JobDescriptionData, ScoreBreakdown, SkillMatchItem } from './types';

function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[\.\-_]/g, '')
    .replace(/js$/, '')
    .replace(/javascript$/, 'js')
    .replace(/typescript$/, 'ts')
    .replace(/reactjs$/, 'react')
    .replace(/nextjs$/, 'next')
    .replace(/nodejs$/, 'node')
    .replace(/vuejs$/, 'vue');
}

export function computeSkillsMatch(
  resumeSkills: string[] = [],
  jdRequiredSkills: string[] = [],
  jdPreferredSkills: string[] = []
): { score: number; matrix: SkillMatchItem[] } {
  const safeResumeSkills = Array.isArray(resumeSkills) ? resumeSkills : [];
  const safeJdRequired = Array.isArray(jdRequiredSkills) ? jdRequiredSkills : [];
  const safeJdPreferred = Array.isArray(jdPreferredSkills) ? jdPreferredSkills : [];

  if (!safeJdRequired.length && !safeJdPreferred.length) {
    return { score: 70, matrix: [] };
  }

  const normalizedResumeSkills = safeResumeSkills.map(s => normalizeSkill(s || ''));
  const rawResumeTextSkills = safeResumeSkills.map(s => (s || '').toLowerCase());

  const matrix: SkillMatchItem[] = [];
  let reqMatchedCount = 0;
  let reqPartialCount = 0;

  for (const reqSkill of safeJdRequired) {
    if (!reqSkill) continue;
    const normReq = normalizeSkill(reqSkill);
    const lowReq = reqSkill.toLowerCase();

    const isExact = normalizedResumeSkills.some(rs => rs === normReq);
    if (isExact) {
      reqMatchedCount++;
      matrix.push({ skill: reqSkill, status: 'matched', reason: 'Found exact skill match' });
      continue;
    }

    const isPartial = rawResumeTextSkills.some(rs => rs.includes(lowReq) || lowReq.includes(rs));
    if (isPartial) {
      reqPartialCount++;
      matrix.push({ skill: reqSkill, status: 'partial', reason: 'Found related/partial skill mention' });
      continue;
    }

    matrix.push({ skill: reqSkill, status: 'missing', reason: 'Skill not found in resume' });
  }

  let prefMatchedCount = 0;
  for (const prefSkill of safeJdPreferred) {
    if (!prefSkill) continue;
    const normPref = normalizeSkill(prefSkill);
    if (normalizedResumeSkills.some(rs => rs === normPref)) {
      prefMatchedCount++;
      matrix.push({ skill: `${prefSkill} (Preferred)`, status: 'matched', reason: 'Preferred skill matched' });
    }
  }

  const totalReq = safeJdRequired.length || 1;
  const baseReqScore = ((reqMatchedCount * 1.0 + reqPartialCount * 0.5) / totalReq) * 100;
  const prefBonus = Math.min(15, prefMatchedCount * 5);

  const finalScore = Math.min(100, Math.round(baseReqScore + prefBonus));
  return { score: finalScore, matrix };
}

export function computeExperienceMatch(resumeYears: number = 0, requiredYears: number = 0): number {
  const safeResumeYears = typeof resumeYears === 'number' ? resumeYears : 0;
  const safeReqYears = typeof requiredYears === 'number' ? requiredYears : 0;
  if (safeReqYears <= 0) return 100;
  if (safeResumeYears >= safeReqYears) {
    const extraYears = safeResumeYears - safeReqYears;
    return Math.min(100, 90 + extraYears * 2);
  }
  const ratio = safeResumeYears / safeReqYears;
  return Math.max(0, Math.round(ratio * 85));
}

function degreeLevel(deg: string = ''): number {
  const d = (deg || '').toLowerCase();
  if (d.includes('phd') || d.includes('doctorate')) return 4;
  if (d.includes('master') || d.includes('ms') || d.includes('mba') || d.includes('m.s')) return 3;
  if (d.includes('bachelor') || d.includes('bs') || d.includes('ba') || d.includes('b.s') || d.includes('b.a') || d.includes('degree')) return 2;
  if (d.includes('associate') || d.includes('diploma')) return 1;
  return 0;
}

export function computeEducationMatch(
  resumeEdu: Array<{ degree: string }> = [],
  requiredEduStr: string = ''
): number {
  const safeEdu = Array.isArray(resumeEdu) ? resumeEdu : [];
  if (!requiredEduStr || requiredEduStr.toLowerCase().includes('any') || requiredEduStr.toLowerCase().includes('none')) {
    return 100;
  }
  const reqLevel = degreeLevel(requiredEduStr);
  if (reqLevel === 0) return 90;

  const highestResumeLevel = safeEdu.reduce((max, ed) => Math.max(max, degreeLevel(ed?.degree || '')), 0);

  if (highestResumeLevel >= reqLevel) return 100;
  if (highestResumeLevel === reqLevel - 1) return 75;
  if (highestResumeLevel > 0) return 50;
  return 30;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0.5;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0.5;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(100, Math.round(((similarity + 1) / 2) * 100)));
}

export function computeOverallScore(
  skills: number,
  experience: number,
  education: number,
  semantic: number
): number {
  // Locked formula: (skills * 0.40) + (experience * 0.25) + (education * 0.15) + (semantic * 0.20)
  return Math.round(skills * 0.40 + experience * 0.25 + education * 0.15 + semantic * 0.20);
}

export function computeScores(
  resume: ResumeData,
  jd: JobDescriptionData,
  semanticSimScore: number
): ScoreBreakdown {
  const { score: skillsScore, matrix } = computeSkillsMatch(
    resume.skills,
    jd.requiredSkills,
    jd.preferredSkills
  );

  const experienceScore = computeExperienceMatch(
    resume.totalExperienceYears,
    jd.experienceRequiredYears
  );

  const educationScore = computeEducationMatch(
    resume.education,
    jd.educationRequired
  );

  const overallScore = computeOverallScore(
    skillsScore,
    experienceScore,
    educationScore,
    semanticSimScore
  );

  let matchLabel: ScoreBreakdown['matchLabel'] = 'Low Match';
  if (overallScore >= 85) matchLabel = 'Exceptional Match';
  else if (overallScore >= 75) matchLabel = 'Strong Match';
  else if (overallScore >= 60) matchLabel = 'Good Match';
  else if (overallScore >= 45) matchLabel = 'Moderate Match';

  return {
    overallScore,
    matchLabel,
    subScores: {
      skillsMatch: skillsScore,
      experienceMatch: experienceScore,
      educationMatch: educationScore,
      semanticMatch: semanticSimScore,
    },
    skillsMatrix: matrix,
  };
}
