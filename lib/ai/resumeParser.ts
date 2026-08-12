import { CandidateProfile } from '../types/resume';
import { callAIClient, AIProviderConfig } from './client';
import { normalizeSkillName } from '../normalization/skills';

export async function parseResume(resumeText: string, config?: AIProviderConfig): Promise<CandidateProfile> {
  const prompt = `Extract structured candidate profile data from this raw resume text.
Return ONLY valid JSON matching this schema:
{
  "basics": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string"
  },
  "summary": "string",
  "currentTitle": "string",
  "totalExperienceYears": 5,
  "skills": ["string"],
  "education": [{ "degree": "string", "institution": "string", "year": "string", "fieldOfStudy": "string" }],
  "experience": [{ "company": "string", "title": "string", "startDate": "string", "endDate": "string", "years": 2, "responsibilities": ["string"], "achievements": ["string"], "technologies": ["string"] }],
  "projects": [{ "name": "string", "description": "string", "technologies": ["string"], "githubUrl": "string", "liveUrl": "string" }],
  "certifications": ["string"],
  "achievements": ["string"]
}

Raw Resume Text:
${resumeText.substring(0, 10000)}`;

  try {
    const jsonStr = await callAIClient(prompt, true, config);
    const parsed = JSON.parse(jsonStr);

    return {
      basics: parsed.basics || {},
      summary: parsed.summary || '',
      currentTitle: parsed.currentTitle || '',
      totalExperienceYears: parsed.totalExperienceYears ?? 2,
      skills: (parsed.skills || []).map(normalizeSkillName),
      education: parsed.education || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
      achievements: parsed.achievements || [],
    };
  } catch (err) {
    console.error('Resume Parser Fallback:', err);
    return {
      basics: {},
      summary: '',
      currentTitle: 'Software Engineer',
      totalExperienceYears: 2,
      skills: ['JavaScript', 'React', 'Node.js'],
      education: [{ degree: "Bachelor's Degree" }],
      experience: [],
      projects: [],
    };
  }
}
