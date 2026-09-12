// views/platformPages.js - Renders Platform Homepage and Category Collection Pages

const { escapeHtml } = require('../utils/renderLab');
const labsData = require('../data/labs');

function renderPlatformNav(activeTab = 'home') {
  return `
  <header class="platform-header">
    <div class="container nav-wrapper">
      <a href="/" class="brand-link">
        <div class="brand-logo-icon">X</div>
        <span>VulnXSS</span>
        <span class="brand-badge">Training Lab</span>
      </a>

      <nav class="main-nav-links">
        <a href="/" class="nav-item ${activeTab === 'home' ? 'active' : ''}">Overview</a>
        <a href="/RXSS" class="nav-item ${activeTab === 'RXSS' ? 'active' : ''}">Reflected XSS</a>
        <a href="/SXSS" class="nav-item ${activeTab === 'SXSS' ? 'active' : ''}">Stored XSS</a>
        <a href="/DOMXSS" class="nav-item ${activeTab === 'DOMXSS' ? 'active' : ''}">DOM XSS</a>
      </nav>

      <div class="nav-actions">
        <div class="progress-pill">
          <span class="progress-dot"></span>
          <span id="global-progress-text">0/24 Completed</span>
        </div>
      </div>
    </div>
  </header>`;
}

function renderPlatformFooter() {
  return `
  <footer class="platform-footer">
    <div class="container footer-content">
      <div>
        <strong>VulnXSS Educational Platform</strong> — Intentionally vulnerable applications for authorized cybersecurity training.
      </div>
      <div class="footer-links">
        <button id="btn-reset-all-progress" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:13px; text-decoration:underline;">
          Reset All Progress
        </button>
        <a href="https://owasp.org/www-community/attacks/xss/" target="_blank" rel="noreferrer" class="footer-link">OWASP XSS Guide</a>
      </div>
    </div>
  </footer>`;
}

function renderHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VulnXSS — Professional Cross-Site Scripting Training Laboratory</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  ${renderPlatformNav('home')}

  <main class="container">
    <section class="hero-section">
      <div class="hero-tagline">
        <span>🛡️</span> Controlled Vulnerability Practice
      </div>
      <h1 class="hero-title">XSS Training Lab</h1>
      <p class="hero-subtitle">
        Master Cross-Site Scripting by analyzing, auditing, and exploiting 24 realistic fictional web applications across Reflected, Stored, and DOM contexts.
      </p>
    </section>

    <!-- 3 Main Category Cards -->
    <section class="category-grid">
      <!-- Reflected XSS Card -->
      <a href="/RXSS" class="category-card">
        <div class="cat-icon-wrap">⚡</div>
        <h2 class="cat-title">Reflected XSS</h2>
        <p class="cat-desc">
          User-controlled input is immediately reflected into server responses. Explore tag filtering, attribute injection, keyword blacklists, parentheses-free execution, and multi-step fuzzing.
        </p>
        <div class="cat-footer">
          <span class="cat-count">11 Challenges</span>
          <span id="cat-progress-rxss" style="font-size: 12px; color: var(--text-secondary);">0/11 Completed</span>
          <span class="cat-action">Explore /RXSS →</span>
        </div>
      </a>

      <!-- Stored XSS Card -->
      <a href="/SXSS" class="category-card">
        <div class="cat-icon-wrap">💾</div>
        <h2 class="cat-title">Stored XSS</h2>
        <p class="cat-desc">
          Injected scripts persist inside databases, feeds, and configurations. Audit thread comments, nested tag strips, unencoded audit logs, and simulated administrative bot reviews.
        </p>
        <div class="cat-footer">
          <span class="cat-count">6 Challenges</span>
          <span id="cat-progress-sxss" style="font-size: 12px; color: var(--text-secondary);">0/6 Completed</span>
          <span class="cat-action">Explore /SXSS →</span>
        </div>
      </a>

      <!-- DOM XSS Card -->
      <a href="/DOMXSS" class="category-card">
        <div class="cat-icon-wrap">🌐</div>
        <h2 class="cat-title">DOM XSS</h2>
        <p class="cat-desc">
          Vulnerabilities executed entirely in client-side JavaScript. Trace execution flows from location sources, query params, hash fragments, JSON transforms, and state stores to DOM sinks.
        </p>
        <div class="cat-footer">
          <span class="cat-count">7 Challenges</span>
          <span id="cat-progress-domxss" style="font-size: 12px; color: var(--text-secondary);">0/7 Completed</span>
          <span class="cat-action">Explore /DOMXSS →</span>
        </div>
      </a>
    </section>

    <!-- Methodology Overview -->
    <section class="methodology-box">
      <h3 class="methodology-title">Standard Penetration Testing Methodology</h3>
      <p class="methodology-desc">
        VulnXSS teaches you how to think like a professional security consultant. Rather than blind payload guessing, every lab encourages this systematic assessment workflow:
      </p>
      <div class="methodology-steps">
        <div class="step-chip">
          <span class="step-chip-num">1</span>
          <span>Reconnaissance</span>
        </div>
        <span class="step-arrow">→</span>

        <div class="step-chip">
          <span class="step-chip-num">2</span>
          <span>Identify Input Points</span>
        </div>
        <span class="step-arrow">→</span>

        <div class="step-chip">
          <span class="step-chip-num">3</span>
          <span>Determine Context</span>
        </div>
        <span class="step-arrow">→</span>

        <div class="step-chip">
          <span class="step-chip-num">4</span>
          <span>Analyze Filtering</span>
        </div>
        <span class="step-arrow">→</span>

        <div class="step-chip">
          <span class="step-chip-num">5</span>
          <span>Craft Payload</span>
        </div>
        <span class="step-arrow">→</span>

        <div class="step-chip">
          <span class="step-chip-num">6</span>
          <span>Verify Execution</span>
        </div>
      </div>
    </section>
  </main>

  ${renderPlatformFooter()}
  <script src="/js/progress.js"></script>
</body>
</html>`;
}

function renderCategoryPage(categoryKey) {
  const labs = labsData[categoryKey] || [];
  const categoryNames = {
    RXSS: {
      title: "Reflected XSS",
      desc: "Reflected Cross-Site Scripting arises when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way.",
      prefix: "/RXSS"
    },
    SXSS: {
      title: "Stored / Persistent XSS",
      desc: "Stored Cross-Site Scripting arises when an application receives input from an untrusted source and includes that data within its later HTTP responses in an unsafe way.",
      prefix: "/SXSS"
    },
    DOMXSS: {
      title: "DOM-Based XSS",
      desc: "DOM-based XSS occurs when an application contains client-side JavaScript that processes data from an untrusted source in an unsafe way, usually by writing the data to an execution sink.",
      prefix: "/DOMXSS"
    }
  };

  const catInfo = categoryNames[categoryKey] || { title: categoryKey, desc: "", prefix: "" };

  const labRowsHtml = labs.map(lab => `
    <a href="${catInfo.prefix}/lab${lab.number}" class="lab-row-card" data-lab-row-id="${escapeHtml(lab.id)}">
      <div class="lab-row-left">
        <span class="lab-number-badge">${escapeHtml(lab.id)}</span>
        <div class="lab-info-main">
          <div class="lab-title-row">
            <span class="lab-title-text">${escapeHtml(lab.title)}</span>
            <span class="lab-app-pill">${escapeHtml(lab.appName)}</span>
          </div>
          <p class="lab-short-desc">${escapeHtml(lab.description)}</p>
        </div>
      </div>

      <div class="lab-row-right">
        <span class="diff-badge diff-${escapeHtml(lab.difficulty)}">${escapeHtml(lab.difficulty)}</span>
        <span class="status-badge status-unsolved">Unsolved</span>
      </div>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(catInfo.title)} — VulnXSS Training Laboratory</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  ${renderPlatformNav(categoryKey)}

  <main class="container">
    <div class="category-header">
      <div class="category-breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>${escapeHtml(catInfo.title)}</span>
      </div>
      <h1 class="cat-page-title">${escapeHtml(catInfo.title)}</h1>
      <p class="cat-page-desc">${escapeHtml(catInfo.desc)}</p>
    </div>

    <section class="labs-list">
      ${labRowsHtml}
    </section>
  </main>

  ${renderPlatformFooter()}
  <script src="/js/progress.js"></script>
</body>
</html>`;
}

module.exports = {
  renderHomePage,
  renderCategoryPage
};
