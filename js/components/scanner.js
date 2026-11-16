/**
 * ScamGuard Pro - Multi-Format Threat Scanner Component
 * Tabbed interface for Text/SMS, URL/Phishing, Phone/Caller ID, and Screenshot OCR
 */
import { i18n } from '../i18n/i18n.js';
import { ThreatEngine } from '../heuristics/engine.js';
import { ThreatLogManager } from '../storage/threatLog.js';
import { OCR_PRESETS } from '../heuristics/ocrSimulator.js';

export class ScannerComponent {
  constructor(containerId, onScanComplete) {
    this.container = document.getElementById(containerId);
    this.onScanComplete = onScanComplete;
    this.activeSubTab = 'text';
    this.selectedOcrFile = null;
    this.selectedOcrPreset = null;
    this.render();
    this.bindEvents();
    i18n.subscribe(() => this.updateTexts());

    window.addEventListener('scamguard:navigate', (e) => {
      if (e.detail && e.detail.tab === 'scanner') {
        if (e.detail.subTab) {
          this.switchSubTab(e.detail.subTab);
        }
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header & Instructions -->
        <div class="bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud">
          <div class="flex items-center space-x-3 mb-2">
            <span class="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <h2 class="text-2xl font-bold text-white font-mono" data-i18n="scanner.title">Multi-Format Threat Scanner</h2>
              <p class="text-sm text-cyber-muted" data-i18n="scanner.subtitle">
                Select the input format below. Our deep heuristic engine identifies psychological coercion, spoofing, and fraud footprints.
              </p>
            </div>
          </div>

          <!-- 4-Tab Navigation Strip -->
          <div class="flex flex-wrap gap-2 mt-6 border-b border-cyber-border/70 pb-3">
            <button class="scanner-subtab-btn active px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2" data-tab="text">
              <svg class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span data-i18n="scanner.tabText">Text / SMS Analyzer</span>
            </button>

            <button class="scanner-subtab-btn px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 text-cyber-muted hover:text-white" data-tab="url">
              <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span data-i18n="scanner.tabUrl">URL / Phishing Checker</span>
            </button>

            <button class="scanner-subtab-btn px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 text-cyber-muted hover:text-white" data-tab="phone">
              <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span data-i18n="scanner.tabPhone">Caller ID &amp; Phone</span>
            </button>

            <button class="scanner-subtab-btn px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 text-cyber-muted hover:text-white" data-tab="ocr">
              <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span data-i18n="scanner.tabOcr">Screenshot OCR Simulator</span>
            </button>
          </div>
        </div>

        <!-- TAB 1: TEXT / SMS ANALYZER -->
        <div id="subtab-panel-text" class="subtab-panel bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-5">
          <div>
            <label class="block text-sm font-bold text-white font-mono mb-2" data-i18n="scanner.textLabel">
              Suspicious Text / SMS / Chat Content
            </label>
            <textarea
              id="scanner-text-input"
              rows="6"
              class="w-full p-4 bg-cyber-darker border border-cyber-border rounded-xl text-white placeholder-cyber-muted/60 focus:outline-none focus:border-cyber-cyan font-mono text-sm leading-relaxed"
              data-i18n-placeholder="scanner.textPlaceholder"
              placeholder="e.g. 'Dear customer, your SBI YONO account will be blocked today at 9 PM. Update your PAN immediately at https://bit.ly/sbi-kyc-update or call 9876543210'..."
            ></textarea>
            <p class="text-xs text-cyber-muted mt-2 font-mono" data-i18n="scanner.textHelper">
              Scans for psychological triggers: false authority, extreme urgency, panic-inducing threats, KYC traps, and OTP phishing.
            </p>
          </div>

          <!-- Real Scam Presets -->
          <div class="space-y-2">
            <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider" data-i18n="scanner.loadSampleBtn">
              Load Real Scam Sample:
            </span>
            <div class="flex flex-wrap gap-2">
              <button class="preset-pill px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 text-xs text-cyber-muted hover:text-cyber-cyan font-mono transition-all" data-preset="electricity" data-i18n="scanner.sampleElectricity">
                Electricity Disconnection
              </button>
              <button class="preset-pill px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 text-xs text-cyber-muted hover:text-cyber-cyan font-mono transition-all" data-preset="digitalArrest" data-i18n="scanner.sampleDigitalArrest">
                Digital Arrest (Police/CBI)
              </button>
              <button class="preset-pill px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 text-xs text-cyber-muted hover:text-cyber-cyan font-mono transition-all" data-preset="kyc" data-i18n="scanner.sampleKyc">
                Bank KYC Expiry Trap
              </button>
              <button class="preset-pill px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 text-xs text-cyber-muted hover:text-cyber-cyan font-mono transition-all" data-preset="job" data-i18n="scanner.sampleJob">
                Telegram Part-time Work
              </button>
              <button class="preset-pill px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-cyber-cyan/50 text-xs text-cyber-muted hover:text-cyber-cyan font-mono transition-all" data-preset="lottery" data-i18n="scanner.sampleLottery">
                KBC 25 Lakh Lottery
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3 pt-3 border-t border-cyber-border/60">
            <button id="btn-analyze-text" class="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-dark font-bold rounded-xl hover:shadow-neon-cyan transition-all font-mono text-sm flex items-center space-x-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span data-i18n="scanner.analyzeBtn">Run Deep AI Threat Scan</span>
            </button>
            <button id="btn-clear-text" class="px-4 py-3 bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border rounded-xl font-mono text-sm transition-all cursor-pointer" data-i18n="scanner.clearBtn">
              Clear Input
            </button>
          </div>
        </div>

        <!-- TAB 2: URL / PHISHING CHECKER -->
        <div id="subtab-panel-url" class="subtab-panel hidden bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-5">
          <div>
            <label class="block text-sm font-bold text-white font-mono mb-2" data-i18n="scanner.urlLabel">
              Suspicious Website / Link / Domain
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="text"
                id="scanner-url-input"
                class="w-full pl-11 pr-4 py-3.5 bg-cyber-darker border border-cyber-border rounded-xl text-white placeholder-cyber-muted/60 focus:outline-none focus:border-purple-400 font-mono text-sm"
                data-i18n-placeholder="scanner.urlPlaceholder"
                placeholder="e.g. https://sbi-card-verify.net/login?token=urgent..."
              />
            </div>
            <p class="text-xs text-cyber-muted mt-2 font-mono" data-i18n="scanner.urlHelper">
              Evaluates typosquatting, brand spoofing, dangerous top-level domains (.xyz, .top), IP addresses, and credential harvesting forms.
            </p>
          </div>

          <!-- URL Presets -->
          <div class="space-y-2">
            <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider" data-i18n="scanner.loadSampleBtn">
              Load Real Scam Sample:
            </span>
            <div class="flex flex-wrap gap-2">
              <button class="preset-pill-url px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-purple-400 text-xs text-cyber-muted hover:text-purple-300 font-mono transition-all" data-val="http://sbi-card-verify.net/login?token=urgent-pan-update" data-i18n="scanner.sampleUrl1">
                Spoofed Bank Portal
              </button>
              <button class="preset-pill-url px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-purple-400 text-xs text-cyber-muted hover:text-purple-300 font-mono transition-all" data-val="http://bijli-bill-update.online/pay" data-i18n="scanner.sampleUrl2">
                Fake Electricity Bill Site
              </button>
              <button class="preset-pill-url px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-purple-400 text-xs text-cyber-muted hover:text-purple-300 font-mono transition-all" data-val="https://bit.ly/sbi-urgent-kyc-verify" data-i18n="scanner.sampleUrl3">
                Suspicious Shortened URL
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3 pt-3 border-t border-cyber-border/60">
            <button id="btn-analyze-url" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-neon-purple transition-all font-mono text-sm flex items-center space-x-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span data-i18n="scanner.analyzeBtn">Run Deep AI Threat Scan</span>
            </button>
            <button id="btn-clear-url" class="px-4 py-3 bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border rounded-xl font-mono text-sm transition-all cursor-pointer" data-i18n="scanner.clearBtn">
              Clear Input
            </button>
          </div>
        </div>

        <!-- TAB 3: PHONE & CALLER ID CHECKER -->
        <div id="subtab-panel-phone" class="subtab-panel hidden bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-5">
          <div>
            <label class="block text-sm font-bold text-white font-mono mb-2" data-i18n="scanner.phoneLabel">
              Caller ID, WhatsApp Number, or SMS Sender Header
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                type="text"
                id="scanner-phone-input"
                class="w-full pl-11 pr-4 py-3.5 bg-cyber-darker border border-cyber-border rounded-xl text-white placeholder-cyber-muted/60 focus:outline-none focus:border-emerald-400 font-mono text-sm"
                data-i18n-placeholder="scanner.phonePlaceholder"
                placeholder="e.g. +92 301 2345678, +1 800 555 0199, VM-SBIINB..."
              />
            </div>
            <p class="text-xs text-cyber-muted mt-2 font-mono" data-i18n="scanner.phoneHelper">
              Checks international high-risk country codes (+92, +234, +880), fake government spoofing, VoIP virtual ranges, and TRAI telecom guidelines.
            </p>
          </div>

          <!-- Phone Presets -->
          <div class="space-y-2">
            <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider" data-i18n="scanner.loadSampleBtn">
              Load Real Scam Sample:
            </span>
            <div class="flex flex-wrap gap-2">
              <button class="preset-pill-phone px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-emerald-400 text-xs text-cyber-muted hover:text-emerald-300 font-mono transition-all" data-val="+92 301 9876543" data-i18n="scanner.samplePhone1">
                International WhatsApp Scam (+92)
              </button>
              <button class="preset-pill-phone px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-emerald-400 text-xs text-cyber-muted hover:text-emerald-300 font-mono transition-all" data-val="+44 7911 123456" data-i18n="scanner.samplePhone2">
                Spoofed Police Caller (+44)
              </button>
              <button class="preset-pill-phone px-3 py-1.5 rounded-lg bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-emerald-400 text-xs text-cyber-muted hover:text-emerald-300 font-mono transition-all" data-val="+91 98765 43210" data-i18n="scanner.samplePhone3">
                Suspicious Indian Mobile (Unverified)
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3 pt-3 border-t border-cyber-border/60">
            <button id="btn-analyze-phone" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-neon-emerald transition-all font-mono text-sm flex items-center space-x-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span data-i18n="scanner.analyzeBtn">Run Deep AI Threat Scan</span>
            </button>
            <button id="btn-clear-phone" class="px-4 py-3 bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border rounded-xl font-mono text-sm transition-all cursor-pointer" data-i18n="scanner.clearBtn">
              Clear Input
            </button>
          </div>
        </div>

        <!-- TAB 4: SCREENSHOT / IMAGE OCR SIMULATOR -->
        <div id="subtab-panel-ocr" class="subtab-panel hidden bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-white font-mono mb-2" data-i18n="scanner.ocrLabel">
              Upload Screenshot or Fraudulent Document
            </label>
            
            <!-- Drag and Drop Zone -->
            <div id="ocr-dropzone" class="relative border-2 border-dashed border-cyber-border hover:border-amber-400/80 rounded-2xl p-6 sm:p-8 text-center bg-cyber-darker/60 hover:bg-cyber-darker transition-all cursor-pointer group">
              <input type="file" id="ocr-file-input" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              
              <div class="flex flex-col items-center justify-center space-y-3">
                <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors" data-i18n="scanner.ocrDropzoneText">
                    Drag &amp; drop screenshot here, or click to browse
                  </p>
                  <p class="text-xs text-cyber-muted mt-1 font-mono" data-i18n="scanner.ocrDropzoneSub">
                    Supports PNG, JPG, WEBP. Simulates high-precision OCR extraction &amp; NLP threat categorization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Preloaded Real Scam Documents Gallery -->
          <div class="space-y-3">
            <span class="text-xs font-mono text-cyber-muted uppercase tracking-wider" data-i18n="scanner.ocrSampleLabel">
              Or choose a real pre-loaded scam document:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              <div class="ocr-preset-card active cursor-pointer p-3 rounded-xl bg-cyber-dark hover:bg-cyber-darker border border-amber-500/50 hover:border-amber-400 transition-all text-left" data-preset="sample1">
                <div class="h-24 bg-cyber-darker rounded-lg overflow-hidden border border-cyber-border mb-2.5 flex items-center justify-center relative">
                  <img src="assets/sample_arrest_warrant.svg" alt="Fake CBI Warrant" class="w-full h-full object-cover opacity-80" />
                  <span class="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-500 text-white font-bold">WARRANT</span>
                </div>
                <h4 class="text-xs font-bold text-white line-clamp-1" data-i18n="scanner.ocrSample1">Fake CBI / Police Notice</h4>
                <p class="text-[11px] text-cyber-muted font-mono">Digital Arrest Scam</p>
              </div>

              <div class="ocr-preset-card cursor-pointer p-3 rounded-xl bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-amber-400 transition-all text-left" data-preset="sample2">
                <div class="h-24 bg-cyber-darker rounded-lg overflow-hidden border border-cyber-border mb-2.5 flex items-center justify-center relative">
                  <img src="assets/sample_electricity_sms.svg" alt="Electricity Notice" class="w-full h-full object-cover opacity-80" />
                  <span class="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-black font-bold">SMS</span>
                </div>
                <h4 class="text-xs font-bold text-white line-clamp-1" data-i18n="scanner.ocrSample2">Fake Electricity SMS</h4>
                <p class="text-[11px] text-cyber-muted font-mono">Power Cutoff Trap</p>
              </div>

              <div class="ocr-preset-card cursor-pointer p-3 rounded-xl bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-amber-400 transition-all text-left" data-preset="sample3">
                <div class="h-24 bg-cyber-darker rounded-lg overflow-hidden border border-cyber-border mb-2.5 flex items-center justify-center relative">
                  <img src="assets/sample_kbc_cheque.svg" alt="Lottery Cheque" class="w-full h-full object-cover opacity-80" />
                  <span class="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-black font-bold">CHEQUE</span>
                </div>
                <h4 class="text-xs font-bold text-white line-clamp-1" data-i18n="scanner.ocrSample3">KBC 25L Cheque</h4>
                <p class="text-[11px] text-cyber-muted font-mono">Advance Fee Trap</p>
              </div>

              <div class="ocr-preset-card cursor-pointer p-3 rounded-xl bg-cyber-dark hover:bg-cyber-darker border border-cyber-border hover:border-amber-400 transition-all text-left" data-preset="sample4">
                <div class="h-24 bg-cyber-darker rounded-lg overflow-hidden border border-cyber-border mb-2.5 flex items-center justify-center relative">
                  <img src="assets/sample_telegram_job.svg" alt="Telegram Job" class="w-full h-full object-cover opacity-80" />
                  <span class="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500 text-white font-bold">CHAT</span>
                </div>
                <h4 class="text-xs font-bold text-white line-clamp-1" data-i18n="scanner.ocrSample4">Telegram Crypto Task</h4>
                <p class="text-[11px] text-cyber-muted font-mono">Pig Butchering</p>
              </div>

            </div>
          </div>

          <!-- Document Extracted OCR Preview -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-white font-mono uppercase tracking-wider" data-i18n="scanner.extractedTextLabel">
                Extracted Document Text (OCR Preview):
              </label>
              <span id="ocr-status-badge" class="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ready for AI Forensic Scan
              </span>
            </div>
            <textarea
              id="ocr-text-preview"
              rows="6"
              class="w-full p-3.5 bg-cyber-darker border border-cyber-border rounded-xl text-white font-mono text-xs leading-relaxed"
            >${OCR_PRESETS.sample1.extractedText}</textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3 pt-3 border-t border-cyber-border/60">
            <button id="btn-analyze-ocr" class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-neon-amber transition-all font-mono text-sm flex items-center space-x-2 cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span data-i18n="scanner.analyzeBtn">Run Deep AI Threat Scan</span>
            </button>
            <button id="btn-clear-ocr" class="px-4 py-3 bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border rounded-xl font-mono text-sm transition-all cursor-pointer" data-i18n="scanner.clearBtn">
              Clear Input
            </button>
          </div>

        </div>

      </div>
    `;

    // Default select sample1
    this.selectedOcrPreset = 'sample1';
  }

  bindEvents() {
    // Subtab switching
    const subTabButtons = this.container.querySelectorAll('.scanner-subtab-btn');
    subTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchSubTab(tab);
      });
    });

    // Text Tab: Samples
    const textPresets = {
      electricity: `URGENT NOTICE: Electricity Board
Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the power station because your previous month's bill payment of ₹1,420 was not updated.
Immediately contact our Electricity Officer Mr. Rajesh Sharma at mobile number 98765-43210 or update bill: http://bijli-bill-update.online/pay`,
      digitalArrest: `CBI & Mumbai Police Special Crime Cell:
Docket No: CR-CBI/2026/8941. An illegal narcotics parcel containing MDMA and forged passports was seized under your Aadhaar number at Mumbai Airport.
You are placed under immediate DIGITAL ARREST by Supreme Court order. Connect Skype immediately (cbi.surveillance.cell@skype). Do not disconnect or inform anyone. Transfer ₹2,50,000 security collateral to RBI Verifying Account: 918273645109 IFSC: SBIN0001824.`,
      kyc: `Dear SBI Customer, your YONO NetBanking account has been SUSPENDED due to pending PAN & Aadhaar KYC compliance.
To unblock your account within 2 hours, click here immediately: https://bit.ly/sbi-urgent-kyc-verify or your account balance will be permanently frozen.`,
      job: `Work From Home Opportunity: Earn ₹3,000 - ₹5,000 daily by simply liking YouTube videos & reviewing Google Maps!
We have paid you ₹150 for your first trial task. Join VIP Telegram group for Level 2 crypto trading tasks: deposit ₹5,000 to get guaranteed ₹7,500 return in 15 minutes!`,
      lottery: `CONGRATULATIONS! Your mobile number won ₹25,00,000 in KBC All India SIM Card Lucky Draw 2026!
Lottery Cheque No: KBC-25L-8912. To claim your prize money, contact KBC Manager Amitabh Roy on WhatsApp: +92 301 9876543 and deposit ₹25,000 government tax fee.`
    };

    const textInput = this.container.querySelector('#scanner-text-input');
    const textPresetPills = this.container.querySelectorAll('.preset-pill');
    textPresetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const pKey = pill.getAttribute('data-preset');
        if (textPresets[pKey] && textInput) {
          textInput.value = textPresets[pKey];
          textInput.focus();
        }
      });
    });

    // Clear Text
    const clearTextBtn = this.container.querySelector('#btn-clear-text');
    if (clearTextBtn) {
      clearTextBtn.addEventListener('click', () => {
        if (textInput) textInput.value = '';
      });
    }

    // Analyze Text
    const analyzeTextBtn = this.container.querySelector('#btn-analyze-text');
    if (analyzeTextBtn) {
      analyzeTextBtn.addEventListener('click', async () => {
        const val = textInput ? textInput.value.trim() : '';
        if (!val) return;
        this.showScanningAnimation(analyzeTextBtn, async () => {
          const res = await ThreatEngine.scan('text', val, i18n.getLanguage());
          res.rawInput = val;
          ThreatLogManager.saveLog(res);
          if (this.onScanComplete) this.onScanComplete(res);
        });
      });
    }

    // URL Tab: Presets
    const urlInput = this.container.querySelector('#scanner-url-input');
    const urlPresetPills = this.container.querySelectorAll('.preset-pill-url');
    urlPresetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const pVal = pill.getAttribute('data-val');
        if (urlInput) {
          urlInput.value = pVal;
          urlInput.focus();
        }
      });
    });

    // Clear URL
    const clearUrlBtn = this.container.querySelector('#btn-clear-url');
    if (clearUrlBtn) {
      clearUrlBtn.addEventListener('click', () => {
        if (urlInput) urlInput.value = '';
      });
    }

    // Analyze URL
    const analyzeUrlBtn = this.container.querySelector('#btn-analyze-url');
    if (analyzeUrlBtn) {
      analyzeUrlBtn.addEventListener('click', async () => {
        const val = urlInput ? urlInput.value.trim() : '';
        if (!val) return;
        this.showScanningAnimation(analyzeUrlBtn, async () => {
          const res = await ThreatEngine.scan('url', val, i18n.getLanguage());
          res.rawInput = val;
          ThreatLogManager.saveLog(res);
          if (this.onScanComplete) this.onScanComplete(res);
        });
      });
    }

    // Phone Tab: Presets
    const phoneInput = this.container.querySelector('#scanner-phone-input');
    const phonePresetPills = this.container.querySelectorAll('.preset-pill-phone');
    phonePresetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const pVal = pill.getAttribute('data-val');
        if (phoneInput) {
          phoneInput.value = pVal;
          phoneInput.focus();
        }
      });
    });

    // Clear Phone
    const clearPhoneBtn = this.container.querySelector('#btn-clear-phone');
    if (clearPhoneBtn) {
      clearPhoneBtn.addEventListener('click', () => {
        if (phoneInput) phoneInput.value = '';
      });
    }

    // Analyze Phone
    const analyzePhoneBtn = this.container.querySelector('#btn-analyze-phone');
    if (analyzePhoneBtn) {
      analyzePhoneBtn.addEventListener('click', async () => {
        const val = phoneInput ? phoneInput.value.trim() : '';
        if (!val) return;
        this.showScanningAnimation(analyzePhoneBtn, async () => {
          const res = await ThreatEngine.scan('phone', val, i18n.getLanguage());
          res.rawInput = val;
          ThreatLogManager.saveLog(res);
          if (this.onScanComplete) this.onScanComplete(res);
        });
      });
    }

    // OCR Tab: Presets
    const ocrPreviewText = this.container.querySelector('#ocr-text-preview');
    const ocrPresetCards = this.container.querySelectorAll('.ocr-preset-card');
    ocrPresetCards.forEach(card => {
      card.addEventListener('click', () => {
        ocrPresetCards.forEach(c => c.classList.remove('active', 'border-amber-500/50', 'bg-cyber-darker'));
        card.classList.add('active', 'border-amber-500/50', 'bg-cyber-darker');

        const presetKey = card.getAttribute('data-preset');
        this.selectedOcrPreset = presetKey;
        this.selectedOcrFile = null;

        if (OCR_PRESETS[presetKey] && ocrPreviewText) {
          ocrPreviewText.value = OCR_PRESETS[presetKey].extractedText;
        }
      });
    });

    // File Upload handling for OCR
    const fileInput = this.container.querySelector('#ocr-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          this.selectedOcrFile = file;
          this.selectedOcrPreset = null;

          ocrPresetCards.forEach(c => c.classList.remove('active', 'border-amber-500/50'));

          const statusBadge = this.container.querySelector('#ocr-status-badge');
          if (statusBadge) {
            statusBadge.textContent = `File Loaded: ${file.name}`;
          }

          if (ocrPreviewText) {
            ocrPreviewText.value = `[ANALYZING IMAGE PIXELS: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\nOCR parsing extracted textual contents and visual forensic headers...`;
          }
        }
      });
    }

    // Clear OCR
    const clearOcrBtn = this.container.querySelector('#btn-clear-ocr');
    if (clearOcrBtn) {
      clearOcrBtn.addEventListener('click', () => {
        if (ocrPreviewText) ocrPreviewText.value = '';
        this.selectedOcrFile = null;
        this.selectedOcrPreset = null;
        ocrPresetCards.forEach(c => c.classList.remove('active', 'border-amber-500/50'));
      });
    }

    // Analyze OCR
    const analyzeOcrBtn = this.container.querySelector('#btn-analyze-ocr');
    if (analyzeOcrBtn) {
      analyzeOcrBtn.addEventListener('click', async () => {
        const textInBox = ocrPreviewText ? ocrPreviewText.value.trim() : '';
        if (!textInBox && !this.selectedOcrFile && !this.selectedOcrPreset) return;

        this.showScanningAnimation(analyzeOcrBtn, async () => {
          let payload = this.selectedOcrPreset || this.selectedOcrFile || textInBox;
          const res = await ThreatEngine.scan('ocr', payload, i18n.getLanguage());
          res.rawInput = textInBox.substring(0, 160) || 'Uploaded Document OCR';
          ThreatLogManager.saveLog(res);
          if (this.onScanComplete) this.onScanComplete(res);
        });
      });
    }
  }

  showScanningAnimation(buttonEl, onDone) {
    const originalText = buttonEl.innerHTML;
    buttonEl.disabled = true;
    buttonEl.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Scanning Vectors...</span>
    `;

    setTimeout(async () => {
      try {
        await onDone();
      } finally {
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalText;
      }
    }, 450);
  }

  switchSubTab(tab) {
    this.activeSubTab = tab;

    // Update buttons
    this.container.querySelectorAll('.scanner-subtab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active', 'bg-cyber-darker', 'border', 'border-cyber-cyan/40', 'text-white');
        btn.classList.remove('text-cyber-muted');
      } else {
        btn.classList.remove('active', 'bg-cyber-darker', 'border', 'border-cyber-cyan/40', 'text-white');
        btn.classList.add('text-cyber-muted');
      }
    });

    // Update panels
    this.container.querySelectorAll('.subtab-panel').forEach(panel => {
      if (panel.id === `subtab-panel-${tab}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  }

  updateTexts() {
    // Re-trigger static translations on this container
    i18n.updateDom();
  }
}
