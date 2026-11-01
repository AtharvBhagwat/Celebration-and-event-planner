import React from 'react';
import { ActiveTab } from '../types/nexus';
import { Moon, Sun, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenEthicalSandbox: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onOpenEthicalSandbox,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          type="button"
          onClick={() => onTabChange('architect')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 text-left hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
        >
          Nexus Architecture Studio
        </button>

        {/* Zone 2: Clean 5-Link Navigation (Single-Line, Text with Underline/Color Transition) */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={() => onTabChange('architect')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'architect'
                ? 'border-cyan-600 dark:border-cyan-400 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Architect
          </button>
          <button
            type="button"
            onClick={() => onTabChange('audit')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'audit'
                ? 'border-cyan-600 dark:border-cyan-400 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            6-Pillar Audit
          </button>
          <button
            type="button"
            onClick={() => onTabChange('blueprints')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'blueprints'
                ? 'border-cyan-600 dark:border-cyan-400 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Blueprints
          </button>
          <button
            type="button"
            onClick={() => onTabChange('test-runner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'test-runner'
                ? 'border-cyan-600 dark:border-cyan-400 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Test Runner
          </button>
          <button
            type="button"
            onClick={() => onTabChange('accessibility')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'accessibility'
                ? 'border-cyan-600 dark:border-cyan-400 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            WCAG Validator
          </button>
        </nav>

        {/* Zone 3: Actions - Guardrail Protocol, Theme Toggle, Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenEthicalSandbox}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Inspect Zero-Trust Guardrails & Security Overrides"
            aria-label="Inspect Zero-Trust Guardrails"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Guardrail Protocol</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('architect')}
            className="py-2 px-4 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            Consult Nexus
          </button>
        </div>
      </div>
    </header>
  );
};
