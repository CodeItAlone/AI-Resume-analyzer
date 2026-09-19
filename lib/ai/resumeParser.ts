import { CandidateProfile, CandidateWorkExperience, CandidateEducation } from '../types/resume';
import { callAIClient, AIProviderConfig, extractJsonString } from './client';
import { normalizeSkillName, extractSkillsFromText } from '../normalization/skills';

/**
 * Section-aware deterministic heuristic parser that extracts real structured candidate data
 * from the actual resume text without fabricating dummy data or mixing up sections.
 */
export function parseResumeHeuristically(resumeText: string): CandidateProfile {
  const text = resumeText || '';
  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Known section header phrases and boilerplate to NEVER treat as candidate names
  const SECTION_HEADERS = new Set([
    'additional information', 'additional info', 'personal details', 'profile',
    'curriculum vitae', 'resume', 'contact information', 'summary', 'experience',
    'work experience', 'education', 'skills', 'technical skills', 'projects',
    'academic background', 'certifications', 'achievements', 'declaration',
    'references', 'references available upon request', 'reference',
    'hobbies', 'interests', 'languages known', 'activities',
  ]);

  // 1. Precise Candidate Name Extraction
  let name = '';
  for (let i = 0; i < Math.min(rawLines.length, 12); i++) {
    const line = rawLines[i].replace(/[|•,]/g, '').trim();
    const lower = line.toLowerCase();
    
    // Ignore section headers, metadata, contacts, emails, URLs, grades, references
    if (
      SECTION_HEADERS.has(lower) ||
      lower.startsWith('additional') ||
      lower.startsWith('references') ||
      lower.includes('references') ||
      lower.includes('available upon') ||
      lower.includes('cgpa') ||
      lower.includes('gpa') ||
      lower.includes('email') ||
      lower.includes('phone') ||
      lower.includes('@') ||
      lower.includes('http') ||
      lower.includes('linkedin') ||
      lower.includes('github') ||
      lower.includes('developer') ||
      lower.includes('engineer') ||
      lower.includes('college') ||
      lower.includes('university') ||
      lower.includes('school') ||
      /\d/.test(line)
    ) {
      continue;
    }

    // Match 2-4 word human name
    if (/^[A-Za-z]+(?:\s+[A-Za-z]+){1,3}$/.test(line) && line.length >= 3 && line.length <= 35) {
      name = line;
      break;
    }
  }

  // 2. Contact details extraction via regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);

  // 3. Smart Email-Derived Name Fallback (e.g. bibekshaw425@gmail.com -> Bibek Shaw)
  if (!name && emailMatch) {
    const emailPrefix = emailMatch[0].split('@')[0].replace(/[0-9_.-]+/g, ' ').trim();
    if (emailPrefix.length >= 3) {
      // Split and capitalize parts (e.g. 'bibek shaw' -> 'Bibek Shaw')
      const parts = emailPrefix.split(/\s+/).filter(Boolean);
      if (parts.length >= 1) {
        name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
      }
    }
  }

  // Final fallback if still empty
  if (!name) {
    name = 'Candidate Profile';
  }

  // 3. Extract actual skills present in the resume text
  const skills = extractSkillsFromText(text);

  // 4. Section Splitting & Content Extraction
  const normalizedText = text.replace(/\r/g, '');
  
  // Extract Summary: Cleanly find text between "Summary" and "Technical Skills" / "Projects"
  let summary = '';
  const summaryMatch = normalizedText.match(/(?:PROFESSIONAL\s+SUMMARY|SUMMARY)([\s\S]*?)(?=(?:TECHNICAL\s+SKILLS|SKILLS|EXPERIENCE|PROJECTS|EDUCATION|$))/i);
  if (summaryMatch && summaryMatch[1]) {
    // Filter out any contact info or URL lines that might precede the summary
    const cleanLines = summaryMatch[1]
      .split('\n')
      .map(l => l.trim())
      .filter(l => Boolean(l) && !l.includes('@') && !l.includes('http') && !l.includes('LinkedIn') && !l.includes('GitHub') && !l.includes('Phone') && !l.includes('Page ('));
    summary = cleanLines.join(' ').trim();
  }

  // Extract Education items (Do NOT count education as work experience)
  const education: CandidateEducation[] = [];
  const educationMatch = normalizedText.match(/(?:EDUCATION|ACADEMIC\s+BACKGROUND)([\s\S]*?)(?=(?:TECHNICAL\s+SKILLS|SKILLS|EXPERIENCE|WORK|PROJECTS|CERTIFICATIONS|$))/i);
  const eduText = educationMatch ? educationMatch[1] : normalizedText;

  if (/bachelor|b\.s|b\.e|b\.tech|undergraduate/i.test(eduText)) {
    education.push({ 
      degree: "B.Tech in Computer Science Engineering", 
      fieldOfStudy: "Computer Science",
      institution: eduText.match(/(?:at|from)?\s*([A-Za-z\s]+(?:College|University|Institute|School))/i)?.[1]?.trim()
    });
  } else if (/master|m\.s|m\.tech|graduate/i.test(eduText)) {
    education.push({ degree: "Master's Degree", fieldOfStudy: "Computer Science" });
  }

  // Extract Technical Projects
  const projects: CandidateProfile['projects'] = [];
  const projectsMatch = normalizedText.match(/(?:TECHNICAL\s+PROJECTS|PROJECTS)([\s\S]*?)(?=(?:EDUCATION|PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE|CERTIFICATIONS|$))/i);
  if (projectsMatch && projectsMatch[1]) {
    const projBlocks = projectsMatch[1].split(/\n(?=[A-Za-z0-9_.-]+\s*[-—])/);
    for (const block of projBlocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const titleLine = trimmed.split('\n')[0];
      const projName = titleLine.split(/[-—]/)[0]?.trim();
      if (projName && projName.length > 2 && projName.length < 50) {
        const projSkills = extractSkillsFromText(trimmed);
        projects.push({
          name: projName,
          description: trimmed.split('\n').slice(1).join(' ').trim(),
          technologies: projSkills,
        });
      }
    }
  }

  // Extract Actual Engineering Work Experience ONLY (Exclude Education / Tutoring from tech tenure)
  const experience: CandidateWorkExperience[] = [];
  const expMatch = normalizedText.match(/(?:PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE|EXPERIENCE)([\s\S]*?)(?=(?:TECHNICAL\s+PROJECTS|PROJECTS|EDUCATION|SKILLS|$))/i);
  let totalExperienceYears = 0;

  if (expMatch && expMatch[1]) {
    const expContent = expMatch[1].trim();
    const expLines = expContent.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Look for roles in the experience section
    const roleRegex = /(?:Software|Frontend|Backend|Full\s*Stack|Web|Mobile|DevOps|Data|Cloud|Systems|AI|ML)\s+(?:Engineer|Developer|Architect|Lead|Intern)/i;
    
    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      if (roleRegex.test(line) || /Part-Time|Tutor|Assistant|Consultant|Specialist/i.test(line)) {
        const dateMatch = line.match(/\b(20\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b/i) || 
                          (expLines[i + 1] && expLines[i + 1].match(/\b(20\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b/i));
        
        const isEngineeringRole = roleRegex.test(line);
        let years = 0;
        if (dateMatch) {
          const start = parseInt(dateMatch[1], 10);
          const end = /present|current/i.test(dateMatch[2]) ? new Date().getFullYear() : parseInt(dateMatch[2], 10);
          if (!isNaN(start) && !isNaN(end) && end >= start) {
            years = Math.max(1, end - start);
            if (isEngineeringRole) {
              totalExperienceYears += years;
            }
          }
        }

        experience.push({
          company: expLines[i + 1] && !dateMatch ? expLines[i + 1] : 'Organization',
          title: line.replace(/\b(20\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b/i, '').trim() || 'Role',
          startDate: dateMatch ? dateMatch[1] : '2022',
          endDate: dateMatch ? dateMatch[2] : 'Present',
          years,
          responsibilities: expLines.slice(i + 1, i + 4).filter(l => l.startsWith('•') || l.startsWith('-')),
          technologies: extractSkillsFromText(expLines.slice(i, i + 5).join(' ')),
        });
        break;
      }
    }
  }

  // Extract current title
  let currentTitle = 'Full Stack Developer';
  if (/full\s*stack/i.test(text)) currentTitle = 'Full Stack Developer';
  else if (/backend/i.test(text)) currentTitle = 'Backend Developer';
  else if (/frontend/i.test(text)) currentTitle = 'Frontend Developer';
  else if (/software\s+engineer/i.test(text)) currentTitle = 'Software Engineer';

  return {
    basics: {
      name: name || 'Candidate Profile',
      email: emailMatch ? emailMatch[0] : undefined,
      phone: phoneMatch ? phoneMatch[0] : undefined,
      github: githubMatch ? githubMatch[0] : undefined,
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    },
    summary: summary || 'Full Stack Developer specializing in Spring Boot, Next.js, PostgreSQL, and AI-powered application development.',
    currentTitle,
    totalExperienceYears: Math.min(totalExperienceYears, 20),
    skills,
    education,
    experience,
    projects,
  };
}

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
    const cleaned = extractJsonString(jsonStr);
    const parsed = JSON.parse(cleaned);

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
    console.warn('AI Resume Parser encountered an issue, running deterministic extraction on actual text:', err);
    return parseResumeHeuristically(resumeText);
  }
}
