/**
 * ScamGuard Pro - Incident Response & Helpline Hub Component
 * One-tap official helplines and interactive Golden Hour emergency protocol checklist
 */
import { i18n } from '../i18n/i18n.js';

const CHECKLIST_KEY = 'scamguard_emergency_checklist_state';

export class IncidentHubComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.checklistState = this.loadChecklistState();
    this.render();
    this.bindEvents();
    i18n.subscribe(() => this.render());
  }

  loadChecklistState() {
    try {
      const data = localStorage.getItem(CHECKLIST_KEY);
      return data ? JSON.parse(data) : { step1: false, step2: false, step3: false, step4: false, step5: false };
    } catch (e) {
      return { step1: false, step2: false, step3: false, step4: false, step5: false };
    }
  }

  saveChecklistState() {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(this.checklistState));
    } catch (e) {}
  }

  render() {
    this.container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Hub Header -->
        <div class="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-hud relative overflow-hidden">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex items-center space-x-3 mb-2">
            <span class="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div>
              <h2 class="text-2xl sm:text-3xl font-bold text-white font-mono" data-i18n="incidentHub.title">
                National Incident Response &amp; Helpline Hub
              </h2>
              <p class="text-sm text-cyber-muted" data-i18n="incidentHub.subtitle">
                Immediate recourse and emergency protocols under Indian Cybersecurity &amp; IT Act provisions.
              </p>
            </div>
          </div>

          <!-- Golden Hour Notice Banner -->
          <div class="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center space-x-3">
              <span class="flex h-3 w-3 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <p class="text-sm font-bold text-red-400 font-mono">CRITICAL: THE GOLDEN HOUR PRINCIPLE</p>
                <p class="text-xs text-cyber-muted">Dial 1930 within 2 hours of unauthorized financial debit to prevent inter-bank mule transfers.</p>
              </div>
            </div>
            <a href="tel:1930" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-bold flex items-center space-x-2 shadow-neon-red transition-all whitespace-nowrap">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Dial 1930 Now</span>
            </a>
          </div>
        </div>

        <!-- 4 Official Government Portals Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Card 1: 1930 -->
          <div class="bg-cyber-card border border-cyber-border rounded-2xl p-5 flex flex-col justify-between shadow-hud hover:border-red-500/50 transition-all">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center font-mono font-bold">
                1930
              </div>
              <h3 class="text-base font-bold text-white font-mono" data-i18n="incidentHub.helpline1930Title">
                National Cyber Helpline 1930
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed" data-i18n="incidentHub.helpline1930Desc">
                Call immediately within the 'Golden Hour' (first 2 hours of transaction) to freeze money in transit across bank accounts.
              </p>
            </div>
            <a href="tel:1930" class="mt-4 w-full py-2.5 px-3 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border hover:border-red-500 rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-all">
              <span data-i18n="incidentHub.helpline1930Action">Dial 1930 (Toll-Free)</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Card 2: cybercrime.gov.in -->
          <div class="bg-cyber-card border border-cyber-border rounded-2xl p-5 flex flex-col justify-between shadow-hud hover:border-cyber-cyan/50 transition-all">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white font-mono" data-i18n="incidentHub.portalTitle">
                Cybercrime Portal (MHA)
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed" data-i18n="incidentHub.portalDesc">
                Official Ministry of Home Affairs (MHA) portal to lodge formal FIRs for financial fraud, cyber stalking, and online scams.
              </p>
            </div>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" class="mt-4 w-full py-2.5 px-3 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border hover:border-cyber-cyan rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-all">
              <span data-i18n="incidentHub.portalAction">Open cybercrime.gov.in</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Card 3: Chakshu Portal -->
          <div class="bg-cyber-card border border-cyber-border rounded-2xl p-5 flex flex-col justify-between shadow-hud hover:border-emerald-500/50 transition-all">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white font-mono" data-i18n="incidentHub.chakshuTitle">
                Chakshu Portal (DoT)
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed" data-i18n="incidentHub.chakshuDesc">
                Department of Telecommunications (DoT) facility to report fraudulent calls, SMS, and WhatsApp communications for SIM blocking.
              </p>
            </div>
            <a href="https://sancharsaathi.gov.in" target="_blank" rel="noopener noreferrer" class="mt-4 w-full py-2.5 px-3 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border hover:border-emerald-500 rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-all">
              <span data-i18n="incidentHub.chakshuAction">Open Chakshu Portal</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Card 4: RBI Sachet -->
          <div class="bg-cyber-card border border-cyber-border rounded-2xl p-5 flex flex-col justify-between shadow-hud hover:border-amber-500/50 transition-all">
            <div class="space-y-2">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-white font-mono" data-i18n="incidentHub.rbiTitle">
                RBI Sachet Portal
              </h3>
              <p class="text-xs text-cyber-muted leading-relaxed" data-i18n="incidentHub.rbiDesc">
                Report unauthorized digital lending apps, fake loan recovery agents, and unregistered non-banking financial entities.
              </p>
            </div>
            <a href="https://sachet.rbi.org.in" target="_blank" rel="noopener noreferrer" class="mt-4 w-full py-2.5 px-3 bg-cyber-dark hover:bg-cyber-darker text-white border border-cyber-border hover:border-amber-500 rounded-xl font-mono text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-all">
              <span data-i18n="incidentHub.rbiAction">Visit RBI Sachet</span>
              <span>&rarr;</span>
            </a>
          </div>

        </div>

        <!-- Interactive Emergency Golden-Hour Protocol Checklist -->
        <div class="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-8 shadow-hud space-y-5">
          <div class="flex items-center justify-between border-b border-cyber-border/80 pb-4">
            <h3 class="text-lg font-bold text-white font-mono flex items-center space-x-2" data-i18n="incidentHub.emergencyStepsTitle">
              <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Interactive Emergency Golden-Hour Protocol</span>
            </h3>
            <span id="checklist-progress" class="text-xs font-mono text-cyber-cyan font-bold">
              ${this.getCompletedCount()} / 5 Completed
            </span>
          </div>

          <!-- Step 1 -->
          <div class="checklist-item flex items-start space-x-3.5 p-4 rounded-xl bg-cyber-dark/80 border ${this.checklistState.step1 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-cyber-border'} transition-all cursor-pointer" data-step="step1">
            <input type="checkbox" id="check-step1" class="mt-1 h-5 w-5 rounded bg-cyber-darker border-cyber-border text-emerald-500 focus:ring-emerald-500 cursor-pointer" ${this.checklistState.step1 ? 'checked' : ''} />
            <div class="flex-grow">
              <p class="text-sm font-semibold text-white font-mono" data-i18n="incidentHub.step1">
                1. Freeze Bank Accounts &amp; UPI: Call your bank's 24/7 emergency toll-free number to freeze affected accounts and block debit/credit cards.
              </p>
              <p class="text-xs text-cyber-muted mt-1 font-sans">
                Prevents subsequent fraudulent debit charges or linked overdraft drawdowns.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="checklist-item flex items-start space-x-3.5 p-4 rounded-xl bg-cyber-dark/80 border ${this.checklistState.step2 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-cyber-border'} transition-all cursor-pointer" data-step="step2">
            <input type="checkbox" id="check-step2" class="mt-1 h-5 w-5 rounded bg-cyber-darker border-cyber-border text-emerald-500 focus:ring-emerald-500 cursor-pointer" ${this.checklistState.step2 ? 'checked' : ''} />
            <div class="flex-grow">
              <p class="text-sm font-semibold text-white font-mono" data-i18n="incidentHub.step2">
                2. Dial 1930 Immediately: Report transaction details, Bank UTR number, beneficiary account, and transaction time to freeze funds.
              </p>
              <p class="text-xs text-cyber-muted mt-1 font-sans">
                Law enforcement triggers immediate lien holds on the destination mule bank accounts.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="checklist-item flex items-start space-x-3.5 p-4 rounded-xl bg-cyber-dark/80 border ${this.checklistState.step3 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-cyber-border'} transition-all cursor-pointer" data-step="step3">
            <input type="checkbox" id="check-step3" class="mt-1 h-5 w-5 rounded bg-cyber-darker border-cyber-border text-emerald-500 focus:ring-emerald-500 cursor-pointer" ${this.checklistState.step3 ? 'checked' : ''} />
            <div class="flex-grow">
              <p class="text-sm font-semibold text-white font-mono" data-i18n="incidentHub.step3">
                3. Preserve Evidence: Take uncropped screenshots of SMS, chat transcripts, payment slips, caller IDs, and URL links.
              </p>
              <p class="text-xs text-cyber-muted mt-1 font-sans">
                Keep the original timestamps, sender headers, and bank transaction SMS intact for court admissibility.
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="checklist-item flex items-start space-x-3.5 p-4 rounded-xl bg-cyber-dark/80 border ${this.checklistState.step4 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-cyber-border'} transition-all cursor-pointer" data-step="step4">
            <input type="checkbox" id="check-step4" class="mt-1 h-5 w-5 rounded bg-cyber-darker border-cyber-border text-emerald-500 focus:ring-emerald-500 cursor-pointer" ${this.checklistState.step4 ? 'checked' : ''} />
            <div class="flex-grow">
              <p class="text-sm font-semibold text-white font-mono" data-i18n="incidentHub.step4">
                4. Disconnect &amp; Uninstall Remote Tools: If AnyDesk, TeamViewer, or RustDesk was installed, disconnect Wi-Fi and uninstall immediately.
              </p>
              <p class="text-xs text-cyber-muted mt-1 font-sans">
                Turn on Airplane Mode immediately to terminate remote screen mirroring sessions.
              </p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="checklist-item flex items-start space-x-3.5 p-4 rounded-xl bg-cyber-dark/80 border ${this.checklistState.step5 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-cyber-border'} transition-all cursor-pointer" data-step="step5">
            <input type="checkbox" id="check-step5" class="mt-1 h-5 w-5 rounded bg-cyber-darker border-cyber-border text-emerald-500 focus:ring-emerald-500 cursor-pointer" ${this.checklistState.step5 ? 'checked' : ''} />
            <div class="flex-grow">
              <p class="text-sm font-semibold text-white font-mono" data-i18n="incidentHub.step5">
                5. File Formal Complaint: Register cyber FIR on cybercrime.gov.in and obtain an acknowledgement number for bank dispute resolution.
              </p>
              <p class="text-xs text-cyber-muted mt-1 font-sans">
                This acknowledgement number is required by banks under RBI's Limited Customer Liability Circular.
              </p>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  getCompletedCount() {
    return Object.values(this.checklistState).filter(Boolean).length;
  }

  bindEvents() {
    const items = this.container.querySelectorAll('.checklist-item');
    items.forEach(item => {
      const stepKey = item.getAttribute('data-step');
      const checkbox = item.querySelector('input[type="checkbox"]');

      item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          if (checkbox) checkbox.checked = !checkbox.checked;
        }
        this.checklistState[stepKey] = checkbox ? checkbox.checked : false;
        this.saveChecklistState();

        // Update styling
        if (this.checklistState[stepKey]) {
          item.classList.add('border-emerald-500/50', 'bg-emerald-500/5');
          item.classList.remove('border-cyber-border');
        } else {
          item.classList.remove('border-emerald-500/50', 'bg-emerald-500/5');
          item.classList.add('border-cyber-border');
        }

        const progEl = this.container.querySelector('#checklist-progress');
        if (progEl) {
          progEl.textContent = `${this.getCompletedCount()} / 5 Completed`;
        }
      });
    });
  }
}
