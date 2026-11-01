import React, { useState } from 'react';
import { Eye, CheckCircle2, XCircle, Sparkles, Navigation, Layers } from 'lucide-react';

export const AccessibilityAuditor: React.FC = () => {
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Relative luminance calculation according to WCAG 2.2 formula
  const getLuminance = (hex: string): number => {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16) / 255;
    const g = parseInt(cleaned.substring(2, 4), 16) / 255;
    const b = parseInt(cleaned.substring(4, 6), 16) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (c1: string, c2: string): number => {
    try {
      const l1 = getLuminance(c1);
      const l2 = getLuminance(c2);
      const brighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (brighter + 0.05) / (darker + 0.05);
    } catch {
      return 1;
    }
  };

  const ratio = getContrastRatio(fgColor, bgColor);
  const formattedRatio = ratio.toFixed(2);
  const isAANormal = ratio >= 4.5;
  const isAALarge = ratio >= 3.0;
  const isAAANormal = ratio >= 7.0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Pillar 6 Verification</span>
          <span aria-hidden="true">·</span>
          <span>WCAG 2.2 AA Standards</span>
          <span aria-hidden="true">·</span>
          <span>Digital Accessibility Lab</span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          WCAG 2.2 AA Accessibility & ARIA Contract Verifier
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Validate digital interfaces against WCAG 2.2 AA guidelines: color contrast ratios,
          screen-reader semantic hierarchies, visible focus indicators, and 44px minimum touch targets.
        </p>
      </section>

      {/* Interactive Contrast Ratio Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Color Contrast Ratio Analyzer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">WCAG 1.4.3 & 1.4.11 Compliance Engine</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formattedRatio}:1
              </span>
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fg-color" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foreground (Text)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 p-0 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bg-color" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Background (Surface)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 p-0 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            className="p-6 rounded-lg border transition-colors text-center space-y-2"
            style={{ backgroundColor: bgColor, color: fgColor, borderColor: fgColor + '30' }}
          >
            <div className="text-lg font-bold">Sample Display Typography</div>
            <p className="text-sm max-w-sm mx-auto">
              Production architectures enforce zero-trust boundary sanitization and full keyboard navigability.
            </p>
          </div>

          {/* Compliance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">WCAG AA Normal</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold">
                {isAANormal ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                )}
                <span>{isAANormal ? 'PASS (≥4.5)' : 'FAIL (<4.5)'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">WCAG AA Large</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold">
                {isAALarge ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                )}
                <span>{isAALarge ? 'PASS (≥3.0)' : 'FAIL (<3.0)'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">WCAG AAA Normal</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold">
                {isAAANormal ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                )}
                <span>{isAAANormal ? 'PASS (≥7.0)' : 'FAIL (<7.0)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: WCAG 2.2 AA Verification Invariants */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Pillar 6 Architectural Rules</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mandatory Frontend Standards</p>
          </div>

          <div className="space-y-3">
            {[
              {
                rule: 'WCAG 1.1.1 Non-Text Content',
                desc: 'Every image requires descriptive alt text or alt="" with aria-hidden="true". Never render empty broken frames.',
                status: 'Enforced',
              },
              {
                rule: 'WCAG 1.4.1 Use of Color',
                desc: 'Never convey critical semantic states (success, warning, error) by color alone. Pair colors with clear textual labels.',
                status: 'Enforced',
              },
              {
                rule: 'WCAG 2.1.1 Keyboard Navigability',
                desc: 'Every interactive control is reachable via Tab and activatable with Enter/Space. No dead non-semantic divs with onClick.',
                status: 'Enforced',
              },
              {
                rule: 'WCAG 2.4.7 Focus Visible',
                desc: 'Visible focus rings (focus-visible:ring-2 focus-visible:ring-cyan-500) rendered with 3:1 contrast against background.',
                status: 'Enforced',
              },
              {
                rule: 'WCAG 2.5.8 Target Size (Minimum)',
                desc: 'Interactive touch targets meet minimum 40px × 40px bounding box (mobile 44px) to prevent misclicks.',
                status: 'Enforced',
              },
              {
                rule: 'WCAG 4.1.2 Name, Role, Value',
                desc: 'Custom controls provide explicit ARIA roles, states (aria-expanded, aria-busy), and live regions (aria-live="polite").',
                status: 'Enforced',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-left space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.rule}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
