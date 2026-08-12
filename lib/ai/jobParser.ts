import { JobRequirementModel, JobRequirement, RequirementType } from '../types/job';
import { normalizeSkillName } from '../normalization/skills';
import { callAIClient, AIProviderConfig } from './client';

export async function parseJobDescription(jdText: string, config?: AIProviderConfig): Promise<JobRequirementModel> {
  const prompt = `You are an expert job description analyzer. Extract structured requirement data from this job posting.
Return ONLY valid JSON matching this schema:
{
  "jobTitle": "string",
  "seniorityLevel": "string",
  "experienceRequiredYears": 3,
  "educationRequired": "Bachelor's Degree",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "keywords": ["string"],
  "requirements": [
    {
      "text": "string",
      "category": "skill | experience | education | certification | responsibility",
      "requirementType": "REQUIRED | PREFERRED | BONUS | RESPONSIBILITY | CONTEXT"
    }
  ]
}

Job Description Text:
${jdText.substring(0, 10000)}`;

  try {
    const jsonStr = await callAIClient(prompt, true, config);
    const parsed = JSON.parse(jsonStr);

    let requirements: JobRequirement[] = (parsed.requirements || []).map((req: any, index: number) => {
      const type: RequirementType = (req.requirementType as RequirementType) || 'REQUIRED';
      let criticality = 1.0;
      if (type === 'PREFERRED') criticality = 0.5;
      if (type === 'BONUS') criticality = 0.2;
      if (type === 'RESPONSIBILITY') criticality = 0.7;
      if (type === 'CONTEXT') criticality = 0.1;

      return {
        id: `req_${index + 1}`,
        text: req.text || '',
        category: req.category || 'skill',
        requirementType: type,
        normalizedSkill: req.category === 'skill' ? normalizeSkillName(req.text) : undefined,
        criticality,
        importance: criticality,
        evidenceExpected: type === 'REQUIRED' || type === 'PREFERRED',
      };
    });

    if (requirements.length === 0) {
      const reqSkills: string[] = parsed.requiredSkills || [];
      const prefSkills: string[] = parsed.preferredSkills || [];
      
      reqSkills.forEach((s, idx) => {
        requirements.push({
          id: `req_skill_${idx + 1}`,
          text: s,
          category: 'skill',
          requirementType: 'REQUIRED',
          normalizedSkill: normalizeSkillName(s),
          criticality: 1.0,
          importance: 1.0,
          evidenceExpected: true,
        });
      });

      prefSkills.forEach((s, idx) => {
        requirements.push({
          id: `pref_skill_${idx + 1}`,
          text: s,
          category: 'skill',
          requirementType: 'PREFERRED',
          normalizedSkill: normalizeSkillName(s),
          criticality: 0.5,
          importance: 0.5,
          evidenceExpected: true,
        });
      });
    }

    return {
      jobTitle: parsed.jobTitle || 'Software Engineer',
      seniorityLevel: parsed.seniorityLevel || 'Mid-Level',
      experienceRequiredYears: parsed.experienceRequiredYears ?? 2,
      educationRequired: parsed.educationRequired || "Bachelor's Degree",
      requiredSkills: (parsed.requiredSkills || []).map(normalizeSkillName),
      preferredSkills: (parsed.preferredSkills || []).map(normalizeSkillName),
      keywords: parsed.keywords || [],
      requirements,
    };
  } catch (err) {
    console.error('Job Description Parser Fallback:', err);
    return {
      jobTitle: 'Software Engineer',
      experienceRequiredYears: 2,
      educationRequired: "Bachelor's Degree",
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      preferredSkills: ['Next.js', 'Tailwind CSS'],
      keywords: ['frontend', 'backend', 'fullstack'],
      requirements: [
        { id: 'req_1', text: 'React', category: 'skill', requirementType: 'REQUIRED', criticality: 1.0, importance: 1.0 },
        { id: 'req_2', text: 'TypeScript', category: 'skill', requirementType: 'REQUIRED', criticality: 1.0, importance: 1.0 },
        { id: 'req_3', text: 'Node.js', category: 'skill', requirementType: 'REQUIRED', criticality: 1.0, importance: 1.0 },
      ],
    };
  }
}
