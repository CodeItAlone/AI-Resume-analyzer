import { ResumeData, JobDescriptionData, ExplanationFeedback, ScoreBreakdown } from './types';
import { cosineSimilarity } from './scorer';
import { getEnvVar } from './env';

async function callOpenRouter(prompt: string, jsonSchemaResponse: boolean = true): Promise<string> {
  const apiKey = getEnvVar('OPENROUTER_API_KEY');
  const modelName = getEnvVar('OPENROUTER_MODEL', 'nvidia/nemotron-3-nano-30b-a3b:free');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'AI Resume Analyzer',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are a precise data parsing assistant. You MUST respond with ONLY raw valid JSON and no markdown backticks or explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      ...(jsonSchemaResponse ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  return content.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function parseResumeWithLLM(resumeText: string): Promise<ResumeData> {
  const prompt = `Extract structured data from this raw resume text.
Return ONLY valid JSON matching this exact structure:
{
  "personalInfo": { "name": "string", "email": "string", "phone": "string", "links": ["string"] },
  "summary": "string",
  "currentTitle": "string",
  "totalExperienceYears": 5,
  "skills": ["string"],
  "education": [{ "degree": "string", "institution": "string", "year": "string" }],
  "experience": [{ "company": "string", "title": "string", "startDate": "string", "endDate": "string", "years": 2, "responsibilities": ["string"], "achievements": ["string"] }],
  "projects": [{ "name": "string", "description": "string", "technologies": ["string"] }],
  "certifications": ["string"]
}

Raw Resume Text:
${resumeText.substring(0, 10000)}`;

  const jsonStr = await callOpenRouter(prompt);
  try {
    return JSON.parse(jsonStr) as ResumeData;
  } catch (err) {
    console.error('Failed to parse resume JSON response:', jsonStr);
    return {
      basics: { name: 'Candidate' },
      summary: '',
      currentTitle: '',
      totalExperienceYears: 2,
      skills: ['JavaScript', 'React', 'Node.js'],
      education: [{ degree: "Bachelor's Degree" }],
      experience: [],
    };
  }
}

export async function parseJobDescriptionWithLLM(jdText: string): Promise<JobDescriptionData> {
  const prompt = `Extract structured JSON requirements from this job description text.
Return ONLY valid JSON matching this structure:
{
  "jobTitle": "string",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "experienceRequiredYears": 3,
  "educationRequired": "Bachelor's Degree",
  "keywords": ["string"]
}

Job Description Text:
${jdText.substring(0, 10000)}`;

  const jsonStr = await callOpenRouter(prompt);
  try {
    return JSON.parse(jsonStr) as JobDescriptionData;
  } catch (err) {
    console.error('Failed to parse JD JSON response:', jsonStr);
    return {
      jobTitle: 'Software Engineer',
      requiredSkills: ['React', 'TypeScript', 'Node.js'],
      preferredSkills: ['Next.js', 'Tailwind'],
      experienceRequiredYears: 2,
      educationRequired: "Bachelor's Degree",
      keywords: ['frontend', 'web'],
      requirements: [],
    };
  }
}

export function generateTextEmbeddingFromVocab(text: string, vocab: string[]): number[] {
  const words = (text || '').toLowerCase().match(/\b[a-z0-9+#.]{2,}\b/g) || [];
  const freqMap: Record<string, number> = {};
  words.forEach(w => { freqMap[w] = (freqMap[w] || 0) + 1; });
  return vocab.map(term => freqMap[term] || 0);
}

export function computeTextSimilarityScore(textA: string, textB: string): number {
  const wordsA = (textA || '').toLowerCase().match(/\b[a-z0-9+#.]{2,}\b/g) || [];
  const wordsB = (textB || '').toLowerCase().match(/\b[a-z0-9+#.]{2,}\b/g) || [];

  const vocab = Array.from(new Set([...wordsA, ...wordsB]));
  if (!vocab.length) return 70;

  const vecA = vocab.map(term => wordsA.filter(w => w === term).length);
  const vecB = vocab.map(term => wordsB.filter(w => w === term).length);

  return cosineSimilarity(vecA, vecB);
}

import { callAIClient, AIProviderConfig } from './ai/client';

export async function generateExplanationLayer(
  resume: ResumeData,
  jd: JobDescriptionData,
  scores: ScoreBreakdown,
  config?: AIProviderConfig
): Promise<ExplanationFeedback> {
  const matchedSkills = scores.skillsMatrix.filter(s => s.status === 'matched').map(s => s.skill);
  const missingSkills = scores.skillsMatrix.filter(s => s.status === 'missing').map(s => s.skill);

  const prompt = `You are a top technical career coach. Generate transparent, highly factual feedback for a candidate based on pre-calculated match scores.

NON-NEGOTIABLE RULES:
1. Do NOT change numerical scores. Computed overall match is ${scores.overallScore}%.
2. STRENGTHS: List 3-4 bullet points highlighting verified skills (${matchedSkills.join(', ') || 'found skills'}).
3. AREAS TO IMPROVE: List 3-4 bullet points noting missing skills (${missingSkills.join(', ') || 'none'}).
4. RECOMMENDATIONS: List 3-5 actionable steps. Never suggest fabricating experience.

Context:
- Overall Score: ${scores.overallScore}% (${scores.matchLabel})
- Candidate Experience: ${resume.totalExperienceYears} years vs JD Requires: ${jd.experienceRequiredYears} years

Return ONLY valid JSON matching this schema:
{
  "strengths": ["string"],
  "areasToImprove": ["string"],
  "recommendations": ["string"]
}`;

  try {
    const jsonStr = await callAIClient(prompt, true, config);
    return JSON.parse(jsonStr) as ExplanationFeedback;
  } catch (err) {
    return {
      strengths: [`Matched ${matchedSkills.length} key required skills including ${matchedSkills.slice(0, 3).join(', ')}`],
      areasToImprove: [`Missing skills requested by JD: ${missingSkills.slice(0, 3).join(', ') || 'None'}`],
      recommendations: ['Highlight relevant projects matching missing skills', 'Tailor experience bullet points'],
    };
  }
}
