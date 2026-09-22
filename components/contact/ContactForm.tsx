'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Copy, Bug, Sparkles, HelpCircle, Shield, AlertCircle } from 'lucide-react';

type InquiryTopic = 'general' | 'bug' | 'feature' | 'privacy' | 'partnership';

const TOPICS: { id: InquiryTopic; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
  { id: 'bug', label: 'Bug / Parsing Issue', icon: Bug },
  { id: 'feature', label: 'Feature / LLM Request', icon: Sparkles },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
];

export function ContactForm() {
  const [topic, setTopic] = useState<InquiryTopic>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formattedSubject = subject
    ? `[Resurox - ${TOPICS.find(t => t.id === topic)?.label}] ${subject}`
    : `[Resurox] Inquiry from ${name || 'User'}`;

  const mailtoBody = `Name: ${name || 'N/A'}
Contact Email: ${email || 'N/A'}
Topic: ${TOPICS.find(t => t.id === topic)?.label}

Message:
${message}`;

  const mailtoUrl = `mailto:subrato213432@gmail.com?subject=${encodeURIComponent(
    formattedSubject
  )}&body=${encodeURIComponent(mailtoBody)}`;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = mailtoUrl;
    }
    setSubmitted(true);
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const fullText = `To: subrato213432@gmail.com\nSubject: ${formattedSubject}\n\n${mailtoBody}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="border-2 border-[#1C1B19] bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#1C1B19]">
      <div className="flex items-center justify-between border-b-2 border-[#1C1B19] pb-4 mb-6">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1B19]">
            Send an Inquiry
          </h2>
          <p className="font-mono text-xs text-[#1C1B19]/60 mt-0.5">
            Volatile in-browser dispatch • Direct response
          </p>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#7A1F1F] border border-[#7A1F1F] px-2 py-0.5 bg-[#7A1F1F]/5">
          DISPATCH DESK
        </span>
      </div>

      {submitted ? (
        <div className="p-6 bg-[#2F5233]/10 border-2 border-[#2F5233] space-y-4 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#2F5233] mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#1C1B19]">
            Email Client Opened!
          </h3>
          <p className="font-serif text-sm text-[#1C1B19]/80 max-w-md mx-auto leading-relaxed">
            Your email app was triggered with your drafted message to <strong>subrato213432@gmail.com</strong>.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase px-4 py-2.5 border border-[#1C1B19] bg-white hover:bg-[#F7F5F0] transition-colors shadow-[2px_2px_0px_#1C1B19] cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#2F5233]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Message Text'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="font-mono text-xs text-[#7A1F1F] underline hover:text-[#1C1B19] px-2 py-1"
            >
              Compose Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-6">
          
          {/* Topic Selector */}
          <div className="space-y-2">
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
              1. Select Topic
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TOPICS.map(t => {
                const Icon = t.icon;
                const isSelected = topic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTopic(t.id)}
                    className={`flex flex-col items-center justify-center text-center p-3 border font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#7A1F1F] bg-[#7A1F1F]/10 text-[#7A1F1F] font-bold shadow-[2px_2px_0px_#7A1F1F]'
                        : 'border-[#1C1B19]/30 bg-[#F7F5F0] text-[#1C1B19]/80 hover:border-[#1C1B19]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#7A1F1F]' : 'text-[#1C1B19]/60'}`} />
                    <span className="leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full font-serif text-sm px-3.5 py-2.5 border border-[#1C1B19] bg-[#F7F5F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A1F1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
                Your Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. jane@example.com"
                className="w-full font-serif text-sm px-3.5 py-2.5 border border-[#1C1B19] bg-[#F7F5F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A1F1F]"
              />
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Suggesting Groq Llama-3.3 Connection Template"
              className="w-full font-serif text-sm px-3.5 py-2.5 border border-[#1C1B19] bg-[#F7F5F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A1F1F]"
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19]">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide relevant details, steps to reproduce for bugs, or suggested model endpoints..."
              className="w-full font-serif text-sm p-3.5 border border-[#1C1B19] bg-[#F7F5F0] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A1F1F] resize-y"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase px-6 py-3.5 bg-[#7A1F1F] text-white hover:bg-[#5C1616] transition-colors shadow-[3px_3px_0px_#1C1B19] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send via Email Client</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase px-4 py-3 border border-[#1C1B19] bg-[#F7F5F0] hover:bg-white transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-[#2F5233]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
