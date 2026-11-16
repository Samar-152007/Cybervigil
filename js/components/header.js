/**
 * ScamGuard Pro - Navigation & Localization Header Component
 */
import { i18n } from '../i18n/i18n.js';

export class HeaderComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = 'dashboard';
    this.render();
    this.bindEvents();
    i18n.subscribe(() => this.updateTexts());
  }

  render() {
    this.container.innerHTML = `
      <header class="hud-header border-b border-cyber-border bg-cyber-darker/90 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3 cursor-pointer" id="brand-logo-btn">
            <div class="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/10 border border-cyber-cyan/40 shadow-neon-cyan">
              <svg class="w-6 h-6 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-cyber-dark animate-pulse"></div>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xl font-bold tracking-wider text-white font-mono" data-i18n="appName">CyberVigil</span>
                <span class="px-2 py-0.5 text-xs font-mono rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">AI-SEC</span>
              </div>
              <p class="text-xs text-cyber-muted hidden sm:block" data-i18n="appSubtitle">AI - Multilingual Threat Detection</p>
            </div>
          </div>

          <!-- Main Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button class="nav-tab-btn active px-3 py-2 text-sm font-medium rounded-lg transition-all" data-target="dashboard" data-i18n="nav.dashboard">
              Dashboard
            </button>
            <button class="nav-tab-btn px-3 py-2 text-sm font-medium rounded-lg transition-all" data-target="scanner" data-i18n="nav.scanner">
              Threat Scanner
            </button>
            <button class="nav-tab-btn px-3 py-2 text-sm font-medium rounded-lg transition-all" data-target="incidentHub" data-i18n="nav.incidentHub">
              Helplines &amp; Response
            </button>
            <button class="nav-tab-btn px-3 py-2 text-sm font-medium rounded-lg transition-all" data-target="threatLogs" data-i18n="nav.threatLogs">
              Scan History
            </button>
          </nav>

          <!-- Right Controls: Status & Language Switcher -->
          <div class="flex items-center space-x-3">
            
            <!-- Live Shield Status Pill -->
            <div class="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span data-i18n="shieldActive">Threat Shield: Active</span>
            </div>

            <!-- Language Switcher Dropdown -->
            <div class="relative">
              <label for="lang-select" class="sr-only">Select Language</label>
              <div class="flex items-center rounded-lg bg-cyber-card border border-cyber-border px-2.5 py-1.5 focus-within:border-cyber-cyan">
                <svg class="w-4 h-4 text-cyber-muted mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <select id="lang-select" class="bg-transparent text-white text-xs sm:text-sm font-medium focus:outline-none cursor-pointer">
                  <option value="en" class="bg-cyber-dark text-white">English (EN)</option>
                  <option value="hi" class="bg-cyber-dark text-white">हिन्दी (Hindi)</option>
                  <option value="mr" class="bg-cyber-dark text-white">मराठी (Marathi)</option>
                </select>
              </div>
            </div>

            <!-- Mobile Navigation Toggle -->
            <button id="mobile-menu-toggle" class="md:hidden p-2 text-cyber-muted hover:text-white rounded-lg focus:outline-none" aria-label="Toggle Navigation">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

          </div>
        </div>

        <!-- Mobile Dropdown Menu -->
        <div id="mobile-nav-panel" class="hidden md:hidden px-4 pt-2 pb-4 space-y-1 bg-cyber-dark border-b border-cyber-border">
          <button class="nav-tab-btn-mobile active w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white" data-target="dashboard" data-i18n="nav.dashboard">
            Dashboard
          </button>
          <button class="nav-tab-btn-mobile w-full text-left px-3 py-2 rounded-md text-sm font-medium text-cyber-muted hover:text-white" data-target="scanner" data-i18n="nav.scanner">
            Threat Scanner
          </button>
          <button class="nav-tab-btn-mobile w-full text-left px-3 py-2 rounded-md text-sm font-medium text-cyber-muted hover:text-white" data-target="incidentHub" data-i18n="nav.incidentHub">
            Helplines &amp; Response
          </button>
          <button class="nav-tab-btn-mobile w-full text-left px-3 py-2 rounded-md text-sm font-medium text-cyber-muted hover:text-white" data-target="threatLogs" data-i18n="nav.threatLogs">
            Scan History
          </button>
        </div>
      </header>
    `;

    // Set initial select value
    const langSelect = this.container.querySelector('#lang-select');
    if (langSelect) {
      langSelect.value = i18n.getLanguage();
    }
  }

  bindEvents() {
    // Language selection change
    const langSelect = this.container.querySelector('#lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
      });
    }

    // Logo click to go to dashboard
    const brandBtn = this.container.querySelector('#brand-logo-btn');
    if (brandBtn) {
      brandBtn.addEventListener('click', () => {
        this.switchTab('dashboard');
      });
    }

    // Desktop nav clicks
    const navButtons = this.container.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.switchTab(target);
      });
    });

    // Mobile nav clicks
    const mobileButtons = this.container.querySelectorAll('.nav-tab-btn-mobile');
    mobileButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.switchTab(target);
        const mobilePanel = this.container.querySelector('#mobile-nav-panel');
        if (mobilePanel) mobilePanel.classList.add('hidden');
      });
    });

    // Mobile menu toggle
    const toggleBtn = this.container.querySelector('#mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const mobilePanel = this.container.querySelector('#mobile-nav-panel');
        if (mobilePanel) mobilePanel.classList.toggle('hidden');
      });
    }

    // Listen for custom tab navigation events
    window.addEventListener('scamguard:navigate', (e) => {
      if (e.detail && e.detail.tab) {
        this.switchTab(e.detail.tab);
      }
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update desktop button active state
    this.container.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === tabId) {
        btn.classList.add('active', 'text-cyber-cyan', 'bg-cyber-cyan/10', 'border', 'border-cyber-cyan/30');
        btn.classList.remove('text-cyber-muted');
      } else {
        btn.classList.remove('active', 'text-cyber-cyan', 'bg-cyber-cyan/10', 'border', 'border-cyber-cyan/30');
        btn.classList.add('text-cyber-muted');
      }
    });

    // Update screen views
    document.querySelectorAll('.screen-view').forEach(screen => {
      if (screen.id === `screen-${tabId}`) {
        screen.classList.remove('hidden');
      } else {
        screen.classList.add('hidden');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('scamguard:tabChanged', { detail: { tab: tabId } }));
  }

  updateTexts() {
    const langSelect = this.container.querySelector('#lang-select');
    if (langSelect) {
      langSelect.value = i18n.getLanguage();
    }
  }
}
