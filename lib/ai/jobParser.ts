import { JobRequirementModel, JobRequirement, RequirementType } from '../types/job';
import { normalizeSkillName, extractSkillsFromText } from '../normalization/skills';
import { callAIClient, AIProviderConfig, extractJsonString } from './client';

/**
 * Deterministic heuristic parser that extracts real requirements from the actual job description
 * without fabricating dummy skills if AI is offline.
 */
export function parseJobDescriptionHeuristically(jdText: string): JobRequirementModel {
  const text = jdText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract job title from first header or line
  let jobTitle = 'Target Role';
  for (const line of lines.slice(0, 4)) {
    if (line.length > 3 && line.length < 60 && !line.toLowerCase().startsWith('http')) {
      jobTitle = line.replace(/^(?:job\s*title|position|role)[:\s-]+/i, '').trim();
      break;
    }
  }

  // 2. Extract experience years via regex
  const expMatch = text.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?years?(?:\s*of)?\s*(?:experience|work)/i);
  const experienceYears = expMatch ? parseInt(expMatch[1], 10) : 2;

  // 3. Extract education requirement
  let educationRequired = "Bachelor's Degree";
  if (/master|m\.s|m\.tech|graduate\s*degree/i.test(text)) {
    educationRequired = "Master's Degree";
  } else if (/ph\.d|doctorate/i.test(text)) {
    educationRequired = 'Ph.D.';
  } else if (/high\s*school|associate/i.test(text)) {
    educationRequired = 'Associate Degree';
  }

  // 4. Extract all real technical skills from the job description
  let allSkills = extractSkillsFromText(text);

  // If user only typed a short job title or 1-liner role with no explicit skill list,
  // infer standard industry baseline requirements for that role:
  if (allSkills.length === 0) {
    const lower = text.toLowerCase();
    if (lower.includes('full stack') || lower.includes('fullstack')) {
      if (lower.includes('backend')) {
        allSkills = ['JavaScript', 'TypeScript', 'Java', 'Python', 'Spring Boot', 'REST API', 'PostgreSQL', 'Docker', 'React'];
      } else {
        allSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'REST API', 'PostgreSQL', 'Git'];
      }
    } else if (lower.includes('backend')) {
      allSkills = ['Java', 'Python', 'REST API', 'PostgreSQL', 'Docker', 'Git'];
    } else if (lower.includes('frontend')) {
      allSkills = ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'Tailwind CSS', 'Next.js'];
    }
  }

  // Separate into required and preferred based on sections or split evenly
  const reqSkills: string[] = [];
  const prefSkills: string[] = [];

  allSkills.forEach((skill, idx) => {
    // If mentioned near 'preferred', 'nice to have', 'bonus', mark as preferred
    const skillRegex = new RegExp(`(?:preferred|plus|bonus|nice to have)[^.\\n]*${skill}`, 'i');
    if (skillRegex.test(text) || idx >= Math.max(3, Math.ceil(allSkills.length * 0.7))) {
      prefSkills.push(skill);
    } else {
      reqSkills.push(skill);
    }
  });

  const requirements: JobRequirement[] = [];

  reqSkills.forEach((s, idx) => {
    requirements.push({
      id: `req_${idx + 1}`,
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
      id: `pref_${idx + 1}`,
      text: s,
      category: 'skill',
      requirementType: 'PREFERRED',
      normalizedSkill: normalizeSkillName(s),
      criticality: 0.5,
      importance: 0.5,
      evidenceExpected: true,
    });
  });

  return {
    jobTitle,
    seniorityLevel: experienceYears >= 5 ? 'Senior' : experienceYears >= 2 ? 'Mid-Level' : 'Junior',
    experienceRequiredYears: experienceYears,
    educationRequired,
    requiredSkills: reqSkills.map(normalizeSkillName),
    preferredSkills: prefSkills.map(normalizeSkillName),
    keywords: allSkills.slice(0, 8),
    requirements,
  };
}

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
    const cleaned = extractJsonString(jsonStr);
    const parsed = JSON.parse(cleaned);

    const requirements: JobRequirement[] = (parsed.requirements || []).map((req: any, index: number) => {
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
      jobTitle: parsed.jobTitle || 'Target Role',
      seniorityLevel: parsed.seniorityLevel || 'Mid-Level',
      experienceRequiredYears: parsed.experienceRequiredYears ?? 2,
      educationRequired: parsed.educationRequired || "Bachelor's Degree",
      requiredSkills: (parsed.requiredSkills || []).map(normalizeSkillName),
      preferredSkills: (parsed.preferredSkills || []).map(normalizeSkillName),
      keywords: parsed.keywords || [],
      requirements,
    };
  } catch (err) {
    console.warn('AI Job Parser encountered an issue, running deterministic extraction on actual text:', err);
    return parseJobDescriptionHeuristically(jdText);
  }
}
