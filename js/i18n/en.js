/**
 * CyberVigil - English Localization Dictionary
 */
export const en = {
  appName: "CyberVigil",
  appSubtitle: "AI Multilingual Threat Detection & Response",
  shieldActive: "Threat Shield: Active",
  version: "v2.4 Enterprise",

  nav: {
    dashboard: "Dashboard",
    scanner: "Threat Scanner",
    incidentHub: "Helplines & Response",
    threatLogs: "Scan History",
    howItWorks: "How It Works"
  },

  dashboard: {
    welcomeTitle: "Real-Time AI Cybersecurity Defense",
    welcomeSubtitle: "Detect scams, phishing links, spoofed callers, and fraudulent documents before financial loss occurs.",
    quickScanPlaceholder: "Paste suspicious SMS, URL, phone number (+91...), or message here for instant AI triage...",
    quickScanBtn: "Analyze Now",
    healthMeterTitle: "Security Posture Index",
    healthStatusExcellent: "Vigilance Optimal",
    healthStatusFair: "Caution Required",
    healthStatusAtRisk: "Threats Detected",
    healthMeterSub: "Based on real-time heuristic scans & active threat indicators",
    statsScans: "Total Scans Run",
    statsThreats: "Threats Neutralized",
    statsHelplines: "Active National Helplines",
    statsAvgSpeed: "Avg Engine Latency",
    tipsTitle: "Cyber Hygiene & Defense Tip of the Day",
    tipPrev: "Previous Tip",
    tipNext: "Next Tip",
    quickActionsTitle: "Quick Launch Scanners",
    launchText: "SMS & Text Analyzer",
    launchUrl: "Phishing Link Checker",
    launchPhone: "Caller ID & WhatsApp",
    launchOcr: "Screenshot & Document OCR"
  },

  scanner: {
    title: "Multi-Format Threat Scanner",
    subtitle: "Select the input format below. Our deep heuristic engine identifies psychological coercion, spoofing, and fraud footprints.",
    tabText: "Text / SMS Analyzer",
    tabUrl: "URL / Phishing Checker",
    tabPhone: "Caller ID & Phone",
    tabOcr: "Screenshot OCR Simulator",

    // Text Tab
    textLabel: "Suspicious Text / SMS / Chat Content",
    textPlaceholder: "e.g. 'Dear customer, your SBI YONO account will be blocked today at 9 PM. Update your PAN immediately at https://bit.ly/sbi-kyc-update or call 9876543210'...",
    textHelper: "Scans for psychological triggers: false authority, extreme urgency, panic-inducing threats, KYC traps, and OTP phishing.",
    loadSampleBtn: "Load Real Scam Sample",
    sampleElectricity: "Electricity Disconnection Scam",
    sampleDigitalArrest: "Digital Arrest (Police/CBI Scam)",
    sampleKyc: "Bank KYC Expiry Trap",
    sampleJob: "Telegram Part-time Work Scam",
    sampleLottery: "KBC 25 Lakh Lottery Scam",
    analyzeBtn: "Run Deep AI Threat Scan",
    clearBtn: "Clear Input",

    // URL Tab
    urlLabel: "Suspicious Website / Link / Domain",
    urlPlaceholder: "e.g. https://sbi-card-verify.net/login?token=urgent...",
    urlHelper: "Evaluates typosquatting, brand spoofing, dangerous top-level domains (.xyz, .top), IP addresses, and credential harvesting forms.",
    sampleUrl1: "Spoofed Bank Portal",
    sampleUrl2: "Fake Electricity Bill Site",
    sampleUrl3: "Suspicious Shortened URL",

    // Phone Tab
    phoneLabel: "Caller ID, WhatsApp Number, or SMS Sender Header",
    phonePlaceholder: "e.g. +92 301 2345678, +1 800 555 0199, VM-SBIINB...",
    phoneHelper: "Checks international high-risk country codes (+92, +234, +880), fake government spoofing, VoIP virtual ranges, and TRAI telecom guidelines.",
    samplePhone1: "International WhatsApp Scam (+92)",
    samplePhone2: "Spoofed Police Caller (+44)",
    samplePhone3: "Suspicious Indian Mobile (Unverified)",

    // OCR Tab
    ocrLabel: "Upload Screenshot or Fraudulent Document",
    ocrDropzoneText: "Drag & drop screenshot here, or click to browse",
    ocrDropzoneSub: "Supports PNG, JPG, WEBP. Simulates high-precision OCR extraction & NLP threat categorization.",
    ocrSampleLabel: "Or choose a real pre-loaded scam document:",
    ocrSample1: "Fake CBI / Police Arrest Notice",
    ocrSample2: "Fake Electricity Notice Screenshot",
    ocrSample3: "Fake Lottery Prize Cheque",
    ocrSample4: "Telegram Crypto Task Screenshot",
    extractedTextLabel: "Extracted Document Text (OCR Preview):",
    ocrScanningBadge: "Scanning Image Pixels & Typography...",
    ocrSuccessBadge: "OCR Extraction Complete"
  },

  results: {
    verdictTitle: "Threat Evaluation Report",
    scamScoreLabel: "Scam Probability Score",
    riskSafe: "SAFE / LOW RISK",
    riskCaution: "CAUTION ADVISED",
    riskHigh: "CRITICAL THREAT / HIGH RISK",
    confidence: "Detection Confidence",
    categoryLabel: "Identified Fraud Typology",
    psychologicalTriggerLabel: "Psychological Coercion Vectors",
    technicalIndicatorsLabel: "Technical Footprints & Red Flags",
    mitigationTitle: "Immediate Action & Recovery Checklist",
    exportReportBtn: "Export Official Audit Report",
    copySummaryBtn: "Copy Incident Summary",
    copiedToast: "Summary copied to clipboard!",
    reportToGovBtn: "Report to Cybercrime Portal (1930)",
    redFlagsTitle: "Red Flag Forensic Breakdown",
    severityCritical: "CRITICAL",
    severityHigh: "HIGH",
    severityMedium: "MEDIUM",
    severityLow: "INFO"
  },

  incidentHub: {
    title: "National Incident Response & Helpline Hub",
    subtitle: "Immediate recourse and emergency protocols under Indian Cybersecurity & IT Act provisions.",
    helpline1930Title: "National Cyber Helpline 1930",
    helpline1930Desc: "Call immediately within the 'Golden Hour' (first 2 hours of transaction) to freeze money in transit across bank accounts.",
    helpline1930Action: "Dial 1930 (Toll-Free)",
    portalTitle: "National Cyber Crime Reporting Portal",
    portalDesc: "Official Ministry of Home Affairs (MHA) portal to lodge formal FIRs for financial fraud, cyber stalking, and online scams.",
    portalAction: "Open cybercrime.gov.in",
    chakshuTitle: "Chakshu Portal (Sanchar Saathi)",
    chakshuDesc: "Department of Telecommunications (DoT) facility to report fraudulent calls, SMS, and WhatsApp communications for SIM blocking.",
    chakshuAction: "Open Chakshu Portal",
    rbiTitle: "RBI Sachet Portal",
    rbiDesc: "Report unauthorized digital lending apps, fake loan recovery agents, and unregistered non-banking financial entities.",
    rbiAction: "Visit RBI Sachet",
    emergencyStepsTitle: "Interactive Emergency Golden-Hour Protocol",
    step1: "1. Freeze Bank Accounts & UPI: Call your bank's 24/7 emergency toll-free number to freeze affected accounts and block debit/credit cards.",
    step2: "2. Dial 1930 Immediately: Report transaction details, Bank UTR number, beneficiary account, and transaction time to freeze funds.",
    step3: "3. Preserve Evidence: Take uncropped screenshots of SMS, chat transcripts, payment slips, caller IDs, and URL links.",
    step4: "4. Disconnect & Uninstall Remote Tools: If AnyDesk, TeamViewer, or RustDesk was installed, disconnect Wi-Fi and uninstall immediately.",
    step5: "5. File Formal Complaint: Register cyber FIR on cybercrime.gov.in and obtain an acknowledgement number for bank dispute resolution.",
    stepCompleteToast: "Step marked as resolved"
  },

  history: {
    title: "Local Threat Log & Forensics",
    subtitle: "Your past scans are stored privately on this device's browser memory (localStorage).",
    searchPlaceholder: "Search scan history by keyword, domain, or phone...",
    filterAll: "All Logs",
    filterHigh: "Critical Threats",
    filterCaution: "Caution",
    filterSafe: "Safe",
    clearLogsBtn: "Clear Log History",
    exportJsonBtn: "Export JSON",
    exportCsvBtn: "Export CSV",
    emptyHistory: "No threat scans recorded yet. Run a scan above to see your history.",
    colDate: "Timestamp",
    colType: "Vector",
    colInput: "Evaluated Content",
    colScore: "Risk Score",
    colVerdict: "Verdict",
    colActions: "Actions",
    reanalyzeBtn: "View Details"
  },

  tipsList: [
    {
      title: "Beware of 'Digital Arrest' Scams",
      text: "No law enforcement agency (CBI, Mumbai Police, ED, Customs) conducts judicial hearings or arrests over Skype or WhatsApp video calls. Real police summon in person with physical warrants."
    },
    {
      title: "The Golden Hour for Cyber Financial Fraud",
      text: "If you lost money to an online fraudster, dial 1930 within 2 hours. Rapid intervention freezes the scammer's bank mule account before money is laundered through ATMs or crypto."
    },
    {
      title: "Electricity Disconnection SMS Trap",
      text: "Power distribution utilities never send SMS threatening disconnection within 2 hours with personal mobile numbers for payment. Bill payments must only be made via official consumer portals."
    },
    {
      title: "Part-time Telegram / YouTube Like Scam",
      text: "Fraudsters lure you with ₹150 for liking videos, then force you into 'crypto prepaid tasks' demanding lakhs. Never pay money to receive earnings—it is always a Ponzi trap."
    },
    {
      title: "Never Install Screen Sharing APKs",
      text: "Scammers claiming to be bank executives ask you to install AnyDesk, TeamViewer, or QuickSupport to 'assist' you. This grants them full screen control to steal your OTPs and netbanking passwords."
    },
    {
      title: "Check Before Dialing Customer Care",
      text: "Scammers publish fake customer care numbers for airlines, courier services, and banks on Google Maps. Always cross-verify contact numbers directly from official verified websites."
    },
    {
      title: "Aadhaar & PAN KYC Block Panic",
      text: "Banks never send generic shortened URLs (bit.ly, tinyurl) asking for PAN card upload or netbanking passwords. Real banks use SMS sender IDs like VK-HDFCBK or VM-SBIINB."
    },
    {
      title: "WhatsApp International Missed Calls (+92, +880, +234)",
      text: "Never call back unexpected international numbers on WhatsApp. Fraudsters run Wangiri call-back extortion and honey-trap scams."
    }
  ]
};
