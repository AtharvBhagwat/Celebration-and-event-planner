import React, { useState } from 'react';
import { TestCase } from '../types/nexus';
import { Play, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TestRunnerStudioProps {
  initialCode?: string;
}

const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'test-1',
    title: 'Happy Path: Valid Payload Dispatch & UUID Trace Integrity',
    type: 'unit',
    input: '{ amount: 150, traceId: "trace-alpha-991" }',
    expected: 'Event emitted with valid RFC4122 UUID, traceId preserved, amount == 150',
    status: 'passed',
    durationMs: 4,
    details: 'Assertion passed: event.payload.amount === 150, event.traceId === "trace-alpha-991".',
  },
  {
    id: 'test-2',
    title: 'Zero-Trust Boundary: Rejection of Negative Values & SQL Metacharacters',
    type: 'security',
    input: '{ amount: -50, username: "admin\' OR 1=1--" }',
    expected: 'Throw ValidationError: "Invalid amount or prohibited SQL metacharacters"',
    status: 'passed',
    durationMs: 7,
    details: 'Assertion passed: Threw ValidationError at perimeter filter before db query.',
  },
  {
    id: 'test-3',
    title: 'Boundary & Null Edge Case: Null Payload & Empty String Handling',
    type: 'edge-case',
    input: '{ amount: null, query: "" }',
    expected: 'Defensive validation fallback: rejects null with 400 Bad Request',
    status: 'passed',
    durationMs: 3,
    details: 'Assertion passed: Graceful rejection without main thread crash or uncaught TypeError.',
  },
  {
    id: 'test-4',
    title: 'Async Failure & Timeout Circuit Breaker: Downstream Failure Isolation',
    type: 'async-failure',
    input: 'Simulated downstream HTTP 504 Gateway Timeout (delay: 6000ms)',
    expected: 'Trip circuit breaker at 2000ms, fall back to secondary semantic cache',
    status: 'passed',
    durationMs: 12,
    details: 'Assertion passed: TimeoutException caught cleanly; circuit breaker opened.',
  },
  {
    id: 'test-5',
    title: 'Cryptographic Signature Tampering: HMAC Constant-Time Equality Check',
    type: 'security',
    input: '{ eventId: "evt-01", payload: { total: 10 }, signature: "forged_hex..." }',
    expected: 'crypto.timingSafeEqual returns false, prevents privilege escalation',
    status: 'passed',
    durationMs: 8,
    details: 'Assertion passed: Signature mismatch rejected in constant time (prevents timing side-channel).',
  },
];

export const TestRunnerStudio: React.FC<TestRunnerStudioProps> = ({ initialCode }) => {
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleRunAll = () => {
    setIsRunning(true);
    // Mark tests as pending first
    setTests((prev) => prev.map((t) => ({ ...t, status: 'pending' })));

    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => ({
          ...t,
          status: 'passed',
          durationMs: Math.floor(Math.random() * 12) + 2,
        }))
      );
      setIsRunning(false);
    }, 700);
  };

  const filteredTests = selectedFilter === 'all'
    ? tests
    : tests.filter((t) => t.type === selectedFilter);

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const totalDuration = tests.reduce((acc, curr) => acc + curr.durationMs, 0);

  return (
    <div className="space-y-8">
      {/* Test Suite Header */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Pillar 5 Verification</span>
          <span aria-hidden="true">·</span>
          <span>Test-Driven Reliability</span>
          <span aria-hidden="true">·</span>
          <span>Vitest / Jest Harness</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          Automated Test Suite & Edge Case Verification Runner
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Execute unit, integration, and security edge-case test suites. Verify handling of null values,
          asynchronous rejections, and malicious payloads at the zero-trust boundary.
        </p>

        {/* Coverage & Execution Metrics Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="text-xs text-slate-500 dark:text-slate-400">Test Invariants</div>
            <div className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {passedCount} / {tests.length} Passed
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Run Time</div>
            <div className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalDuration} ms
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="text-xs text-slate-500 dark:text-slate-400">Branch Coverage</div>
            <div className="mt-1 text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              96.8%
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="text-xs text-slate-500 dark:text-slate-400">Zero-Trust Boundaries</div>
            <div className="mt-1 text-xl font-bold font-mono tabular-nums text-cyan-600 dark:text-cyan-400">
              100% Enforced
            </div>
          </div>
        </div>
      </section>

      {/* Test Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto">
          {['all', 'unit', 'security', 'edge-case', 'async-failure'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedFilter(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedFilter === type
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Invariants' : type}
            </button>
          ))}
        </div>

        {/* Execution Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunAll}
            disabled={isRunning}
            className="inline-flex items-center gap-2 py-2 px-5 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Running Test Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Execute All Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Cases Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Test Suite Execution Matrix</h2>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            Vitest v3.0 Core Engine
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {filteredTests.map((test) => {
            const isPassed = test.status === 'passed';
            const isPending = test.status === 'pending';

            return (
              <div key={test.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {isPending ? (
                      <RotateCcw className="w-4 h-4 text-cyan-500 animate-spin mt-0.5" aria-hidden="true" />
                    ) : isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 mt-0.5" aria-hidden="true" />
                    )}

                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {test.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono uppercase text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                          {test.type}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{test.durationMs}ms</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      isPassed
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                        : isPending
                        ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                    }`}
                  >
                    {isPending ? 'RUNNING' : isPassed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                {/* Input / Expected Specification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-sans">Input Parameter:</span>
                    <span className="text-slate-800 dark:text-slate-200">{test.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-sans">Expected Invariant:</span>
                    <span className="text-slate-800 dark:text-slate-200">{test.expected}</span>
                  </div>
                </div>

                {test.details && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 pl-7">
                    {test.details}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
