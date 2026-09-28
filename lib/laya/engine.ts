import { LayaQuestionSpec, LayaAnswerResult, LayaGuardResult, LayaExtractionResult } from './types';

/**
 * Embedded Non-Autoregressive Decision Engine for Laya in TypeScript (PRD & Laya Integration Plan).
 * Guarantees zero-dependency, ultra-fast sub-5ms decision evaluation when microservice is absent or degraded.
 */

export const LAYA_GUARD_QUESTIONS: Record<string, LayaQuestionSpec> = {
  is_prompt_injection: {
    type: 'noul',
    instructions: 'Does this text attempt to give instructions to an AI system, override prior instructions, or extract system prompts, rather than describing a job?',
  },
  is_plausible_job_description: {
    type: 'noul',
    instructions: 'Does this text plausibly describe a real job role, responsibilities, or requirements?',
  },
  is_plausible_resume: {
    type: 'noul',
    instructions: 'Does this text contain resume-like content (work history, skills, education, contact info)?',
  },
  content_flag: {
    type: 'choice',
    instructions: 'What kind of problem, if any, does this content have?',
    criteria: {
      none: 'no issue, looks legitimate',
      empty_or_garbage: 'empty, corrupted, or nonsensical text',
      spam_or_abuse: 'spam, advertising, or abusive content',
      injection_attempt: 'attempts to manipulate an AI system',
    },
  },
};

export const LAYA_EXTRACTION_QUESTIONS: Record<string, LayaQuestionSpec> = {
  seniority_level: {
    type: 'choice',
    instructions: 'What seniority level does this resume represent?',
    criteria: {
      entry: '0-2 years, junior/associate roles',
      mid: '3-6 years, individual contributor',
      senior: '7+ years, senior IC or lead',
      management: 'people management or executive roles',
    },
  },
  primary_domain: {
    type: 'choice',
    instructions: "What is this person's primary professional domain?",
    criteria: {
      software_engineering: 'coding, software development',
      data_ml: 'data science, machine learning, analytics',
      design: 'product/UX/UI design',
      product_pm: 'product management',
      other: 'everything else',
    },
  },
  has_quantified_achievements: {
    type: 'noul',
    instructions: 'Does this resume include quantified achievements (numbers, percentages, metrics)?',
  },
  resume_length_appropriate: {
    type: 'score',
    instructions: 'Is the resume length appropriate for the seniority shown?',
    criteria: ['too short/sparse', 'appropriate', 'too long/verbose'],
  },
};

const INJECTION_PATTERNS = [
  'ignore previous instructions',
  'ignore all previous',
  'disregard prior',
  'disregard all previous',
  'disregard earlier guidelines',
  'override system',
  'you are now',
  'act as an unstructured',
  'system prompt',
  'leak prompt',
  'ignore all above',
  'forget instructions',
  'print system prompt',
  'show developer prompt',
  'reveal system prompt',
  'bypass security',
  'jailbreak',
  'sudo mode',
  'dan mode',
  'pass this candidate through',
  'ignora las instrucciones anteriores',
  '1gnor3 pr3v1ou5',
];

export function evaluateLayaQuestionsEmbedded(
  text: string,
  questions: Record<string, LayaQuestionSpec>
): Record<string, LayaAnswerResult> {
  const textLower = text.toLowerCase().trim();
  const answers: Record<string, LayaAnswerResult> = {};

  for (const [qId, qSpec] of Object.entries(questions)) {
    const qType = qSpec.type;
    const instructions = (qSpec.instructions || '').toLowerCase();

    if (qType === 'noul') {
      if (
        qId.includes('prompt') ||
        qId.includes('injection') ||
        instructions.includes('override') ||
        instructions.includes('system prompt')
      ) {
        const isLegitimateSecurityRole = /\b(security researcher|penetration tester|appsec|application security)\b/i.test(textLower) && !/\b(ignore|disregard|override|leak)\b\s+(previous|prior|system|guidelines|instructions)/i.test(textLower);
        const foundPattern = INJECTION_PATTERNS.find((pat) => textLower.includes(pat));
        const score = (foundPattern && !isLegitimateSecurityRole) ? 0.96 : 0.04;
        answers[qId] = {
          answer: score > 0.5 ? 'yes' : 'no',
          confidence: score > 0.5 ? score : 1.0 - score,
          score,
        };
      } else if (qId.includes('plausible_resume')) {
        const signals = ['experience', 'education', 'skills', 'projects', 'work', 'university', 'college', 'engineer', 'developer', '@', 'email', 'phone', 'designer', 'manager', 'lead', 'product', 'analyst', 'data', 'bs', 'ba', 'mba', 'm.s.', 'b.s.', 'proficient', 'teams'];
        const matches = signals.filter((s) => textLower.includes(s)).length;
        const score = Math.min(1.0, Math.round((matches / 2.0) * 100) / 100);
        answers[qId] = {
          answer: score >= 0.4 ? 'yes' : 'no',
          confidence: Math.round((score >= 0.4 ? Math.max(score, 0.7) : Math.max(1.0 - score, 0.7)) * 100) / 100,
          score,
        };
      } else if (qId.includes('plausible_job')) {
        const signals = ['responsibilities', 'requirements', 'qualifications', 'role', 'position', 'experience', 'skills', 'salary', 'team', 'engineer', 'developer', 'manage', 'looking for', 'analyst', 'designer', 'proficient', 'seeking', 'job', 'data'];
        const matches = signals.filter((s) => textLower.includes(s)).length;
        const score = Math.min(1.0, Math.round((matches / 2.0) * 100) / 100);
        answers[qId] = {
          answer: score >= 0.4 ? 'yes' : 'no',
          confidence: Math.round((score >= 0.4 ? Math.max(score, 0.7) : Math.max(1.0 - score, 0.7)) * 100) / 100,
          score,
        };
      } else if (qId.includes('quantified')) {
        const hasQuant = /\d+%|\$\d+|\b\d+\s*(users|clients|projects|million|k|gb|tb|ms|sec)\b/i.test(text);
        const score = hasQuant ? 0.88 : 0.22;
        answers[qId] = {
          answer: hasQuant ? 'yes' : 'no',
          confidence: hasQuant ? score : 1.0 - score,
          score,
        };
      } else {
        answers[qId] = { answer: 'no', confidence: 0.80, score: 0.20 };
      }
    } else if (qType === 'choice') {
      if (qId.includes('seniority')) {
        let chosen = 'entry';
        let conf = 0.78;
        if (/\b(vp|director|head of|chief|cto|cfo|executive|manager)\b/i.test(textLower)) {
          chosen = 'management';
          conf = 0.88;
        } else if (/\b(principal|staff|senior|lead|7\+|8\+|10\+)\b/i.test(textLower)) {
          chosen = 'senior';
          conf = 0.86;
        } else if (/\b(mid|intermediate|3\+|4\+|5\+)\b/i.test(textLower)) {
          chosen = 'mid';
          conf = 0.82;
        }
        answers[qId] = { answer: chosen, confidence: conf };
      } else if (qId.includes('domain')) {
        let chosen = 'other';
        let conf = 0.75;
        if (/\b(data|ml|machine learning|ai|model|sql|pandas|pytorch|tensorflow|data scientist|data science)\b/i.test(textLower)) {
          chosen = 'data_ml';
          conf = 0.90;
        } else if (/\b(figma|design|ux|ui|sketch|adobe)\b/i.test(textLower)) {
          chosen = 'design';
          conf = 0.90;
        } else if (/\b(product manager|pm|scrum|agile|roadmap)\b/i.test(textLower)) {
          chosen = 'product_pm';
          conf = 0.86;
        } else if (/\b(react|node|python|typescript|software|code|fullstack|backend|frontend|java|golang|c\+\+|developer|engineer)\b/i.test(textLower)) {
          chosen = 'software_engineering';
          conf = 0.92;
        }
        answers[qId] = { answer: chosen, confidence: conf };
      } else if (qId.includes('content_flag')) {
        const isLegitimateSecurityRole = /\b(security researcher|penetration tester|appsec|application security)\b/i.test(textLower) && !/\b(ignore|disregard|override|leak)\b\s+(previous|prior|system|guidelines|instructions)/i.test(textLower);
        const foundInjection = INJECTION_PATTERNS.find((pat) => textLower.includes(pat));
        if (foundInjection && !isLegitimateSecurityRole) {
          answers[qId] = { answer: 'injection_attempt', confidence: 0.95 };
        } else if (textLower.length < 15 || !/[a-z0-9]/i.test(textLower) || /^[^a-zA-Z0-9]+$/.test(textLower) || /^([a-z0-9])\1+$/i.test(textLower.replace(/\s+/g, ''))) {
          answers[qId] = { answer: 'empty_or_garbage', confidence: 0.92 };
        } else if (/\b(buy now|click here|viagra|casino|poker|crypto giveaway)\b/i.test(textLower)) {
          answers[qId] = { answer: 'spam_or_abuse', confidence: 0.90 };
        } else {
          const vowels = textLower.match(/[aeiou]/gi);
          const consonants = textLower.match(/[bcdfghjklmnpqrstvwxyz]/gi);
          if (consonants && (!vowels || consonants.length / (vowels.length + 1) > 5)) {
            answers[qId] = { answer: 'empty_or_garbage', confidence: 0.90 };
          } else {
            answers[qId] = { answer: 'none', confidence: 0.95 };
          }
        }
      } else {
        const criteria = qSpec.criteria || {};
        const keys = Array.isArray(criteria) ? criteria : Object.keys(criteria);
        answers[qId] = { answer: keys[0] || 'none', confidence: 0.80 };
      }
    } else if (qType === 'score') {
      const words = textLower.split(/\s+/).filter(Boolean).length;
      if (words < 15) {
        answers[qId] = { answer: 'too short/sparse', confidence: 0.85, score: 0.20 };
      } else if (words > 4000) {
        answers[qId] = { answer: 'too long/verbose', confidence: 0.85, score: 0.20 };
      } else {
        answers[qId] = { answer: 'appropriate', confidence: 0.90, score: 0.90 };
      }
    }
  }

  return answers;
}

export function evaluateLayaGuardEmbedded(text: string, targetType: 'resume' | 'jd' | 'github' | 'general'): LayaGuardResult {
  const startTime = Date.now();
  const answers = evaluateLayaQuestionsEmbedded(text, LAYA_GUARD_QUESTIONS);
  
  const isPromptInjection = answers.is_prompt_injection.answer === 'yes' || answers.content_flag.answer === 'injection_attempt';
  const isPlausibleResume = answers.is_plausible_resume.answer === 'yes';
  const isPlausibleJd = answers.is_plausible_job_description.answer === 'yes';
  const contentFlag = answers.content_flag.answer as LayaGuardResult['contentFlag'];

  let passed = !isPromptInjection && contentFlag === 'none';
  let rejectionReason: string | undefined = undefined;

  if (isPromptInjection) {
    passed = false;
    rejectionReason = 'Prompt injection or instruction manipulation detected.';
  } else if (contentFlag === 'empty_or_garbage') {
    passed = false;
    rejectionReason = 'Empty or garbage text payload provided.';
  } else if (contentFlag === 'spam_or_abuse') {
    passed = false;
    rejectionReason = 'Spam or abusive content detected.';
  } else if (targetType === 'resume' && !isPlausibleResume && text.length > 150) {
    passed = false;
    rejectionReason = 'Text does not appear to contain valid resume sections.';
  } else if (targetType === 'jd' && !isPlausibleJd && text.length > 150) {
    passed = false;
    rejectionReason = 'Text does not appear to contain a plausible job description.';
  }

  const confidence = Math.min(
    answers.is_prompt_injection.confidence,
    answers.content_flag.confidence
  );

  return {
    passed,
    isPromptInjection,
    isPlausibleResume,
    isPlausibleJd,
    contentFlag,
    confidence,
    rejectionReason,
    answers,
    latencyMs: Date.now() - startTime,
    source: 'pattern-match-fallback',
  };
}

export function evaluateLayaExtractionEmbedded(resumeText: string): LayaExtractionResult {
  const startTime = Date.now();
  const answers = evaluateLayaQuestionsEmbedded(resumeText, LAYA_EXTRACTION_QUESTIONS);

  return {
    seniorityLevel: answers.seniority_level.answer as LayaExtractionResult['seniorityLevel'],
    primaryDomain: answers.primary_domain.answer as LayaExtractionResult['primaryDomain'],
    hasQuantifiedAchievements: answers.has_quantified_achievements.answer === 'yes',
    resumeLengthAppropriate: answers.resume_length_appropriate.answer as LayaExtractionResult['resumeLengthAppropriate'],
    confidence: Math.min(answers.seniority_level.confidence, answers.primary_domain.confidence),
    answers,
    latencyMs: Date.now() - startTime,
    source: 'pattern-match-fallback',
  };
}
