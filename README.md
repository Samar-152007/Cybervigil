# 🛡️ ScamGuard Pro (CyberVigil AI)
> **Enterprise-Grade Multilingual Cybersecurity Awareness & Real-Time Threat Detection Platform**

[![Language](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80-cyan.svg)](#multilingual-core)
[![License](https://img.shields.io/badge/Security-IT%20Act%202000%20%2F%20CERT--In-blue.svg)](#regulatory-compliance)
[![Helpline](https://img.shields.io/badge/National%20Helpline-1930%20Golden%20Hour-red.svg)](#incident-response)

---

## 📌 Executive Architecture Overview

**ScamGuard Pro** (also known as **CyberVigil AI**) is a production-ready, client-side zero-dependency cybersecurity defense system engineered to detect psychological coercion, phishing links, spoofed caller identities, and fraudulent legal documents before financial loss occurs.

```
c:\Users\Samarjeet\OneDrive\Desktop\CYbersecurity app\
├── index.html                   # Master Application Shell & Semantic Accessibility HUD
├── css/
│   └── styles.css               # Cybersecurity Dark-Mode Design System & Semantic Color Tokens
├── js/
│   ├── app.js                   # Application Lifecycle Bootstrap & Component Coordinator
│   ├── i18n/
│   │   ├── i18n.js              # Reactive Localization Manager & DOM Observer
│   │   ├── en.js                # English Forensic Lexicon & Guidelines
│   │   ├── hi.js                # Hindi (हिन्दी) Cyber Lexicon & Advisory
│   │   └── mr.js                # Marathi (मराठी) Cyber Lexicon & Advisory
│   ├── heuristics/
│   │   ├── engine.js            # Master Multi-Vector Risk Scoring & Triage Engine
│   │   ├── textHeuristics.js    # NLP Pattern Matcher for Digital Arrest, Electricity, KYC Scams
│   │   ├── urlHeuristics.js     # Typosquatting, IP Hosts, Bad TLDs & Malicious Extensions
│   │   ├── phoneHeuristics.js   # TRAI Standard Validator, +92/+234/Wangiri Callback Traps
│   │   └── ocrSimulator.js      # Visual Document Scanner & Forensic OCR Extractor
│   ├── storage/
│   │   └── threatLog.js         # LocalStorage Forensic Log Manager & JSON/CSV Exporter
│   └── components/
│       ├── header.js            # Navigation HUD, Live Radar Shield & Language Switcher
│       ├── dashboard.js         # Security Posture Radial Gauge, Quick-Scan Bar & Tips Feed
│       ├── scanner.js           # 4-Tab Multi-Format Threat Analyzer with 1-Click Samples
│       ├── results.js           # Quantitative Scoring Card, Red Flags & Audit Export
│       ├── incidentHub.js       # 1930 Helpline Direct Dial & Interactive Golden Hour Checklist
│       └── threatHistory.js     # Audit Log Table, Search, Risk Filters & Data Export
└── assets/
    ├── sample_arrest_warrant.svg  # CBI / Police Digital Arrest Notice Scam Mockup
    ├── sample_electricity_sms.svg # Electricity Disconnection SMS Mockup
    ├── sample_kbc_cheque.svg      # KBC ₹25 Lakh Lottery Cheque Mockup
    └── sample_telegram_job.svg    # Telegram Crypto Task / Pig-Butchering Chat Mockup
```

---

## 🚀 Key Functional Modules

### 1. Multilingual Core (English, हिन्दी, मराठी)
- Instant, non-reloading localization across all UI labels, error states, and threat breakdown narratives.
- Deep, culturally relevant threat typologies (e.g. *डिजिटल अरेस्ट*, *वीज बिल खंडित फसवणूक*, *केवायसी ब्लॉक फ्रॉड*).

### 2. Multi-Format Threat Scanner (Core Engine)
| Vector | Engine Capabilities & Heuristics |
| :--- | :--- |
| **Text / SMS Analyzer** | Psychological coercion detection: Authority intimidation (Digital Arrest), extreme urgency (2-hour deadlines), utility disconnections, bank KYC deactivations, and advance fee traps. |
| **URL / Link Checker** | Typosquatting of Indian banks & utilities (`sbi`, `hdfc`, `mahadiscom`), direct numerical IP hosting, suspicious TLDs (`.xyz`, `.top`, `.online`), URL shorteners, and `.apk` downloads. |
| **Phone Number Checker**| TRAI telecom compliance check (10-digit mobile, 140/160 series), international high-risk country codes (+92 Pakistan, +234 Nigeria, +880 Bangladesh), and Wangiri callback traps. |
| **Screenshot OCR Simulator** | High-precision visual document extraction with 4 preloaded visual scam presets (CBI Warrant, Electricity SMS, KBC Cheque, Telegram Crypto Task) plus custom image upload. |

### 3. Quantitative Risk Scoring Engine
- **Normalized Threat Score (0% – 100%)**:
  - `0% – 30%`: **SAFE / LOW RISK** (Emerald Green `#10B981`)
  - `31% – 69%`: **CAUTION ADVISED** (Amber Yellow `#F59E0B`)
  - `70% – 100%`: **CRITICAL THREAT / HIGH RISK** (Crimson Red `#EF4444`)
- Provides itemized **Red Flag Forensics**, **Psychological Coercion Vectors**, and **Immediate Recovery Advice**.
- Includes 1-click **Export Official Audit Report** (text file) and **Copy Incident Summary**.

### 4. Incident Response & Helpline Hub
- Direct one-tap access to **Helpline 1930** (Toll-free National Cybercrime Reporting).
- Quick links to official portals:
  - `cybercrime.gov.in` (MHA National Portal)
  - `sancharsaathi.gov.in` (Chakshu Portal for blocking fraudulent SIMs)
  - `sachet.rbi.org.in` (RBI Sachet for illegal lending apps)
- **Interactive Golden-Hour Checklist**: Persistent state checkboxes guiding victims through freezing accounts, reporting to 1930, preserving uncropped screenshots, and removing remote mirroring apps.

### 5. Local Threat History & Forensics
- Stored privately in browser `localStorage`.
- Real-time search across evaluated snippets and fraud categories.
- Filter by threat severity (*Critical Threats*, *Caution*, *Safe*, *All*).
- 1-click export to **JSON** or **CSV** for forensic case filing.

---

## 💻 How to Run Locally

You can run ScamGuard Pro directly in your web browser:

### Option A: Local HTTP Server (Recommended)
```bash
# In the project directory:
python -m http.server 8080
# Or using Node:
npx serve .
```
Then navigate to: **`http://localhost:8080`**

### Option B: Direct Browser Opening
Simply double-click `index.html` to open it in Chrome, Edge, Brave, or Firefox.
