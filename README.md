# 🛡️ CyberVigil
> **Enterprise-Grade Multilingual Cybersecurity Awareness & Real-Time Threat Detection Mobile & Web Platform**

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web%20(PWA)-brightgreen.svg)](#mobile--web-architecture)
[![Language](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80-cyan.svg)](#multilingual-core)
[![Compliance](https://img.shields.io/badge/Security-IT%20Act%202000%20%2F%20CERT--In-blue.svg)](#regulatory-compliance)
[![Helpline](https://img.shields.io/badge/National%20Helpline-1930%20Golden%20Hour-red.svg)](#incident-response)

---

## 📌 Executive Architecture Overview

**CyberVigil** is engineered as a **mobile-first application** with simultaneous **web platform** capabilities. It detects psychological coercion, phishing links, spoofed caller identities, and fraudulent legal documents in real time before financial harm occurs.

```text
CYbersecurity app/
├── android/                     # Native Android Gradle Project (Capacitor)
├── ios/                         # Native iOS Xcode Project (Capacitor)
├── www/                         # Synchronized mobile distribution web assets
├── capacitor.config.json        # Capacitor native bridge configuration
├── package.json                 # Build scripts & native platform dependencies
├── manifest.json                # PWA Web App Manifest
├── launch.bat                   # Unified Web & Mobile Launcher
├── index.html                   # Mobile-responsive HUD & App shell
├── css/
│   └── styles.css               # Dark-mode cybersecurity design & mobile safe-area insets
├── js/
│   ├── app.js                   # Main application coordinator & mobile tab router
│   ├── mobile/
│   │   └── nativeBridge.js      # Capacitor native hardware bridge (Back button, Haptics, Status bar)
│   ├── i18n/
│   │   ├── i18n.js              # Reactive localization engine
│   │   ├── en.js                # English forensic lexicon
│   │   ├── hi.js                # Hindi (हिन्दी) cyber advisory
│   │   └── mr.js                # Marathi (मराठी) cyber advisory
│   ├── heuristics/
│   │   ├── engine.js            # Multi-vector risk scoring engine
│   │   ├── textHeuristics.js    # NLP coercion & digital arrest analyzer
│   │   ├── urlHeuristics.js     # Typosquatting & malicious TLD detector
│   │   ├── phoneHeuristics.js   # TRAI & international spoof validator
│   │   └── ocrSimulator.js      # Visual document OCR scanner & presets
│   ├── storage/
│   │   └── threatLog.js         # LocalStorage forensic log manager
│   └── components/
│       ├── header.js            # HUD status bar & language switcher
│       ├── dashboard.js         # Security gauge & quick scan
│       ├── scanner.js           # 4-vector threat analyzer
│       ├── results.js           # Threat score, red flags & incident export
│       ├── incidentHub.js       # 1930 helpline direct dial & Golden Hour checklist
│       └── threatHistory.js     # Threat logs & CSV/JSON exporter
└── assets/                      # Forensic mock vector SVGs
```

---

## 📱 Mobile Application Capabilities

* **Native Android & iOS Support**: Powered by **Capacitor 8**, wrapping modern ES6 modules into high-performance native apps.
* **One-Handed Mobile Navigation**: Dedicated thumb-friendly bottom navigation bar for seamless switching between Overview, Threat Scanner, 1930 Hub, and Audit Logs.
* **Hardware Back-Button Navigation**: Pressing the Android physical/gesture back button steps back through screens instead of closing the app.
* **Haptic Feedback**: Custom vibration pulses triggered on scan completion based on threat severity (Critical, Caution, Safe).
* **Safe-Area Insets**: Full support for device notches, camera punch-holes, and home indicator gestures (`viewport-fit=cover`).
* **Instant Emergency Dialing**: One-tap native dialer trigger for India's **1930 Cybercrime Helpline**.

---

## 🚀 Running & Building

### 1. Unified Launcher (Easiest)
Simply double-click **`launch.bat`** (or execute `.\launch.bat` in your terminal):
* **Option 1**: Starts the local Web Server and automatically opens your browser.
* **Option 2**: Starts with Python.
* **Option 3**: Builds `/www` and synchronizes assets with both Android and iOS projects.
* **Option 4**: Synchronizes and opens the project in Android Studio.

### 2. Building the Android Mobile App (APK)
```bash
# Step 1: Package web distribution assets
npm run build

# Step 2: Sync assets to the native Android project
npx cap sync android

# Step 3: Open in Android Studio to build or run on your phone/emulator
npx cap open android
```
*In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the installable `.apk` file.*

### 3. Building for iOS
```bash
# Sync and open Xcode (requires macOS)
npm run build
npx cap sync ios
npx cap open ios
```

### 4. Running as a Web Application
```bash
npm start
# Or using launch.bat
.\launch.bat
```
Visit: **`http://localhost:8080`**
