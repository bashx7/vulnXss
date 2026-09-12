// utils/renderLab.js - Renders standard ChatGPT-inspired lab workspace wrapper around any mini-app

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLabShell(lab, appHtml, options = {}) {
  const { customHead = '', nextLabUrl = '', prevLabUrl = '' } = options;
  const hintCount = (lab.hints && lab.hints.length) || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(lab.id)}: ${escapeHtml(lab.title)} — VulnXSS Training Lab</title>
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/lab-shell.css">

  <!-- ========================================================================= -->
  <!-- IGNORE: That's not part of Current lab (Platform XSS detector hook)       -->
  <!-- ========================================================================= -->
  <script src="/js/xss-detector.js"></script>

  ${customHead}
</head>
<body data-lab-id="${escapeHtml(lab.id)}">

  <!-- ========================================================================= -->
  <!-- IGNORE: That's not part of Current lab (Workspace UI navigation & drawers)-->
  <!-- ========================================================================= -->
  <!-- Sticky Lab Workspace Bar -->
  <header class="lab-workspace-bar">
    <div class="lab-bar-inner">
      <div class="lab-bar-left">
        <a href="/${escapeHtml(lab.category)}" class="lab-back-btn">
          ← ${escapeHtml(lab.categoryName)}
        </a>
        <div class="lab-bar-divider"></div>
        <div class="lab-meta-title">
          <span class="lab-id-chip">${escapeHtml(lab.id)}</span>
          <span class="lab-name-heading">${escapeHtml(lab.title)}</span>
          <span class="diff-badge diff-${escapeHtml(lab.difficulty)}">${escapeHtml(lab.difficulty)}</span>
          <span id="lab-status-badge" class="status-badge status-unsolved">Unsolved</span>
          <span class="lab-app-indicator">${escapeHtml(lab.appName)}</span>
        </div>
      </div>

      <div class="lab-bar-right">
        <button type="button" class="drawer-toggle-btn" data-target-drawer="drawer-story">
          <span>📋</span> Story & Target
        </button>
        <button type="button" class="drawer-toggle-btn" data-target-drawer="drawer-hints">
          <span>💡</span> Hints (${hintCount})
        </button>
        <button type="button" id="btn-solution-toggle" class="drawer-toggle-btn" data-target-drawer="drawer-solution">
          <span>🎯</span> Solution & Defense
        </button>
        <button type="button" id="btn-reset-lab" class="drawer-toggle-btn" title="Reset this lab's state and parameters">
          <span>🔄</span> Reset
        </button>
      </div>
    </div>
  </header>

  <!-- Top Floating Success Banner -->
  <div id="success-banner" class="success-banner">
    <div class="success-banner-inner">
      <div class="success-message-wrap">
        <div class="success-icon-badge">✓</div>
        <div>
          <div id="success-title" class="success-title">🎉 ✓ Lab Completed</div>
          <div id="success-subtitle" class="success-subtitle">XSS successfully demonstrated! Technique: ${escapeHtml(lab.technique)}</div>
        </div>
      </div>
      <div class="success-actions">
        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('btn-solution-toggle').click()">
          View Solution & Remediation
        </button>
        ${nextLabUrl ? `<a href="${nextLabUrl}" class="btn btn-primary btn-sm">Next Lab →</a>` : ''}
      </div>
    </div>
  </div>

  <!-- Drawers Backdrop -->
  <div id="lab-drawer-backdrop" class="lab-drawer-backdrop"></div>

  <!-- Drawer 1: Story & Target -->
  <aside id="drawer-story" class="lab-drawer">
    <div class="drawer-header">
      <div class="drawer-title">
        <span>📋</span> Lab Briefing & Fictional Target
      </div>
      <button type="button" class="drawer-close-btn" aria-label="Close drawer">✕</button>
    </div>
    <div class="drawer-body">
      <div class="story-card">
        <div class="story-badge">Fictional Application</div>
        <h3 style="margin-bottom: 6px; font-size: 16px;">${escapeHtml(lab.appName)}</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">${escapeHtml(lab.appTagline)}</p>
        <p class="story-text">${escapeHtml(lab.story)}</p>
      </div>

      <div class="objective-box">
        <div class="objective-title">🎯 Assessment Objective</div>
        <div class="objective-text">${escapeHtml(lab.objective)}</div>
      </div>

      <div style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
        <strong>Educational Guidance:</strong> Treat this lab like an authorized penetration test. Analyze user-controlled parameters, review browser source code and developer tools, and discover how input is handled.
      </div>
    </div>
  </aside>

  <!-- Drawer 2: Progressive Hints (Loaded on demand via API to prevent page source spoilers) -->
  <aside id="drawer-hints" class="lab-drawer">
    <div class="drawer-header">
      <div class="drawer-title">
        <span>💡</span> Progressive Hints (${hintCount})
      </div>
      <button type="button" class="drawer-close-btn" aria-label="Close drawer">✕</button>
    </div>
    <div class="drawer-body">
      <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
        Hints are loaded on demand to guide your reconnaissance without spoiling the raw page source.
      </p>
      <div id="hints-container" class="hints-container" data-hint-count="${hintCount}">
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
          <p>Click "Reveal Hint" to progressively unlock guidance.</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Drawer 3: Comprehensive Solution & Remediation (Loaded on demand via API to prevent page source spoilers) -->
  <aside id="drawer-solution" class="lab-drawer" style="width: 580px;">
    <div class="drawer-header">
      <div class="drawer-title">
        <span>🎯</span> Solution & Secure Remediation
      </div>
      <button type="button" class="drawer-close-btn" aria-label="Close drawer">✕</button>
    </div>
    <div class="drawer-body">
      <div id="solution-container" class="solution-container">
        <div style="text-align: center; padding: 32px 16px; color: var(--text-muted); font-size: 13px;">
          <div style="font-size: 32px; margin-bottom: 12px;">🔒</div>
          <h4 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Solution is Hidden</h4>
          <p style="margin-bottom: 18px; color: #64748b; max-width: 360px; margin-left: auto; margin-right: auto;">
            Solve the lab by executing XSS in the application below, or unlock the verified solution and payload on demand.
          </p>
          <button type="button" class="btn btn-primary" onclick="window.__loadLabSolution()">
            🔓 Reveal Verified Solution & Payload
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <main class="lab-app-container">
    ${appHtml}
  </main>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->

  <!-- Confetti Canvas -->
  <canvas id="confetti-canvas"></canvas>

  <!-- Centered Celebration Modal -->
  <div id="xss-celebration-modal" class="celebration-modal-backdrop">
    <div class="celebration-modal-card">
      <div class="celebration-confetti-badge">🎉 LAB COMPLETED!</div>
      <h2 class="celebration-title">XSS Successfully Demonstrated!</h2>
      <p class="celebration-subtitle">
        Vulnerability context verified: <strong>${escapeHtml(lab.technique)}</strong>
      </p>
      <div class="celebration-actions">
        <button type="button" class="btn btn-primary" onclick="document.getElementById('btn-solution-toggle').click(); window.__closeCelebration();">
          View Solution & Remediation →
        </button>
        ${nextLabUrl ? `<a href="${nextLabUrl}" class="btn btn-secondary">Next Lab →</a>` : ''}
        <button type="button" class="btn-text-close" onclick="window.__closeCelebration()">Continue Testing</button>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- IGNORE: That's not part of Current lab                                    -->
  <!-- ========================================================================= -->
  <script src="/js/lab-shell.js"></script>
  <script src="/js/lab-interactive.js"></script>
</body>
</html>`;
}

module.exports = {
  renderLabShell,
  escapeHtml
};
