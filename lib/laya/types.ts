/**
 * Laya Non-Autoregressive Decision Engine Types (PRD & Laya Integration Plan).
 */

export type LayaQuestionType = 'noul' | 'choice' | 'score';

export interface LayaQuestionSpec {
  type: LayaQuestionType;
  instructions: string;
  criteria?: Record<string, string> | string[];
}

export interface LayaAnswerResult {
  answer: string;
  confidence: number;
  score?: number;
}

export interface LayaPredictResponse {
  answers: Record<string, LayaAnswerResult>;
  meta: {
    latency_ms: number;
    preloaded: boolean;
    source: 'microservice' | 'embedded_ts';
  };
}

export interface LayaGuardResult {
  passed: boolean;
  isPromptInjection: boolean;
  isPlausibleResume: boolean;
  isPlausibleJd: boolean;
  contentFlag: 'none' | 'empty_or_garbage' | 'spam_or_abuse' | 'injection_attempt';
  confidence: number;
  rejectionReason?: string;
  answers: Record<string, LayaAnswerResult>;
  latencyMs: number;
  source: 'laya-model' | 'pattern-match-fallback';
}

export interface LayaExtractionResult {
  seniorityLevel: 'entry' | 'mid' | 'senior' | 'management';
  primaryDomain: 'software_engineering' | 'data_ml' | 'design' | 'product_pm' | 'other';
  hasQuantifiedAchievements: boolean;
  resumeLengthAppropriate: 'too short/sparse' | 'appropriate' | 'too long/verbose';
  confidence: number;
  answers: Record<string, LayaAnswerResult>;
  latencyMs: number;
  source: 'laya-model' | 'pattern-match-fallback';
}

export interface LayaConfidenceCheck {
  isLowConfidence: boolean;
  minConfidence: number;
  warningMessage?: string;
}
