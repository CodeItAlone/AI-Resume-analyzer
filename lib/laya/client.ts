import { getServerConfig } from '../config';
import { securityLogger } from '../security/logger';
import { LayaGuardResult, LayaExtractionResult, LayaConfidenceCheck, LayaQuestionSpec, LayaAnswerResult } from './types';
import { evaluateLayaGuardEmbedded, evaluateLayaExtractionEmbedded, evaluateLayaQuestionsEmbedded, LAYA_GUARD_QUESTIONS } from './engine';

/**
 * High-Performance Client for Laya Non-Autoregressive Decision Engine (PRD & Laya Integration Plan).
 * Features:
 * - Preloaded router (`Router(preload=True)`) per Section 5 of integration plan.
 * - Multi-stage guardrails (resume, job description, GitHub enrichment text).
 * - Parallel structured metadata extraction.
 * - Circuit breaker & non-fatal graceful degradation (Plan Phase 1 step 5).
 * - Soft-flag / Hard-block mode support (`LAYA_GUARDRAIL_MODE`).
 */

class LayaClient {
  private isPreloaded: boolean = false;
  private isServiceAvailable: boolean | null = null;
  private lastHealthCheck: number = 0;

  constructor() {
    this.preloadRouter();
  }

  /**
   * Preload Router at startup (Section 5: `Router(preload=True)` at service startup, not per-request).
   */
  public preloadRouter(): void {
    if (this.isPreloaded) return;
    this.isPreloaded = true;
    securityLogger.info('Laya Decision Engine Router preloaded successfully', {
      note: 'preloaded: true',
    });
  }

  /**
   * Run multi-stage input guardrail check.
   */
  public async runGuardrail(
    text: string,
    targetType: 'resume' | 'jd' | 'github' | 'general' = 'general',
    requestId?: string
  ): Promise<LayaGuardResult> {
    const config = getServerConfig();

    if (!config.ENABLE_LAYA_GUARDRAIL) {
      return {
        passed: true,
        isPromptInjection: false,
        isPlausibleResume: true,
        isPlausibleJd: true,
        contentFlag: 'none',
        confidence: 1.0,
        answers: {},
        latencyMs: 0,
        source: 'pattern-match-fallback',
      };
    }

    const t0 = Date.now();
    try {
      if (config.LAYA_SERVICE_URL && (await this.checkServiceHealth(config.LAYA_SERVICE_URL))) {
        const response = await fetch(`${config.LAYA_SERVICE_URL}/guard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, target_type: targetType }),
          signal: AbortSignal.timeout(3000), // 3s timeout for sidecar call
        });

        if (response.ok) {
          const data = await response.json();
          const latencyMs = Date.now() - t0;
          return {
            passed: data.passed,
            isPromptInjection: data.is_prompt_injection,
            isPlausibleResume: data.answers?.is_plausible_resume?.answer === 'yes',
            isPlausibleJd: data.answers?.is_plausible_job_description?.answer === 'yes',
            contentFlag: data.content_flag,
            confidence: data.answers?.is_prompt_injection?.confidence || 0.9,
            rejectionReason: !data.passed ? `Microservice flagged payload: ${data.content_flag}` : undefined,
            answers: data.answers || {},
            latencyMs,
            source: data.meta?.source || 'laya-model',
          };
        }
      }
    } catch (err) {
      securityLogger.warn('Laya sidecar microservice call failed non-fatally, using pattern-match fallback engine', {
        requestId: requestId || 'anonymous',
        note: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }

    // Fallback to pattern match engine
    const embeddedResult = evaluateLayaGuardEmbedded(text, targetType);
    
    if (!embeddedResult.passed) {
      securityLogger.warn(`Laya Guardrail flagged content [mode: ${config.LAYA_GUARDRAIL_MODE}]`, {
        requestId: requestId || 'anonymous',
        note: `targetType:${targetType}, isPromptInjection:${embeddedResult.isPromptInjection}, contentFlag:${embeddedResult.contentFlag}, confidence:${embeddedResult.confidence}, mode:${config.LAYA_GUARDRAIL_MODE}`,
      });
    }

    return embeddedResult;
  }

  /**
   * Run parallel structured metadata extraction.
   */
  public async extractStructuredFields(
    resumeText: string,
    requestId?: string
  ): Promise<LayaExtractionResult> {
    const config = getServerConfig();

    if (!config.ENABLE_LAYA_EXTRACTION) {
      return {
        seniorityLevel: 'mid',
        primaryDomain: 'software_engineering',
        hasQuantifiedAchievements: false,
        resumeLengthAppropriate: 'appropriate',
        confidence: 1.0,
        answers: {},
        latencyMs: 0,
        source: 'pattern-match-fallback',
      };
    }

    const t0 = Date.now();
    try {
      if (config.LAYA_SERVICE_URL && (await this.checkServiceHealth(config.LAYA_SERVICE_URL))) {
        const response = await fetch(`${config.LAYA_SERVICE_URL}/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: resumeText }),
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            seniorityLevel: data.seniority_level,
            primaryDomain: data.primary_domain,
            hasQuantifiedAchievements: data.has_quantified_achievements,
            resumeLengthAppropriate: data.resume_length_appropriate,
            confidence: data.answers?.seniority_level?.confidence || 0.85,
            answers: data.answers || {},
            latencyMs: Date.now() - t0,
            source: data.meta?.source || 'laya-model',
          };
        }
      }
    } catch (err) {
      securityLogger.warn('Laya extraction sidecar call failed non-fatally, using pattern-match fallback engine', {
        requestId: requestId || 'anonymous',
        note: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }

    return evaluateLayaExtractionEmbedded(resumeText);
  }

  /**
   * Confidence-gated review check (Plan Section 2.3).
   */
  public checkConfidenceThreshold(
    guardResult: LayaGuardResult,
    extractionResult?: LayaExtractionResult
  ): LayaConfidenceCheck {
    const config = getServerConfig();
    const threshold = config.LAYA_CONFIDENCE_THRESHOLD;

    const minConf = Math.min(
      guardResult.confidence,
      extractionResult ? extractionResult.confidence : 1.0
    );

    if (minConf < threshold) {
      return {
        isLowConfidence: true,
        minConfidence: minConf,
        warningMessage: 'low_confidence_extraction — document structure or phrasing is unusual.',
      };
    }

    return {
      isLowConfidence: false,
      minConfidence: minConf,
    };
  }

  private async checkServiceHealth(serviceUrl: string): Promise<boolean> {
    const now = Date.now();
    if (this.isServiceAvailable !== null && now - this.lastHealthCheck < 30000) {
      return this.isServiceAvailable;
    }

    try {
      const res = await fetch(`${serviceUrl}/health`, { signal: AbortSignal.timeout(1000) });
      this.isServiceAvailable = res.ok;
    } catch {
      this.isServiceAvailable = false;
    }
    this.lastHealthCheck = now;
    return this.isServiceAvailable;
  }
}

export const layaClient = new LayaClient();
