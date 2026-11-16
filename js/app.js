/**
 * ScamGuard Pro (CyberVigil AI) - Master Application Bootstrap
 * Dual-Mode Engine: Native Mobile App (Capacitor) & Responsive Web Application
 */
import { i18n } from './i18n/i18n.js';
import { HeaderComponent } from './components/header.js';
import { DashboardComponent } from './components/dashboard.js';
import { ScannerComponent } from './components/scanner.js';
import { ResultsComponent } from './components/results.js';
import { IncidentHubComponent } from './components/incidentHub.js';
import { ThreatHistoryComponent } from './components/threatHistory.js';
import { NativeBridge } from './mobile/nativeBridge.js';

class ScamGuardApp {
  constructor() {
    this.header = null;
    this.dashboard = null;
    this.scanner = null;
    this.results = null;
    this.incidentHub = null;
    this.threatHistory = null;
    this.currentScreen = 'dashboard';
  }

  init() {
    console.log('🛡️ ScamGuard Pro (CyberVigil AI) Initializing in Mobile & Web Mode...');

    // 1. Initialize Localization
    i18n.updateDom();

    // 2. Initialize Components
    this.header = new HeaderComponent('app-header');

    this.results = new ResultsComponent('screen-results');

    this.dashboard = new DashboardComponent('screen-dashboard', (scanResult) => {
      this.displayScanResults(scanResult);
    });

    this.scanner = new ScannerComponent('screen-scanner', (scanResult) => {
      this.displayScanResults(scanResult);
    });

    this.incidentHub = new IncidentHubComponent('screen-incidentHub');

    this.threatHistory = new ThreatHistoryComponent('screen-threatLogs', (selectedLog) => {
      this.displayScanResults(selectedLog);
    });

    // 3. Initialize Mobile Native Bridge (Android Back Button, Haptics, Status Bar)
    NativeBridge.init((screenId) => {
      this.navigateToScreen(screenId);
    });

    // 4. Initialize Mobile Bottom Tab Navigation
    this.initMobileNav();

    // 5. Listen for global navigation events
    window.addEventListener('scamguard:navigate', (e) => {
      if (e.detail && e.detail.tab) {
        this.navigateToScreen(e.detail.tab);
      }
    });

    console.log('✅ ScamGuard Pro Ready. Threat Shield Active.');
  }

  initMobileNav() {
    document.querySelectorAll('[data-mobile-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.mobileNav;
        NativeBridge.triggerHaptic('light');
        this.navigateToScreen(target);
        // Dispatch navigation event to keep header tabs synchronized
        window.dispatchEvent(new CustomEvent('scamguard:navigate', { detail: { tab: target } }));
      });
    });
  }

  updateMobileNav(screenId) {
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      const isTarget = btn.dataset.mobileNav === screenId;
      if (isTarget) {
        btn.classList.add('active', 'text-cyber-cyan');
        btn.classList.remove('text-cyber-muted');
      } else {
        btn.classList.remove('active', 'text-cyber-cyan');
        btn.classList.add('text-cyber-muted');
      }
    });
  }

  displayScanResults(scanResult) {
    // Haptic feedback based on evaluated threat risk level
    if (scanResult && typeof scanResult.score === 'number') {
      if (scanResult.score >= 70) {
        NativeBridge.triggerHaptic('error');
      } else if (scanResult.score >= 31) {
        NativeBridge.triggerHaptic('warning');
      } else {
        NativeBridge.triggerHaptic('light');
      }
    }

    // Render into results component
    this.results.render(scanResult);
    // Switch view to screen-results
    this.navigateToScreen('results');
  }

  navigateToScreen(screenId) {
    this.currentScreen = screenId;

    document.querySelectorAll('.screen-view').forEach(screen => {
      if (screen.id === `screen-${screenId}`) {
        screen.classList.remove('hidden');
      } else {
        screen.classList.add('hidden');
      }
    });

    this.updateMobileNav(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ScamGuardApp();
  app.init();
});
