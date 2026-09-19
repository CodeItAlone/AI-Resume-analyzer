'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResumeDocument } from '@/components/ResumeDocument';
import { ProcessingState } from '@/components/ProcessingState';
import { AnalysisResponse } from '@/lib/types';
import { AIProvider } from '@/lib/ai/client';
import { ChevronDown, ChevronUp, Sliders, ArrowLeft } from 'lucide-react';
import { EmuserLogo } from '@/components/branding';
import Link from 'next/link';

const LOADING_STAGES = [
  'Uploading Resume',
  'Extracting Document',
  'Structuring Candidate Profile',
  'Understanding Job Requirements',
  'Normalizing Skills',
  'Collecting Evidence',
  'Enriching Public Profiles',
  'Matching Requirements',
  'Evaluating Evidence',
  'Calculating Scores',
  'Generating Report',
];

const DEFAULT_MODELS: Record<AIProvider, string> = {
  openrouter: 'nvidia/nemotron-3-nano-30b-a3b:free',
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
};

export default function WorkspacePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  
  // Multi-provider settings state
  const [provider, setProvider] = useState<AIProvider>('openrouter');
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>(DEFAULT_MODELS.openrouter);
  
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Load provider config from localStorage on mount safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedProvider = (localStorage.getItem('ai_provider') as AIProvider) || 'openrouter';
    const savedKey = localStorage.getItem(`ai_key_${savedProvider}`) || '';
    const savedModel = localStorage.getItem(`ai_model_${savedProvider}`) || DEFAULT_MODELS[savedProvider];

    const t = setTimeout(() => {
      setProvider(savedProvider);
      setApiKey(savedKey);
      setModel(savedModel);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    localStorage.setItem('ai_provider', newProvider);
    
    const savedKey = localStorage.getItem(`ai_key_${newProvider}`) || '';
    const savedModel = localStorage.getItem(`ai_model_${newProvider}`) || DEFAULT_MODELS[newProvider];
    setApiKey(savedKey);
    setModel(savedModel);
  };

  const handleApiKeyChange = (keyVal: string) => {
    setApiKey(keyVal);
    localStorage.setItem(`ai_key_${provider}`, keyVal);
  };

  const handleModelChange = (modelVal: string) => {
    setModel(modelVal);
    localStorage.setItem(`ai_model_${provider}`, modelVal);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('No file uploaded — select a PDF or DOCX resume.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Job description is empty — paste the job requirements.');
      return;
    }

    setError(null);
    setLoading(true);
    setCurrentStageIdx(0);

    const stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < LOADING_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      formData.append('provider', provider);
      if (apiKey.trim()) formData.append('apiKey', apiKey.trim());
      if (model.trim()) formData.append('model', model.trim());

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stageInterval);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Unable to process document — verify your Provider API key or inputs.');
        }
        setResult(data);
      } else {
        const text = await res.text();
        throw new Error(text.slice(0, 300) || `Server returned status ${res.status}`);
      }
    } catch (err: any) {
      clearInterval(stageInterval);
      setError(err?.message || 'Unable to process document — verify API key or file format.');
    } finally {
      setLoading(false);
      setCurrentStageIdx(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#1C1B19] font-serif selection:bg-[#7A1F1F] selection:text-white pb-24">
      {/* Header Desk Branding */}
      <header className="border-b border-[#1C1B19]/20 bg-[#F7F5F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center no-underline">
              <EmuserLogo size="sm" showTagline={false} />
            </Link>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7A1F1F] border border-[#7A1F1F] px-2 py-0.5 ml-1">
              UPGRADED v2.0
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {result ? (
              <button
                onClick={handleReset}
                className="font-mono text-xs font-bold uppercase text-[#1C1B19] border border-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#F7F5F0] px-4 py-2 transition-colors rounded-none"
              >
                Analyze New Document
              </button>
            ) : (
              <Link
                href="/"
                className="font-mono text-xs font-bold uppercase text-[#1C1B19]/70 hover:text-[#7A1F1F] flex items-center gap-1.5 px-3 py-1.5 transition-colors no-underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!result && !loading ? (
          /* Manuscript Input Desktop View */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1B19] mb-2">
                Evidence-Backed Candidate Evaluation
              </h2>
              <p className="font-serif italic text-base text-[#1C1B19]/70 max-w-xl mx-auto">
                Upload your resume and paste the job description. Configure your preferred AI Provider, API Key, and Model below.
              </p>
            </div>

            <div className="bg-[#F7F5F0] border-2 border-[#1C1B19] p-6 sm:p-10 shadow-lg space-y-8 rounded-none">
              {/* Multi-Provider Configuration Box */}
              <div className="border border-[#1C1B19]/20 bg-[#1C1B19]/5 p-4 rounded-none">
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]"
                >
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-[#7A1F1F]" />
                    <span>
                      AI Provider Settings: <span className="underline uppercase">{provider}</span> ({model})
                    </span>
                  </div>
                  {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showConfig && (
                  <div className="mt-4 pt-4 border-t border-[#1C1B19]/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Provider Selector */}
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1C1B19]/70 mb-1">
                          Service Provider
                        </label>
                        <select
                          value={provider}
                          onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                          className="w-full bg-[#F7F5F0] border border-[#1C1B19]/40 focus:border-[#1C1B19] p-2 font-mono text-xs text-[#1C1B19] outline-none"
                        >
                          <option value="openrouter">OpenRouter (Default / Free)</option>
                          <option value="gemini">Google Gemini</option>
                          <option value="openai">OpenAI</option>
                        </select>
                      </div>

                      {/* API Key Input */}
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1C1B19]/70 mb-1">
                          API Key {apiKey ? '(Saved)' : '(Optional / Default fallback)'}
                        </label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => handleApiKeyChange(e.target.value)}
                          placeholder={provider === 'openrouter' ? 'sk-or-v1-...' : provider === 'openai' ? 'sk-...' : 'AIzaSy...'}
                          className="w-full bg-[#F7F5F0] border border-[#1C1B19]/40 focus:border-[#1C1B19] p-2 font-mono text-xs text-[#1C1B19] outline-none"
                        />
                      </div>

                      {/* Model Name Input */}
                      <div>
                        <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1C1B19]/70 mb-1">
                          Model Identifier
                        </label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => handleModelChange(e.target.value)}
                          placeholder={DEFAULT_MODELS[provider]}
                          className="w-full bg-[#F7F5F0] border border-[#1C1B19]/40 focus:border-[#1C1B19] p-2 font-mono text-xs text-[#1C1B19] outline-none"
                        />
                      </div>
                    </div>

                    <p className="font-serif italic text-xs text-[#1C1B19]/60">
                      Settings are stored locally in your browser. Leave API Key blank to use server environment fallback key.
                    </p>
                  </div>
                )}
              </div>

              {/* Error Notice */}
              {error && (
                <div className="p-4 border-l-4 border-[#8B2E2E] bg-[#8B2E2E]/10 font-mono text-xs text-[#8B2E2E]">
                  <p className="font-bold">ANALYSIS ERROR:</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <FileUpload file={file} onFileSelect={setFile} />
                </div>

                <div className="flex flex-col">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19] mb-2">
                    Paste Job Description <span className="text-[#8B2E2E]">*</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full target job posting requirements and responsibilities here..."
                    className="w-full flex-1 min-h-[180px] bg-[#F7F5F0] border border-[#1C1B19]/40 focus:border-[#1C1B19] focus:ring-0 p-3 font-serif text-sm text-[#1C1B19] placeholder:text-[#1C1B19]/40 resize-none rounded-none outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!file || !jobDescription.trim()}
                  onClick={handleAnalyze}
                  className={`w-full sm:w-auto px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors rounded-none ${
                    !file || !jobDescription.trim()
                      ? 'border border-[#1C1B19]/30 text-[#1C1B19]/40 cursor-not-allowed'
                      : 'bg-[#1C1B19] text-[#F7F5F0] hover:bg-[#7A1F1F]'
                  }`}
                >
                  Submit Document for Markup
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          /* Staged Processing Overlay */
          <ProcessingState currentStageIdx={currentStageIdx} stages={LOADING_STAGES} />
        ) : result ? (
          /* Final Manuscript View with Score Stamp & Marginalia */
          <ResumeDocument
            resume={result.resume}
            scores={result.scores}
            multiDimensionalScores={result.multiDimensionalScores}
            requirementMatches={result.requirementMatches}
            explanation={result.explanation}
          />
        ) : null}
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-[#1C1B19]/10 pt-8 pb-12 text-center select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <EmuserLogo size="xs" showTagline={true} />
          </div>
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs text-[#1C1B19]/60">
            <Link href="/privacy" className="hover:text-[#7A1F1F] transition-colors underline-offset-4 hover:underline">
              Privacy
            </Link>
            <span className="text-[#1C1B19]/30">•</span>
            <Link href="/terms" className="hover:text-[#7A1F1F] transition-colors underline-offset-4 hover:underline">
              Terms
            </Link>
            <span className="text-[#1C1B19]/30">•</span>
            <span>EMUSER • EDIT • ANALYZE • ADVANCE</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
