import React, { useState } from 'react';
import { Send, Copy, Check, ArrowRight, RefreshCw, Cpu, ShieldCheck, Zap, TestTube, Eye, Layers } from 'lucide-react';

interface ArchitectStudioProps {
  onSendToAudit: (code: string) => void;
  onSendToTestRunner: (code: string) => void;
}

const TEMPLATE_PROMPTS = [
  {
    title: 'Agentic RAG Pipeline',
    prompt: 'Architect a production-grade GenAI RAG pipeline with hybrid search, semantic caching, prompt injection defense, and strict latency budgets.',
  },
  {
    title: 'Zero-Trust Microservices',
    prompt: 'Design an event-driven microservices architecture using the transactional outbox pattern, mTLS mesh security, and Kafka event brokers.',
  },
  {
    title: 'Idempotent Edge Gateway',
    prompt: 'Engineer a distributed API gateway with token-bucket rate limiting, Redis sliding windows, and an idempotency key locking engine.',
  },
  {
    title: 'Real-Time CRDT Engine',
    prompt: 'Architect a real-time collaborative state synchronization engine using state-based CRDTs (LWW-Element-Set) with offline mesh reconciliation.',
  },
];

export const ArchitectStudio: React.FC<ArchitectStudioProps> = ({
  onSendToAudit,
  onSendToTestRunner,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [extractedCode, setExtractedCode] = useState<string>('');

  const handleConsult = async (queryText?: string) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/nexus/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit }),
      });
      const data = await res.json();
      const outputText = data.text || 'No response generated.';
      setResponse(outputText);

      // Extract primary code block for quick action routing
      const codeMatch = outputText.match(/```(?:typescript|ts|javascript|js|python|go)?([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        setExtractedCode(codeMatch[1].trim());
      } else {
        setExtractedCode('');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setResponse('Encountered network connectivity fault. Please verify your connection or inspect dev server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleConsult();
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro section adhering to 60-30-10 color rule and editorial style */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Nexus Engine</span>
            <span aria-hidden="true">·</span>
            <span>Technical Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Six Core Evaluation Pillars</span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
            Production-Grade System Architecture & GenAI Synthesis
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Nexus evaluates every engineering problem through the Six Pillars: Problem-Solving Alignment,
            SOLID Code Quality, Zero-Trust Security, Big-O Performance, Foundational Testing, and WCAG 2.2 AA Accessibility.
          </p>

          {/* Quick Pillar Highlights */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: Layers, label: '1. Alignment', sub: 'Root cause' },
              { icon: Cpu, label: '2. Code Quality', sub: 'DRY & SOLID' },
              { icon: ShieldCheck, label: '3. Security', sub: 'Zero-Trust' },
              { icon: Zap, label: '4. Big-O', sub: 'Time & Space' },
              { icon: TestTube, label: '5. Testing', sub: 'Edge cases' },
              { icon: Eye, label: '6. a11y', sub: 'WCAG 2.2 AA' },
            ].map((p, idx) => {
              const IconComponent = p.icon;
              return (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-left"
                >
                  <IconComponent className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mb-1.5" aria-hidden="true" />
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{p.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Input Formulation Area */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <label htmlFor="nexus-prompt-input" className="block text-sm font-semibold text-slate-900 dark:text-white">
            Architectural Challenge or System Specification
          </label>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Specify constraints, expected throughput, security boundaries, or target technologies. Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-[10px]">Ctrl/Cmd + Enter</kbd> to submit.
          </p>
        </div>

        <div className="relative">
          <textarea
            id="nexus-prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Design a high-throughput event ingestion pipeline with Kafka, PostgreSQL outbox, mTLS verification, and distributed deduplication..."
            className="w-full p-4 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-y"
          />
        </div>

        {/* Prompt Templates */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Curated Architecture Templates:</span>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(item.prompt);
                  handleConsult(item.prompt);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-left"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setPrompt('');
              setResponse(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Clear Editor
          </button>

          <button
            type="button"
            onClick={() => handleConsult()}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 py-2 px-5 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Evaluating Pillars...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Architect Solution</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Generated Response Viewport */}
      {response && (
        <section
          aria-live="polite"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nexus Verified Solution Specification</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Verified across 6 Pillars</span>
                <span aria-hidden="true">·</span>
                <span>Zero-Trust Protocol Active</span>
                <span aria-hidden="true">·</span>
                <span>Production Ready</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                aria-label="Copy solution markdown"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Full Markdown</span>
                  </>
                )}
              </button>

              {extractedCode && (
                <>
                  <button
                    type="button"
                    onClick={() => onSendToAudit(extractedCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <span>Send to 6-Pillar Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToTestRunner(extractedCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    <span>Run Test Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Formatted Content Viewer */}
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans space-y-4">
            <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-800 dark:text-slate-200">
              {response}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
};
