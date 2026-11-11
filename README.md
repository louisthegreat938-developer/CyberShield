<div align="center">

# 🛡️ SENTINEL
### Autonomous Cyber-Defense & Threat-Neutralizing Web Client

[![Release](https://img.shields.io/github/v/release/louisthegreat938-developer/CyberShield?color=2563eb&style=for-the-badge&logo=github)](https://github.com/louisthegreat938-developer/CyberShield/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-slate?style=for-the-badge&logo=windows)](https://github.com/louisthegreat938-developer/CyberShield)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![Built For](https://img.shields.io/badge/Project-Annual%20IT%20Exhibition-amber?style=for-the-badge)](#-exhibition-showcase--demo-vectors)

<p align="center">
  <b>A proactive, defense-first browser engineered to intercept zero-day phishing, IDN homograph lookalikes, credential-harvesting vectors, and surveillance trackers before web payloads render.</b>
</p>

[Download Standalone .EXE](https://github.com/louisthegreat938-developer/CyberShield/releases/latest) • [Key Features](#-core-defense-vectors) • [Live Attack Lab](#-exhibition-showcase--demo-vectors) • [Architecture](#-under-the-hood)

---

</div>

## 📌 The Problem

Standard web browsers are designed primarily for **speed and rendering convenience**. Security mechanisms (like Google Safe Browsing or SmartScreen) are largely **reactive**—they depend on a domain being flagged, reported, and added to a central database hours or days after the campaign launches.

In that window, regular users fall victim to:
- **Zero-Day Phishing:** Disposable domains with high-entropy credential harvesting forms.
- **IDN Homograph Exploits:** Visually identical characters (e.g., Cyrillic `а` substituting Latin `a`) tricking users into trusting fake banking or account portals.
- **Cleartext Degradation:** Credentials passing over unencrypted HTTP channels susceptible to Man-In-The-Middle (MITM) snooping.
- **Silent Surveillance:** Persistent third-party telemetry scripts fingerprinting user activity across tabs.

**Sentinel reverses this model.** Instead of waiting for a website to be blacklisted, it analyzes every request at the network layer against an active heuristic matrix **before** initiating connections.

---

## ⚡ Core Defense Vectors

### 1. IDN Homograph & Punycode Neutralization
Attackers register domains using international non-ASCII characters that look 100% identical to the human eye (`xn--pple-43d.com` rendering as `apple.com`). Sentinel decodes punycode strings and intercepts lookalike character spoofs immediately.

### 2. Heuristic Phishing & Credential Theft Engine
Evaluates parameter patterns, high-entropy subdomain stacking, suspicious top-level domains (`.xyz`, `.click`, `.top`), and deceptive credential triggers (`verify`, `recover-wallet`, `account-update`) in real time.

### 3. Cleartext Transport Interception
Flags unencrypted HTTP sessions that expose login credentials, cookies, and tokens to local network snooping.

### 4. Background Spyware & Tracker Blackhole
Intercepts third-party telemetry beacons and ad-tracking scripts at Chromium’s network dispatch layer without degrading page responsiveness.

### 5. Sandboxed Web Engine
Built using an isolated `<webview>` implementation with Chromium context isolation, ensuring malicious scripts inside the web page have zero access to the host machine or OS-level file systems.

---

## 🧪 Demo Vectors

Sentinel comes pre-equipped with an integrated **Attack Lab** drawer. Visitors and evaluators at our IT booth can trigger real attack simulations with a single click:

| Simulated Attack Vector | Test URL | Detection Mechanism |
| :--- | :--- | :--- |
| **IDN Homograph (Spoofing)** | `https://xn--pple-43d.com` | Punycode / Cyrillic lookalike character interceptor |
| **Deceptive Phishing** | `http://insecure-bank-login.xyz/paypal-verification` | Cleartext HTTP + high-risk TLD + credential keyword analysis |
| **Known Malware / C2** | `https://verify-your-bank-securely.com` | Instant blocklist match (Score: 0 / 100) |
| **Insecure Transport** | `http://neverssl.com` | Unencrypted transport alert & Trust degradation |

---

## 🖥️ User Interface & Experience

Sentinel features a focused, distraction-free **Light Canvas UI**:
- **Live Shield Indicator:** Dynamically shifts states (`Secure`, `Degraded`, `Critical Lockdown`).
- **Dynamic Trust Badge:** Displays real-time domain integrity percentages (`100%` down to `0%`).
- **Telemetry Drawer:** Live audit stream displaying blocked surveillance trackers and heuristic decisions.
- **Lockdown Modal:** Explains exactly *why* a connection was terminated so users learn cybersecurity concepts in real time.

---

## ⚙️ Under The Hood

```text
cyber-shield-browser/
├── main.js              # Electron lifecycle, window creation & network interception
├── preload.js           # Context-isolated secure IPC bridge
├── security-engine.js   # Algorithmic heuristic analysis & pattern matrix
├── index.html           # Modern light-mode browser frame & modals
├── style.css            # Slate & Cobalt aesthetic, responsive layout
└── renderer.js          # Navigation controller, event handling & telemetry stream
Runtime: Electron (Chromium + Node.js)

Security Layer: Node-level request hook via session.defaultSession.webRequest

UI Framework: Vanilla HTML5, modern CSS custom properties, FontAwesome icons
```

## 🚀 Quick Start

### Option 1: Standalone Portable `.EXE` (Recommended)
No developer tools or setup required:
1. Head over to [Releases](https://github.com/louisthegreat938-developer/CyberShield/releases/latest).
2. Download `SentinelBrowser.exe`.
3. Double-click and run on any 64-bit Windows computer.

### Option 2: Run from Source
Prerequisites: [Node.js](https://nodejs.org/) (v18+)

```bash
# Clone the repository
git clone https://github.com/louisthegreat938-developer/CyberShield.git

# Navigate into the project
cd CyberShield

# Install runtime dependencies
npm install

# Launch Sentinel
npm start
```

# 🛡️ License
This project is licensed under the MIT License - see the LICENSE file for details.
