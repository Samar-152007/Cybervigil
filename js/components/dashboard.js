/**
 * ScamGuard Pro - Dashboard Screen Component
 * Features Security Health Gauge, Quick-Scan Bar, Dynamic Cyber Tips, and Launchpads
 */
import { i18n } from '../i18n/i18n.js';
import { ThreatLogManager } from '../storage/threatLog.js';
import { ThreatEngine } from '../heuristics/engine.js';

export class DashboardComponent {
  constructor(containerId, onScanComplete) {
    this.container = document.getElementById(containerId);
    this.onScanComplete = onScanComplete;
    this.currentTipIndex = 0;
    this.render();
    this.bindEvents();
    i18n.subscribe(() => this.updateContent());
    window.addEventListener('scamguard:logsUpdated', () => this.updateStats());
    window.addEventListener('scamguard:logAdded', () => this.updateStats());
  }

  render() {
    const stats = ThreatLogManager.getStats();
    const tips = i18n.getTips();
    const activeTip = tips[this.currentTipIndex] || tips[0];

    this.container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Hero Section with Quick-Scan Bar -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan/30 p-6 sm:p-8 lg:p-10 shadow-neon-glow">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
              <span>AI Heuristic Tri-Lingual Engine</span>
            </div>
            
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" data-i18n="dashboard.welcomeTitle">
              Real-Time AI Cybersecurity Defense
            </h1>
            
            <p class="text-base sm:text-lg text-cyber-muted" data-i18n="dashboard.welcomeSubtitle">
              Detect scams, phishing links, spoofed callers, and fraudulent documents before financial loss occurs.
            </p>

            <!-- Quick-Scan Bar -->
            <div class="pt-2">
              <form id="quick-scan-form" class="flex flex-col sm:flex-row items-stretch gap-3">
                <div class="relative flex-grow">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyber-cyan">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="quick-scan-input"
                    class="w-full pl-11 pr-4 py-3.5 bg-cyber-darker/90 border border-cyber-border rounded-xl text-white placeholder-cyber-muted/70 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan font-mono text-sm shadow-inner"
                    data-i18n-placeholder="dashboard.quickScanPlaceholder"
                    placeholder="Paste suspicious SMS, URL, phone number (+91...), or message here for instant AI triage..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  id="quick-scan-btn"
                  class="px-6 py-3.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-dark font-bold rounded-xl hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 text-sm sm:text-base font-mono whitespace-nowrap cursor-pointer"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span data-i18n="dashboard.quickScanBtn">Analyze Now</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- 2-Column Grid: Health Posture Meter & Cyber Hygiene Tips -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Security Posture Health Meter (5 Cols) -->
          <div class="lg:col-span-5 bg-cyber-card border border-cyber-border rounded-2xl p-6 flex flex-col justify-between shadow-hud relative overflow-hidden">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-bold text-white flex items-center space-x-2 font-mono">
                <svg class="w-5 h-5 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span data-i18n="dashboard.healthMeterTitle">Security Posture Index</span>
              </h2>
              <span id="health-status-badge" class="px-2.5 py-1 text-xs font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Optimal
              </span>
            </div>

            <!-- Radial Gauge SVG -->
            <div class="relative py-4 flex items-center justify-center">
              <div class="relative w-48 h-48 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <!-- Background Track -->
                  <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="8" class="text-cyber-border" fill="transparent" />
                  <!-- Progress Circle -->
                  <circle
                    id="health-meter-circle"
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#10B981"
                    stroke-width="8"
                    stroke-dasharray="264"
                    stroke-dashoffset="30"
                    stroke-linecap="round"
                    fill="transparent"
                    class="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div class="absolute flex flex-col items-center justify-center text-center">
                  <span id="health-score-val" class="text-4xl font-extrabold text-white font-mono tracking-tight">${stats.postureScore}%</span>
                  <span class="text-xs text-cyber-muted font-mono uppercase tracking-wider">DEFENSE SCORE</span>
                </div>
              </div>
            </div>

            <p class="text-xs text-cyber-muted text-center mt-2 font-mono" data-i18n="dashboard.healthMeterSub">
              Based on real-time heuristic scans &amp; active threat indicators
            </p>
          </div>

          <!-- Dynamic Cyber Hygiene Tips Feed (7 Cols) -->
          <div class="lg:col-span-7 bg-cyber-card border border-cyber-border rounded-2xl p-6 flex flex-col justify-between shadow-hud relative">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <span class="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  <h2 class="text-base font-bold text-white font-mono" data-i18n="dashboard.tipsTitle">
                    Cyber Hygiene &amp; Defense Tip of the Day
                  </h2>
                </div>
                <span id="tip-counter" class="text-xs font-mono text-cyber-muted">
                  ${this.currentTipIndex + 1} / ${tips.length}
                </span>
              </div>

              <!-- Tip Content Card -->
              <div id="tip-card" class="bg-cyber-dark/80 rounded-xl p-5 border border-cyber-border/70 my-3 min-h-[140px] flex flex-col justify-center">
                <h3 id="tip-title" class="text-base font-semibold text-cyber-cyan mb-2">
                  ${activeTip.title}
                </h3>
                <p id="tip-desc" class="text-sm text-cyber-muted leading-relaxed">
                  ${activeTip.text}
                </p>
              </div>
            </div>

            <!-- Tip Carousel Navigators -->
            <div class="flex items-center justify-between pt-2">
              <button id="tip-prev-btn" class="px-3.5 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border text-xs font-mono flex items-center space-x-1 transition-all">
                <span>&larr;</span>
                <span data-i18n="dashboard.tipPrev">Previous Tip</span>
              </button>
              <div class="flex space-x-1.5" id="tip-indicators">
                ${tips.map((_, i) => `
                  <span class="w-2 h-2 rounded-full ${i === this.currentTipIndex ? 'bg-cyber-cyan' : 'bg-cyber-border'} transition-all"></span>
                `).join('')}
              </div>
              <button id="tip-next-btn" class="px-3.5 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border text-xs font-mono flex items-center space-x-1 transition-all">
                <span data-i18n="dashboard.tipNext">Next Tip</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Metric Statistics Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center space-x-3.5">
            <div class="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold font-mono text-white" id="stat-scans">${stats.totalScans}</p>
              <p class="text-xs text-cyber-muted font-mono" data-i18n="dashboard.statsScans">Total Scans Run</p>
            </div>
          </div>

          <div class="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center space-x-3.5">
            <div class="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold font-mono text-red-400" id="stat-threats">${stats.highThreats}</p>
              <p class="text-xs text-cyber-muted font-mono" data-i18n="dashboard.statsThreats">Threats Neutralized</p>
            </div>
          </div>

          <div class="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center space-x-3.5">
            <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold font-mono text-emerald-400">1930</p>
              <p class="text-xs text-cyber-muted font-mono" data-i18n="dashboard.statsHelplines">Active National Helplines</p>
            </div>
          </div>

          <div class="bg-cyber-card border border-cyber-border rounded-xl p-4 flex items-center space-x-3.5">
            <div class="p-3 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold font-mono text-cyber-cyan">18ms</p>
              <p class="text-xs text-cyber-muted font-mono" data-i18n="dashboard.statsAvgSpeed">Avg Engine Latency</p>
            </div>
          </div>

        </div>

        <!-- Quick Launchers for the 4 Core Vector Scanners -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-white font-mono flex items-center space-x-2" data-i18n="dashboard.quickActionsTitle">
            <svg class="w-5 h-5 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Quick Launch Scanners</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Launch Text / SMS -->
            <div class="quick-launch-card group cursor-pointer bg-cyber-card hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-hud" data-vector="text">
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors" data-i18n="dashboard.launchText">
                SMS &amp; Text Analyzer
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed">
                Detects digital arrest, electricity threats, and fake bank alerts.
              </p>
            </div>

            <!-- Launch URL -->
            <div class="quick-launch-card group cursor-pointer bg-cyber-card hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-hud" data-vector="url">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors" data-i18n="dashboard.launchUrl">
                Phishing Link Checker
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed">
                Flags typosquatted banking domains, IP hosts, and shorteners.
              </p>
            </div>

            <!-- Launch Phone -->
            <div class="quick-launch-card group cursor-pointer bg-cyber-card hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-hud" data-vector="phone">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors" data-i18n="dashboard.launchPhone">
                Caller ID &amp; WhatsApp
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed">
                Analyzes +92, +234 prefixes, Wangiri traps, and TRAI standards.
              </p>
            </div>

            <!-- Launch OCR -->
            <div class="quick-launch-card group cursor-pointer bg-cyber-card hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-hud" data-vector="ocr">
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors" data-i18n="dashboard.launchOcr">
                Screenshot &amp; Document OCR
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed">
                Extracts and evaluates text from fake warrants, cheques, and chats.
              </p>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  bindEvents() {
    // Quick-scan form submit
    const form = this.container.querySelector('#quick-scan-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputEl = this.container.querySelector('#quick-scan-input');
        const query = inputEl ? inputEl.value.trim() : '';
        if (!query) return;

        const triage = ThreatEngine.quickTriage(query, i18n.getLanguage());
        const scanResult = await ThreatEngine.scan(triage.type, query, i18n.getLanguage());
        scanResult.rawInput = query;

        // Save to threat history
        ThreatLogManager.saveLog(scanResult);

        // Notify app to show results view
        if (this.onScanComplete) {
          this.onScanComplete(scanResult);
        }
      });
    }

    // Tip Carousel buttons
    const prevBtn = this.container.querySelector('#tip-prev-btn');
    const nextBtn = this.container.querySelector('#tip-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const tips = i18n.getTips();
        this.currentTipIndex = (this.currentTipIndex - 1 + tips.length) % tips.length;
        this.updateTipDisplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const tips = i18n.getTips();
        this.currentTipIndex = (this.currentTipIndex + 1) % tips.length;
        this.updateTipDisplay();
      });
    }

    // Quick launch cards click
    const cards = this.container.querySelectorAll('.quick-launch-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const vector = card.getAttribute('data-vector');
        window.dispatchEvent(new CustomEvent('scamguard:navigate', { detail: { tab: 'scanner', subTab: vector } }));
      });
    });
  }

  updateTipDisplay() {
    const tips = i18n.getTips();
    const activeTip = tips[this.currentTipIndex] || tips[0];

    const titleEl = this.container.querySelector('#tip-title');
    const descEl = this.container.querySelector('#tip-desc');
    const counterEl = this.container.querySelector('#tip-counter');
    const indicatorsEl = this.container.querySelector('#tip-indicators');

    if (titleEl) titleEl.textContent = activeTip.title;
    if (descEl) descEl.textContent = activeTip.text;
    if (counterEl) counterEl.textContent = `${this.currentTipIndex + 1} / ${tips.length}`;

    if (indicatorsEl) {
      indicatorsEl.innerHTML = tips.map((_, i) => `
        <span class="w-2 h-2 rounded-full ${i === this.currentTipIndex ? 'bg-cyber-cyan' : 'bg-cyber-border'} transition-all"></span>
      `).join('');
    }
  }

  updateContent() {
    this.updateTipDisplay();
    this.updateStats();
  }

  updateStats() {
    const stats = ThreatLogManager.getStats();

    const scanCountEl = this.container.querySelector('#stat-scans');
    const threatCountEl = this.container.querySelector('#stat-threats');
    const scoreValEl = this.container.querySelector('#health-score-val');
    const circleEl = this.container.querySelector('#health-meter-circle');
    const statusBadgeEl = this.container.querySelector('#health-status-badge');

    if (scanCountEl) scanCountEl.textContent = stats.totalScans;
    if (threatCountEl) threatCountEl.textContent = stats.highThreats;
    if (scoreValEl) scoreValEl.textContent = `${stats.postureScore}%`;

    if (circleEl) {
      // Circumference = 2 * pi * 42 ≈ 263.89
      const totalDash = 264;
      const offset = totalDash - (totalDash * stats.postureScore) / 100;
      circleEl.style.strokeDashoffset = offset;

      if (stats.postureScore >= 80) {
        circleEl.setAttribute('stroke', '#10B981'); // Emerald
        if (statusBadgeEl) {
          statusBadgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          statusBadgeEl.textContent = i18n.t('dashboard.healthStatusExcellent');
        }
      } else if (stats.postureScore >= 50) {
        circleEl.setAttribute('stroke', '#F59E0B'); // Amber
        if (statusBadgeEl) {
          statusBadgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40';
          statusBadgeEl.textContent = i18n.t('dashboard.healthStatusFair');
        }
      } else {
        circleEl.setAttribute('stroke', '#EF4444'); // Crimson
        if (statusBadgeEl) {
          statusBadgeEl.className = 'px-2.5 py-1 text-xs font-mono rounded-full bg-red-500/20 text-red-400 border border-red-500/40';
          statusBadgeEl.textContent = i18n.t('dashboard.healthStatusAtRisk');
        }
      }
    }
  }
}
