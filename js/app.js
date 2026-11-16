/**
 * ScamGuard Pro (CyberVigil AI) - Master Application Bootstrap
 */
import { i18n } from './i18n/i18n.js';
import { HeaderComponent } from './components/header.js';
import { DashboardComponent } from './components/dashboard.js';
import { ScannerComponent } from './components/scanner.js';
import { ResultsComponent } from './components/results.js';
import { IncidentHubComponent } from './components/incidentHub.js';
import { ThreatHistoryComponent } from './components/threatHistory.js';

class ScamGuardApp {
  constructor() {
    this.header = null;
    this.dashboard = null;
    this.scanner = null;
    this.results = null;
    this.incidentHub = null;
    this.threatHistory = null;
  }

  init() {
    console.log('🛡️ ScamGuard Pro (CyberVigil AI) Initializing...');

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

    // 3. Listen for global navigation
    window.addEventListener('scamguard:navigate', (e) => {
      if (e.detail && e.detail.tab) {
        this.navigateToScreen(e.detail.tab);
      }
    });

    console.log('✅ ScamGuard Pro Ready. Threat Shield Active.');
  }

  displayScanResults(scanResult) {
    // Render into results component
    this.results.render(scanResult);
    // Switch view to screen-results
    this.navigateToScreen('results');
  }

  navigateToScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(screen => {
      if (screen.id === `screen-${screenId}`) {
        screen.classList.remove('hidden');
      } else {
        screen.classList.add('hidden');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ScamGuardApp();
  app.init();
});
