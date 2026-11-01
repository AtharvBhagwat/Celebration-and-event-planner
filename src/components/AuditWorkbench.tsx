import React, { useState } from 'react';
import { SAMPLE_CODE_AUDITS, SampleCodeAudit } from '../data/sampleAudits';
import { HeuristicIssue, AuditResult } from '../types/nexus';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, ArrowRight, Play, Check } from 'lucide-react';

interface AuditWorkbenchProps {
  initialCode?: string;
  onSendToTestRunner: (code: string) => void;
}

export const AuditWorkbench: React.FC<AuditWorkbenchProps> = ({
  initialCode,
  onSendToTestRunner,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleCodeAudit>(SAMPLE_CODE_AUDITS[0]);
  const [code, setCode] = useState<string>(initialCode || SAMPLE_CODE_AUDITS[0].vulnerableCode);
  const [language, setLanguage] = useState<string>(SAMPLE_CODE_AUDITS[0].language);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [patchApplied, setPatchApplied] = useState(false);

  const handleSelectSample = (sample: SampleCodeAudit) => {
    setSelectedSample(sample);
    setCode(sample.vulnerableCode);
    setLanguage(sample.language);
    setAuditResult(null);
    setPatchApplied(false);
  };

  const handleRunAudit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setAuditResult(null);

    try {
      const res = await fetch('/api/nexus/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (data.heuristics) {
        setAuditResult({
          score: data.heuristics.score,
          issuesCount: data.heuristics.issuesCount,
          issues: data.heuristics.issues,
          aiEvaluation: data.aiEvaluation,
        });
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPatch = () => {
    setCode(selectedSample.hardenedPatch);
    setPatchApplied(true);
    setAuditResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Workbench Header */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Zero-Trust Inspector</span>
          <span aria-hidden="true">·</span>
          <span>OWASP Mitigation Engine</span>
          <span aria-hidden="true">·</span>
          <span>Automated 6-Pillar Audit</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          Code Quality & Security Threat Modeling Sandbox
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Audit code against OWASP Top 10 vulnerabilities, SOLID architecture principles, Big-O algorithmic complexity,
          and WCAG 2.2 AA accessibility standards. Inspect vulnerabilities and apply hardened production patches.
        </p>

        {/* Preset Sample Selector */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-2">Load Vulnerable Scenario:</span>
          {SAMPLE_CODE_AUDITS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedSample.id === sample.id
                  ? 'bg-slate-900 dark:bg-cyan-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>
      </section>

      {/* Editor & Audit Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Active Code Buffer</span>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {patchApplied ? 'Hardened Production Patch Applied' : 'Unchecked / Vulnerable Candidate'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="sql">SQL</option>
              </select>

              <button
                type="button"
                onClick={handleApplyPatch}
                disabled={patchApplied}
                className="py-1.5 px-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                {patchApplied ? 'Patch Applied ✓' : 'Apply Hardened Patch'}
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={18}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setPatchApplied(false);
              }}
              className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-950 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-slate-800 resize-y"
              aria-label="Code Editor Buffer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {code.split('\n').length} lines · {code.length} characters
            </span>

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={loading || !code.trim()}
              className="inline-flex items-center gap-2 py-2 px-5 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{loading ? 'Auditing 6 Pillars...' : 'Run 6-Pillar Audit'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Audit Findings & Remediation */}
        <div className="lg:col-span-5 space-y-6">
          {auditResult ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Audit Assessment Report</h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {auditResult.issuesCount} architectural / security findings
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {auditResult.score}/100
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Pillar Compliance</div>
                </div>
              </div>

              {/* Heuristic Issues List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Findings:</h3>
                {auditResult.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Zero critical vulnerabilities detected. Code complies with Zero-Trust standards.</span>
                  </div>
                ) : (
                  auditResult.issues.map((issue: HeuristicIssue, idx: number) => {
                    const isCritical = issue.severity === 'CRITICAL';
                    const isHigh = issue.severity === 'HIGH';
                    return (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-left space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {issue.pillar}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isCritical
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                                : isHigh
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {issue.severity}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {isCritical ? (
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                          )}
                          <span>{issue.title}</span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                          {issue.description}
                        </p>

                        <div className="pt-1 text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                          Fix: {issue.remediation}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action: Send to Test Runner */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSendToTestRunner(code)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  <span>Verify with Automated Test Runner</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-4">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Awaiting Audit Execution</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click "Run 6-Pillar Audit" to inspect the code buffer against OWASP vulnerabilities, SOLID coupling, Big-O complexity, and WCAG AA rules.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
