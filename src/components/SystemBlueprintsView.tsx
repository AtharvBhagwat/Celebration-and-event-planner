import React, { useState } from 'react';
import { SYSTEM_BLUEPRINTS } from '../data/blueprints';
import { SystemBlueprint } from '../types/nexus';
import { Layers, ShieldCheck, Zap, Code, TestTube, CheckCircle2, ArrowRight } from 'lucide-react';

interface SystemBlueprintsViewProps {
  onSendToAudit: (code: string) => void;
  onSendToTestRunner: (code: string) => void;
}

export const SystemBlueprintsView: React.FC<SystemBlueprintsViewProps> = ({
  onSendToAudit,
  onSendToTestRunner,
}) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<SystemBlueprint>(SYSTEM_BLUEPRINTS[0]);
  const [filter, setFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'code' | 'tests' | 'threat-model'>('architecture');

  const filteredBlueprints = filter === 'all'
    ? SYSTEM_BLUEPRINTS
    : SYSTEM_BLUEPRINTS.filter((b) => b.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Blueprint Visual Hero Banner with Generated Asset */}
      <section className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4 z-10">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
              <span>Production Architecture Library</span>
              <span aria-hidden="true">·</span>
              <span>Battle-Tested Invariants</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Zero-Trust Distributed Systems & GenAI Topologies
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Inspect fully specified, production-grade architectures designed to withstand extreme load,
              network partitions, adversarial inputs, and regulatory zero-trust audits.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>5 Verified Topologies</span>
              <span aria-hidden="true">·</span>
              <span>C4 Topology Specs</span>
              <span aria-hidden="true">·</span>
              <span>Big-O Bounds Verified</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-slate-900 overflow-hidden">
            <img
              src="/src/assets/images/nexus_system_hero_1793563654300.jpg"
              alt="Nexus Distributed Cloud Architecture Technical Blueprint showing microservices, API gateway, event bus, and database nodes"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              onError={(e) => {
                // Styled fallback container on image load issue
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs using interactive button controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit max-w-full overflow-x-auto">
        {['all', 'GenAI', 'Microservices', 'Edge', 'Real-Time'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Topologies' : cat}
          </button>
        ))}
      </div>

      {/* Blueprint Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Blueprint Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Select Architecture:
          </span>
          {filteredBlueprints.map((bp) => {
            const isSelected = selectedBlueprint.id === bp.id;
            return (
              <button
                key={bp.id}
                type="button"
                onClick={() => setSelectedBlueprint(bp)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-cyan-500 shadow-sm ring-1 ring-cyan-500/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  {bp.category}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {bp.title}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {bp.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Blueprint Deep-Dive View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                {selectedBlueprint.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedBlueprint.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSendToAudit(selectedBlueprint.codeSnippet)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <span>Audit Code</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onSendToTestRunner(selectedBlueprint.codeSnippet)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <span>Verify Tests</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveSubTab('architecture')}
              className={`py-1 px-2.5 rounded ${
                activeSubTab === 'architecture'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              C4 Topology Nodes
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('code')}
              className={`py-1 px-2.5 rounded ${
                activeSubTab === 'code'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Production Code
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('tests')}
              className={`py-1 px-2.5 rounded ${
                activeSubTab === 'tests'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Vitest Suite
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('threat-model')}
              className={`py-1 px-2.5 rounded ${
                activeSubTab === 'threat-model'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Zero-Trust & Big-O
            </button>
          </div>

          {/* Tab 1: C4 Topology Nodes */}
          {activeSubTab === 'architecture' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBlueprint.description}
              </p>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Architectural Component Topology:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedBlueprint.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {node.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {node.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                        {node.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Production Code */}
          {activeSubTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Language: {selectedBlueprint.language}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(selectedBlueprint.codeSnippet)}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Copy Code
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {selectedBlueprint.codeSnippet}
              </pre>
            </div>
          )}

          {/* Tab 3: Test Suite */}
          {activeSubTab === 'tests' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Framework: Vitest / Jest</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(selectedBlueprint.testSuite)}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  Copy Tests
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {selectedBlueprint.testSuite}
              </pre>
            </div>
          )}

          {/* Tab 4: Threat Model & Big-O */}
          {activeSubTab === 'threat-model' && (
            <div className="space-y-6">
              {/* Big-O Complexity */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <span>Computational Complexity (Big-O Bounds)</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono space-y-1">
                  <div>Time: {selectedBlueprint.complexity.time}</div>
                  <div>Space: {selectedBlueprint.complexity.space}</div>
                </div>
              </div>

              {/* OWASP Mitigations */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                  <span>OWASP Threat Mitigation Checklist</span>
                </div>
                <ul className="space-y-2">
                  {selectedBlueprint.owaspMitigations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WCAG Compliance */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Accessibility & Telemetry Contracts (WCAG 2.2 AA)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedBlueprint.wcagNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
