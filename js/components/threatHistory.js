/**
 * ScamGuard Pro - Threat Log History Component
 * Local forensic audit trail with search, risk filters, JSON/CSV exports, and re-analysis
 */
import { i18n } from '../i18n/i18n.js';
import { ThreatLogManager } from '../storage/threatLog.js';

export class ThreatHistoryComponent {
  constructor(containerId, onSelectLog) {
    this.container = document.getElementById(containerId);
    this.onSelectLog = onSelectLog;
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.render();
    this.bindEvents();
    i18n.subscribe(() => this.render());
    window.addEventListener('scamguard:logAdded', () => this.refreshTable());
    window.addEventListener('scamguard:logsUpdated', () => this.refreshTable());
  }

  render() {
    this.container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header & Controls -->
        <div class="bg-cyber-card border border-cyber-border rounded-2xl p-6 shadow-hud">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div class="flex items-center space-x-3">
              <span class="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h2 class="text-2xl font-bold text-white font-mono" data-i18n="history.title">Local Threat Log &amp; Forensics</h2>
                <p class="text-xs text-cyber-muted" data-i18n="history.subtitle">
                  Your past scans are stored privately on this device's browser memory (localStorage).
                </p>
              </div>
            </div>

            <!-- Export & Clear Buttons -->
            <div class="flex flex-wrap items-center gap-2">
              <button id="btn-export-json" class="px-3.5 py-2 rounded-xl bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer">
                <svg class="w-4 h-4 text-cyber-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span data-i18n="history.exportJsonBtn">Export JSON</span>
              </button>

              <button id="btn-export-csv" class="px-3.5 py-2 rounded-xl bg-cyber-dark hover:bg-cyber-darker text-cyber-muted hover:text-white border border-cyber-border font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer">
                <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span data-i18n="history.exportCsvBtn">Export CSV</span>
              </button>

              <button id="btn-clear-history" class="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span data-i18n="history.clearLogsBtn">Clear Log History</span>
              </button>
            </div>
          </div>

          <!-- Search & Filter Bar -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-cyber-border/70">
            <!-- Search Input -->
            <div class="relative flex-grow max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="history-search-input"
                class="w-full pl-9 pr-4 py-2 bg-cyber-darker border border-cyber-border rounded-xl text-white placeholder-cyber-muted/60 text-xs font-mono focus:outline-none focus:border-cyber-cyan"
                data-i18n-placeholder="history.searchPlaceholder"
                placeholder="Search scan history by keyword, domain, or phone..."
              />
            </div>

            <!-- Filter Pills -->
            <div class="flex flex-wrap gap-1.5">
              <button class="filter-btn active px-3 py-1.5 rounded-lg text-xs font-mono transition-all" data-filter="all" data-i18n="history.filterAll">
                All Logs
              </button>
              <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-mono text-cyber-muted hover:text-white transition-all" data-filter="HIGH" data-i18n="history.filterHigh">
                Critical Threats
              </button>
              <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-mono text-cyber-muted hover:text-white transition-all" data-filter="CAUTION" data-i18n="history.filterCaution">
                Caution
              </button>
              <button class="filter-btn px-3 py-1.5 rounded-lg text-xs font-mono text-cyber-muted hover:text-white transition-all" data-filter="SAFE" data-i18n="history.filterSafe">
                Safe
              </button>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-cyber-card border border-cyber-border rounded-2xl shadow-hud overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-cyber-border bg-cyber-dark/80 text-[11px] font-mono text-cyber-muted uppercase tracking-wider">
                  <th class="py-3.5 px-4" data-i18n="history.colDate">Timestamp</th>
                  <th class="py-3.5 px-3" data-i18n="history.colType">Vector</th>
                  <th class="py-3.5 px-4" data-i18n="history.colInput">Evaluated Content</th>
                  <th class="py-3.5 px-3 text-center" data-i18n="history.colScore">Risk Score</th>
                  <th class="py-3.5 px-3 text-center" data-i18n="history.colVerdict">Verdict</th>
                  <th class="py-3.5 px-4 text-right" data-i18n="history.colActions">Actions</th>
                </tr>
              </thead>
              <tbody id="history-table-body" class="divide-y divide-cyber-border/60 text-xs font-mono">
                <!-- Rows injected dynamically -->
              </tbody>
            </table>
          </div>
          <div id="history-empty-message" class="hidden p-8 text-center text-sm font-mono text-cyber-muted">
            <p data-i18n="history.emptyHistory">No threat scans recorded yet. Run a scan above to see your history.</p>
          </div>
        </div>

      </div>
    `;

    this.refreshTable();
  }

  bindEvents() {
    // Search input
    const searchInput = this.container.querySelector('#history-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.refreshTable();
      });
    }

    // Filter buttons
    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-cyber-cyan/15', 'text-cyber-cyan', 'border', 'border-cyber-cyan/30');
          b.classList.add('text-cyber-muted');
        });
        btn.classList.add('active', 'bg-cyber-cyan/15', 'text-cyber-cyan', 'border', 'border-cyber-cyan/30');
        btn.classList.remove('text-cyber-muted');

        this.currentFilter = btn.getAttribute('data-filter');
        this.refreshTable();
      });
    });

    // Clear logs
    const clearBtn = this.container.querySelector('#btn-clear-history');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your local threat scan history?')) {
          ThreatLogManager.clearLogs();
          this.refreshTable();
        }
      });
    }

    // Export JSON
    const exportJsonBtn = this.container.querySelector('#btn-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        ThreatLogManager.exportJson();
      });
    }

    // Export CSV
    const exportCsvBtn = this.container.querySelector('#btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        ThreatLogManager.exportCsv();
      });
    }
  }

  refreshTable() {
    const tbody = this.container.querySelector('#history-table-body');
    const emptyMsg = this.container.querySelector('#history-empty-message');
    if (!tbody) return;

    let logs = ThreatLogManager.getLogs();

    // Filter by verdict
    if (this.currentFilter !== 'all') {
      logs = logs.filter(l => l.verdict === this.currentFilter);
    }

    // Search query
    if (this.searchQuery) {
      logs = logs.filter(l => 
        (l.inputSnippet && l.inputSnippet.toLowerCase().includes(this.searchQuery)) ||
        (l.category && l.category.toLowerCase().includes(this.searchQuery)) ||
        (l.vector && l.vector.toLowerCase().includes(this.searchQuery))
      );
    }

    if (logs.length === 0) {
      tbody.innerHTML = '';
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');

    tbody.innerHTML = logs.map(item => {
      let verdictBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      if (item.verdict === 'HIGH') verdictBadgeClass = 'bg-red-500/10 text-red-400 border-red-500/30';
      if (item.verdict === 'CAUTION') verdictBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <tr class="hover:bg-cyber-dark/40 transition-colors">
          <td class="py-3 px-4 text-cyber-muted whitespace-nowrap">${dateStr}</td>
          <td class="py-3 px-3">
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyber-dark border border-cyber-border text-cyber-cyan">
              ${item.vector || 'TEXT'}
            </span>
          </td>
          <td class="py-3 px-4 max-w-xs sm:max-w-md truncate text-white">
            ${item.inputSnippet || 'Scanned Content'}
          </td>
          <td class="py-3 px-3 text-center font-bold" style="color: ${item.verdict === 'HIGH' ? '#EF4444' : (item.verdict === 'CAUTION' ? '#F59E0B' : '#10B981')};">
            ${item.score}%
          </td>
          <td class="py-3 px-3 text-center">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${verdictBadgeClass}">
              ${item.verdict}
            </span>
          </td>
          <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap">
            <button class="btn-view-log text-xs text-cyber-cyan hover:underline cursor-pointer" data-id="${item.id}">
              ${i18n.t('history.reanalyzeBtn')}
            </button>
            <button class="btn-del-log text-xs text-red-400 hover:text-red-300 cursor-pointer" data-id="${item.id}">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row events
    tbody.querySelectorAll('.btn-view-log').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const match = logs.find(l => l.id === id);
        if (match && this.onSelectLog) {
          this.onSelectLog(match);
        }
      });
    });

    tbody.querySelectorAll('.btn-del-log').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        ThreatLogManager.deleteLog(id);
        this.refreshTable();
      });
    });
  }
}
