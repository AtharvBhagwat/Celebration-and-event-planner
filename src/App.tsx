/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types/nexus';
import { Header } from './components/Header';
import { ArchitectStudio } from './components/ArchitectStudio';
import { AuditWorkbench } from './components/AuditWorkbench';
import { SystemBlueprintsView } from './components/SystemBlueprintsView';
import { TestRunnerStudio } from './components/TestRunnerStudio';
import { AccessibilityAuditor } from './components/AccessibilityAuditor';
import { EthicalSandboxModal } from './components/EthicalSandboxModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('architect');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [auditBuffer, setAuditBuffer] = useState<string>('');
  const [testBuffer, setTestBuffer] = useState<string>('');
  const [isEthicalModalOpen, setIsEthicalModalOpen] = useState<boolean>(false);

  // Sync dark theme class on document.documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSendToAudit = (code: string) => {
    setAuditBuffer(code);
    setActiveTab('audit');
  };

  const handleSendToTestRunner = (code: string) => {
    setTestBuffer(code);
    setActiveTab('test-runner');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenEthicalSandbox={() => setIsEthicalModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'architect' && (
          <ArchitectStudio
            onSendToAudit={handleSendToAudit}
            onSendToTestRunner={handleSendToTestRunner}
          />
        )}

        {activeTab === 'audit' && (
          <AuditWorkbench
            initialCode={auditBuffer}
            onSendToTestRunner={handleSendToTestRunner}
          />
        )}

        {activeTab === 'blueprints' && (
          <SystemBlueprintsView
            onSendToAudit={handleSendToAudit}
            onSendToTestRunner={handleSendToTestRunner}
          />
        )}

        {activeTab === 'test-runner' && (
          <TestRunnerStudio initialCode={testBuffer} />
        )}

        {activeTab === 'accessibility' && (
          <AccessibilityAuditor />
        )}
      </main>

      {/* Clean, Non-slop Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Nexus Studio</span>
            <span aria-hidden="true">·</span>
            <span>Architectural Engineering & GenAI Production Protocols</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>1. Alignment</span>
            <span aria-hidden="true">·</span>
            <span>2. SOLID</span>
            <span aria-hidden="true">·</span>
            <span>3. Zero-Trust</span>
            <span aria-hidden="true">·</span>
            <span>4. Big-O</span>
            <span aria-hidden="true">·</span>
            <span>5. Testing</span>
            <span aria-hidden="true">·</span>
            <span>6. WCAG 2.2 AA</span>
          </div>
        </div>
      </footer>

      {/* Zero-Trust Ethical Refusal Modal */}
      <EthicalSandboxModal
        isOpen={isEthicalModalOpen}
        onClose={() => setIsEthicalModalOpen(false)}
      />
    </div>
  );
}
