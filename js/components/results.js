/**
 * ScamGuard Pro - Threat Evaluation Results Component
 * Renders quantitative risk score (0-100%), color badges, forensic red flags, and mitigation checklist
 */
import { i18n } from '../i18n/i18n.js';

export class ResultsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentResult = null;
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    i18n.subscribe(() => {
      if (this.currentResult) {
        this.render(this.currentResult);
      }
    });
  }

  render(result) {
    this.currentResult = result;
    if (!result) return;

    const lang = i18n.getLanguage();
    const score = result.score || 0;
    const verdict = result.verdict || 'SAFE';

    let verdictBadgeText = i18n.t('results.riskSafe');
    let verdictClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-neon-emerald';
    let progressColor = '#10B981';

    if (verdict === 'HIGH') {
      verdictBadgeText = i18n.t('results.riskHigh');
      verdictClass = 'bg-red-500/15 text-red-400 border-red-500/40 shadow-neon-red';
      progressColor = '#EF4444';
    } else if (verdict === 'CAUTION') {
      verdictBadgeText = i18n.t('results.riskCaution');
      verdictClass = 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-neon-amber';
      progressColor = '#F59E0B';
    }

    const flags = result.redFlags || [];
    const mitigations = result.mitigations || [];
    const triggers = result.psychologicalTriggers || [];

    this.container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Top Back Bar -->
        <div class="flex items-center justify-between">
          <button id="btn-back-to-scanner" class="px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border font-mono text-xs flex items-center space-x-2 transition-all">
            <span>&larr;</span>
            <span>Back to Scanner</span>
          </button>
          <span class="text-xs font-mono text-cyber-muted">
            Evaluation ID: <span class="text-cyber-cyan">${Date.now().toString(36).toUpperCase()}</span>
          </span>
        </div>

        <!-- Main Verdict HUD Banner -->
        <div class="relative overflow-hidden bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-hud">
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <!-- Left Score Gauge (5 Cols) -->
            <div class="md:col-span-5 flex flex-col items-center justify-center text-center p-4 bg-cyber-dark/60 rounded-2xl border border-cyber-border/70">
              <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider mb-2" data-i18n="results.scamScoreLabel">
                Scam Probability Score
              </span>
              
              <!-- Circular Gauge -->
              <div class="relative w-40 h-40 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="#1e293b" stroke-width="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="${progressColor}"
                    stroke-width="8"
                    stroke-dasharray="264"
                    stroke-dashoffset="${264 - (264 * score) / 100}"
                    stroke-linecap="round"
                    fill="transparent"
                    class="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div class="absolute flex flex-col items-center justify-center">
                  <span class="text-4xl font-black font-mono" style="color: ${progressColor};">${score}%</span>
                  <span class="text-[10px] font-mono text-cyber-muted uppercase">RISK INDEX</span>
                </div>
              </div>

              <!-- Verdict Pill Badge -->
              <div class="mt-4 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold font-mono tracking-wider ${verdictClass}">
                ${verdictBadgeText}
              </div>
            </div>

            <!-- Right Summary & Typology (7 Cols) -->
            <div class="md:col-span-7 space-y-4">
              <div>
                <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider" data-i18n="results.categoryLabel">
                  Identified Fraud Typology:
                </span>
                <h3 class="text-xl sm:text-2xl font-bold text-white font-mono mt-1 capitalize flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${progressColor};"></span>
                  <span>${(result.category || 'General Communication').replace(/_/g, ' ')}</span>
                </h3>
              </div>

              <!-- Scanned Input Snippet -->
              <div class="bg-cyber-darker p-3.5 rounded-xl border border-cyber-border text-xs font-mono text-cyber-muted overflow-hidden text-ellipsis">
                <span class="text-cyber-cyan font-bold block mb-1">Evaluated Input [Vector: ${result.vector?.toUpperCase()}]:</span>
                <p class="text-slate-300 italic">"${(result.rawInput || '').substring(0, 180)}${(result.rawInput || '').length > 180 ? '...' : ''}"</p>
              </div>

              <!-- Psychological Triggers Badges -->
              ${triggers.length > 0 ? `
                <div>
                  <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider block mb-2" data-i18n="results.psychologicalTriggerLabel">
                    Psychological Coercion Vectors:
                  </span>
                  <div class="flex flex-wrap gap-2">
                    ${triggers.map(tr => `
                      <span class="px-2.5 py-1 text-xs font-mono rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 flex items-center space-x-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>${tr.replace(/_/g, ' ').toUpperCase()}</span>
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3 pt-2">
                <button id="btn-export-audit" class="px-4 py-2.5 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border rounded-xl font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer">
                  <svg class="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span data-i18n="results.exportReportBtn">Export Official Audit Report</span>
                </button>

                <button id="btn-copy-summary" class="px-4 py-2.5 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border rounded-xl font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span data-i18n="results.copySummaryBtn">Copy Incident Summary</span>
                </button>

                ${score >= 50 ? `
                  <button id="btn-report-incident" class="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-mono text-xs font-bold flex items-center space-x-2 transition-all shadow-neon-red cursor-pointer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span data-i18n="results.reportToGovBtn">Report to Cybercrime Portal (1930)</span>
                  </button>
                ` : ''}
              </div>

            </div>

          </div>

        </div>

        <!-- 2-Column: Red Flag Breakdown & Mitigation Steps -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Detailed Red Flags (7 Cols) -->
          <div class="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-4">
            <h3 class="text-base font-bold text-white font-mono flex items-center space-x-2" data-i18n="results.redFlagsTitle">
              <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span>Red Flag Forensic Breakdown</span>
              <span class="ml-2 px-2 py-0.5 rounded text-xs bg-cyber-dark font-mono text-cyber-muted">${flags.length}</span>
            </h3>

            ${flags.length === 0 ? `
              <div class="p-6 text-center text-sm font-mono text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                ✓ No active malicious signatures or coercive indicators found.
              </div>
            ` : `
              <div class="space-y-3">
                ${flags.map(f => {
                  let sevBg = 'bg-red-500/10 text-red-400 border-red-500/30';
                  if (f.severity === 'HIGH') sevBg = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
                  if (f.severity === 'MEDIUM') sevBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  if (f.severity === 'LOW' || f.severity === 'INFO') sevBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';

                  return `
                    <div class="p-4 rounded-xl bg-cyber-dark/80 border border-cyber-border/80 space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-bold text-white font-mono">${f.title}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${sevBg}">
                          ${f.severity || 'ALERT'}
                        </span>
                      </div>
                      <p class="text-xs text-cyber-muted leading-relaxed">${f.description}</p>
                      ${f.trigger ? `
                        <div class="text-[11px] font-mono text-cyber-cyan flex items-center space-x-1 pt-1">
                          <span>Trigger Vector:</span>
                          <span class="text-slate-300 font-semibold">${f.trigger}</span>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Actionable Mitigation Steps (5 Cols) -->
          <div class="lg:col-span-5 bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-4">
            <h3 class="text-base font-bold text-white font-mono flex items-center space-x-2" data-i18n="results.mitigationTitle">
              <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Immediate Action &amp; Recovery Checklist</span>
            </h3>

            <div class="space-y-3">
              ${mitigations.map((step, idx) => `
                <div class="flex items-start space-x-3 p-3.5 rounded-xl bg-cyber-dark/80 border border-cyber-border/80">
                  <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ${idx + 1}
                  </span>
                  <p class="text-xs text-cyber-muted leading-relaxed font-sans">
                    ${step}
                  </p>
                </div>
              `).join('')}
            </div>

            <!-- Emergency Helpline Banner -->
            <div class="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-white font-mono">National Cyber Helpline</p>
                <p class="text-[11px] text-cyber-muted">Dial 1930 within the Golden Hour</p>
              </div>
              <a href="tel:1930" class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono transition-all">
                Call 1930
              </a>
            </div>

          </div>

        </div>

      </div>
    `;

    this.bindResultEvents();
  }

  bindResultEvents() {
    // Back to scanner
    const backBtn = this.container.querySelector('#btn-back-to-scanner');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scamguard:navigate', { detail: { tab: 'scanner' } }));
      });
    }

    // Copy Summary
    const copyBtn = this.container.querySelector('#btn-copy-summary');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const summary = this.generateSummaryText();
        navigator.clipboard.writeText(summary).then(() => {
          this.showToast(i18n.t('results.copiedToast'));
        });
      });
    }

    // Export Official Audit Report
    const exportBtn = this.container.querySelector('#btn-export-audit');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportPrintableAudit();
      });
    }

    // Report to Incident Hub
    const reportBtn = this.container.querySelector('#btn-report-incident');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scamguard:navigate', { detail: { tab: 'incidentHub' } }));
      });
    }
  }

  generateSummaryText() {
    if (!this.currentResult) return '';
    const r = this.currentResult;
    return `[SCAMGUARD PRO AUDIT REPORT]
Timestamp: ${new Date().toLocaleString()}
Risk Score: ${r.score}% (${r.verdict})
Vector: ${r.vector?.toUpperCase()}
Fraud Category: ${(r.category || 'General').toUpperCase()}
Evaluated Input: "${r.rawInput || ''}"
Key Red Flags Detected (${(r.redFlags || []).length}):
${(r.redFlags || []).map((f, i) => `${i + 1}. [${f.severity}] ${f.title}: ${f.description}`).join('\n')}
Immediate Action Recommendations:
${(r.mitigations || []).map((m, i) => `${i + 1}. ${m}`).join('\n')}
---
Generated by ScamGuard Pro / CyberVigil AI (National Cyber Helpline: 1930)`;
  }

  exportPrintableAudit() {
    const summary = this.generateSummaryText();
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scamguard_audit_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showToast(message) {
    const existing = document.getElementById('scamguard-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'scamguard-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-white font-mono text-xs shadow-2xl flex items-center space-x-2 animate-bounce';
    toast.innerHTML = `
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast) toast.remove();
    }, 2800);
  }
}
