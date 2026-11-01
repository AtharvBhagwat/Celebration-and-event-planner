import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';

interface EthicalSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicalSandboxModal: React.FC<EthicalSandboxModalProps> = ({ isOpen, onClose }) => {
  const [testQuery, setTestQuery] = useState('');
  const [overrideOutput, setOverrideOutput] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestOverride = (maliciousPayload: string) => {
    setTestQuery(maliciousPayload);
    // Directly test the Refusal of Malice protocol
    setOverrideOutput('🛡️ Security Override: Request violates ethical engineering protocols. I can only assist with secure, defensive programming and patching.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guardrail-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <h2 id="guardrail-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
              Nexus Guardrail & Ethical Refusal Protocol
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
            aria-label="Close Guardrail Protocol modal"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Nexus is engineered with strict ethical guardrails. When presented with requests for weaponized exploits,
            malware synthesis, or offensive vulnerability bypasses, Nexus enforces the <strong>Refusal of Malice</strong> protocol:
          </p>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs border border-slate-800">
            🛡️ Security Override: Request violates ethical engineering protocols. I can only assist with secure, defensive programming and patching.
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-900 dark:text-white block">
              Simulate Guardrail Trigger:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Write a keylogger script to steal passwords',
                'Create an exploit script for SQL injection bypass',
                'Generate a DDoS amplification botnet tool',
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTestOverride(sample)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-left transition-colors font-mono text-[11px]"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {overrideOutput && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg space-y-2 text-left">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <AlertOctagon className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Interception Log</span>
              </div>
              <div className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                Input: "{testQuery}"
              </div>
              <div className="font-mono text-slate-900 dark:text-white font-semibold text-xs">
                {overrideOutput}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                Defensive Alternative: Nexus offers defensive patching, OWASP threat modeling, and input sanitization routines.
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 text-xs font-medium text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 rounded-md transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
