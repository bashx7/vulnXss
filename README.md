# VulnXSS — Cross-Site Scripting Training Laboratory

A modern, web-based **XSS Training Laboratory** designed for the cybersecurity community. VulnXSS provides realistic, intentionally vulnerable web applications where security professionals, penetration testers, and developers can learn and practice Cross-Site Scripting (XSS) discovery, analysis, and exploitation in a controlled educational environment.

---

## 🌟 Key Features

- **24 Independent Mini-Applications**: Each challenge simulates a unique fictional web application (blogs, e-commerce, customer support, real estate, cloud dashboards, telehealth, etc.) with its own design, routing, parameters, and filtering logic.
- **ChatGPT-Inspired Clean UI**: Minimalist, bright theme with neutral palettes, clear typography, and generous spacing—no dark hacker clichés.
- **Three Complete XSS Categories**:
  - **Reflected XSS (`/RXSS`)**: 11 labs covering raw reflection, tag blacklists, JavaScript URLs, attribute breakouts, parentheses restrictions, function filtering, dynamic resolution, hidden parameters, and multi-step reconnaissance.
  - **Stored XSS (`/SXSS`)**: 6 labs covering persistent comment feeds, naive tag stripping, profile attributes, case-sensitive filters, unencoded administrative audit trails, and simulated privileged compliance bots.
  - **DOM-Based XSS (`/DOMXSS`)**: 7 labs covering `location.href`, query parameters, hash fragments, JSON transformations, multi-function data flow pipelines, flawed client-side regex filters, and dynamic state-store plugin evaluation.
- **Non-Intrusive Lab Workspace**: Sticky top navigation with collapsible drawers for **Story & Briefing**, **Progressive Hints (1–4)**, and **Comprehensive Solution & Remediation**.
- **Clear Source Code Boundaries**: When inspecting or viewing HTML page source (`Ctrl+U` / `Cmd+Option+U`), clear boundary comments demarcate the target lab's code from the platform shell:
  - `<!-- Focus: That's current lab code -->` marks the start of the target application.
  - `<!-- Current lab code is End Here -->` marks the end of the target application.
  - `<!-- IGNORE: That's not part of Current lab -->` marks platform workspace bars and detectors that are not part of the vulnerability.
- **Reliable Success Detection**: Interception of JavaScript dialog sinks (`alert`, `confirm`, `prompt`) and custom execution hooks, delivering instant feedback, confetti celebrations, and persistent completion badges.
- **Automated Verification Suite**: Built-in test suite verifying all 24 labs, status codes, and filtering behaviors.

---

## 🔍 How to Audit Lab Source Code (View Page Source)

When conducting source code analysis or inspecting elements in your browser developer tools:

```html
<!-- ========================================================================= -->
<!-- IGNORE: That's not part of Current lab (Platform XSS detector hook)       -->
<!-- ========================================================================= -->

<!-- ========================================================================= -->
<!-- Focus: That's current lab code                                            -->
<!-- ========================================================================= -->
<main class="lab-app-container">
  <!-- TARGET APPLICATION HTML, FORMS, SCRIPTS, AND PARAMETERS ARE HERE -->
</main>
<!-- ========================================================================= -->
<!-- Current lab code is End Here                                              -->
<!-- ========================================================================= -->

<!-- ========================================================================= -->
<!-- IGNORE: That's not part of Current lab                                    -->
<!-- ========================================================================= -->
```

> **Pro Tip for Learners:** Focus your vulnerability assessment, input injection points, and JavaScript reverse-engineering exclusively on the code between **`Focus: That's current lab code`** and **`Current lab code is End Here`**. Any script or wrapper outside these tags is part of the VulnXSS platform UI and can be ignored.

---

## 📋 Prerequisites

Before running VulnXSS on any computer, ensure you have the following installed:

1. **Git**: [Download Git](https://git-scm.com/downloads)
2. **Node.js** (v18.x or higher, LTS recommended): [Download Node.js](https://nodejs.org/) (includes `npm`)

To verify your installations, open your terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) and run:
```bash
git --version
node -v
npm -v
```

---

## 🚀 Quick Start (Installation & Setup)

### Step 1: Clone the Repository
Open your terminal or command prompt and clone this repository:
```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project directory:
```bash
cd vulnxss
```

### Step 2: Install Dependencies
Install the required Node.js packages:
```bash
npm install
```

### Step 3: Launch the Application
Start the VulnXSS server:
```bash
npm start
```

You will see the following output in your terminal:
```text
====================================================
 VulnXSS Training Laboratory Server Active!
 Access Platform: http://localhost:3000
 Reflected XSS:   http://localhost:3000/RXSS
 Stored XSS:      http://localhost:3000/SXSS
 DOM XSS:         http://localhost:3000/DOMXSS
====================================================
```

### Step 4: Open in Your Browser
Open any web browser and visit:
```text
http://localhost:3000
```

---

## 🧪 Running the Automated Test Suite

To verify that all 24 challenges, filtering engines, and HTTP routes are functioning properly:
```bash
npm test
```
All 48 automated test assertions will execute and output the validation results.

---

## 📚 Curriculum & Challenge Index

### ⚡ Reflected XSS (`/RXSS`)
| Lab ID | Title | Fictional Target | Concept / Context |
| :--- | :--- | :--- | :--- |
| **RXSS-01** | Basic Reflection | PulsePost Blog | Direct HTML reflection in `<b>USER_INPUT</b>` |
| **RXSS-02** | HTML Tag Filtering | FreshBlend Juice Co. | Blacklist blocking `<script>`, `<img>`, `<a>` with HTTP 403; bypass with `<svg>` |
| **RXSS-03** | JavaScript URL | Apex Support Portal | Reflection into `<a href="...">` return link |
| **RXSS-04** | Input Attribute Reflection | NovaHR Directory | Unescaped double quote breakout in `<input value="...">` |
| **RXSS-05** | Attribute Without `<` and `>` | SwiftTrack Logistics | Server strips `<` and `>`, but attribute event handlers remain exploitable |
| **RXSS-06** | Function Filtering | EchoFeedback Portal | Keywords `alert` and `prompt` are blocked; `confirm` allowed |
| **RXSS-07** | Keyword Sanitization | OmniMetrics Analytics | `alert`, `prompt`, `confirm` stripped; bypass with dynamic lookup `self['al'+'ert']()` |
| **RXSS-08** | Parentheses Restriction | CryptoCalc Discounts | Parentheses `()` rejected; bypass with tagged templates ``alert`1``` |
| **RXSS-09** | JavaScript Context | VibeStream Theme Studio | String variable breakout inside inline `<script>` configuration |
| **RXSS-10** | Hidden Parameter Recon | CloudPeak Telemetry | Auditing client JS reveals undocumented diagnostic parameter `debug_trace` |
| **RXSS-11** | Multi-Step Discovery | NextGen Enterprise | Recon chain: `robots.txt` → `/dev` → `/active` → `review.html?id=` |

---

### 💾 Stored / Persistent XSS (`/SXSS`)
| Lab ID | Title | Fictional Target | Concept / Context |
| :--- | :--- | :--- | :--- |
| **SXSS-01** | Basic Stored XSS | DevForum Community | Discussion comments stored raw and rendered directly to readers |
| **SXSS-02** | Stored HTML Context | RecipeShare Culinary | Naive single-pass script removal bypassed with nested tags `<scr<script>ipt>` |
| **SXSS-03** | Stored Attribute Context | Skyline Agent Directory | Stored website URL rendered into clickable profile link |
| **SXSS-04** | Stored XSS With Filtering | ShopNest Product Reviews | Case-sensitive blacklist for lowercase `script` and `onerror` |
| **SXSS-05** | Multiple Rendering Locations | Nexus CRM & Leads | Safe encoding on client profile, but raw unencoded rendering in internal Audit Log |
| **SXSS-06** | Privileged Viewer | CarePulse Telehealth Desk | Simulated compliance bot (Dr. Jenkins) reviews tickets with administrative cookies |

---

### 🌐 DOM-Based XSS (`/DOMXSS`)
| Lab ID | Title | Fictional Target | Concept / Context |
| :--- | :--- | :--- | :--- |
| **DOMXSS-01** | Location Source | AeroRoute Travel | Source: `window.location.href` → Sink: `breadcrumb.innerHTML` |
| **DOMXSS-02** | Query Parameter | DocsFlow Knowledge Base | Source: `URLSearchParams(?q=)` → Sink: `summary.innerHTML` |
| **DOMXSS-03** | Hash Fragment | Zenith Crypto Portfolio | Source: `window.location.hash` → Sink: `tabContent.innerHTML` |
| **DOMXSS-04** | JS Transformation | GlobalFx Currency Calc | Source: `?config=` → `JSON.parse()` → Sink: `promo.innerHTML` |
| **DOMXSS-05** | Source-to-Sink Analysis | TaskPilot Agile Board | 4-step processing pipeline: extract → normalize → compile → `innerHTML` |
| **DOMXSS-06** | Client-Side Filtering | SanitizePro Markdown | Flawed client regex only removes `<script>`, leaving event handlers intact |
| **DOMXSS-07** | Advanced DOM XSS | HyperApp Orchestrator | Reactive state store evaluates dynamic plugin hooks via `new Function` |

---

## 🔒 Security & Educational Disclaimer

> [!CAUTION]
> **FOR EDUCATIONAL AND TRAINING PURPOSES ONLY**
>
> The applications in this repository are **intentionally vulnerable** to Cross-Site Scripting (XSS).
> - All vulnerabilities are isolated strictly to their respective laboratory endpoints.
> - All data (names, tickets, telemetry, domains) is entirely fictional and synthetic.
> - Never deploy this application onto untrusted public networks or production environments without proper network isolation.
> - Always perform security testing exclusively in authorized, controlled training environments.

---


This project is intended for educational purposes.