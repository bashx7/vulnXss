// public/js/lab-shell.js - Lab Workspace Drawer & On-Demand Data Controller

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('lab-drawer-backdrop');
  const drawers = document.querySelectorAll('.lab-drawer');
  const toggleBtns = document.querySelectorAll('.drawer-toggle-btn');
  const closeBtns = document.querySelectorAll('.drawer-close-btn');
  const successBanner = document.getElementById('success-banner');
  const solutionBtn = document.getElementById('btn-solution-toggle');
  const statusBadge = document.getElementById('lab-status-badge');

  function normalizeLabId(id) {
    if (!id) return '';
    const match = String(id).toUpperCase().trim().match(/^(RXSS|SXSS|DOMXSS)[-_]?0*(\d+)$/);
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    }
    return String(id).toUpperCase().trim();
  }

  const rawLabId = document.body ? document.body.dataset.labId : '';
  const labId = normalizeLabId(rawLabId);

  let cachedHints = null;
  let cachedSolution = null;

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Check if lab was already solved (sync with localStorage and server)
  async function checkInitialStatus() {
    try {
      let solved = JSON.parse(localStorage.getItem('vulnxss_solved_labs') || '[]').map(normalizeLabId);
      
      // Sync with server session if available
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        if (data && Array.isArray(data.solved)) {
          const serverSolved = data.solved.map(normalizeLabId);
          // Merge unique
          serverSolved.forEach(id => {
            if (!solved.includes(id)) solved.push(id);
          });
          localStorage.setItem('vulnxss_solved_labs', JSON.stringify(solved));
        }
      } catch (err) {}

      if (solved.includes(labId)) {
        if (successBanner) {
          successBanner.classList.add('visible');
          const titleEl = document.getElementById('success-title');
          if (titleEl && !window.__justCompletedLab) {
            titleEl.textContent = '✓ Lab Previously Solved';
          }
        }
        if (solutionBtn) {
          solutionBtn.classList.add('btn-solution-unlocked');
        }
        if (statusBadge) {
          statusBadge.className = 'status-badge status-solved';
          statusBadge.textContent = '✓ Solved';
        }
      } else {
        if (statusBadge && !window.__justCompletedLab) {
          statusBadge.className = 'status-badge status-unsolved';
          statusBadge.textContent = 'Unsolved';
        }
      }
    } catch (e) {}
  }

  checkInitialStatus();

  // Close celebration modal helper
  window.__closeCelebration = function() {
    const modal = document.getElementById('xss-celebration-modal');
    if (modal) modal.classList.remove('active');
  };

  // Close all drawers
  function closeAllDrawers() {
    drawers.forEach(d => d.classList.remove('active'));
    toggleBtns.forEach(b => b.classList.remove('active'));
    if (backdrop) backdrop.classList.remove('active');
  }

  // Open specific drawer
  function openDrawer(drawerId) {
    const target = document.getElementById(drawerId);
    if (!target) return;

    const isOpen = target.classList.contains('active');
    closeAllDrawers();

    if (!isOpen) {
      target.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      const activeBtn = document.querySelector(`[data-target-drawer="${drawerId}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      if (drawerId === 'drawer-hints') {
        window.__loadLabHints();
      } else if (drawerId === 'drawer-solution') {
        // If lab is completed, automatically load solution
        const solved = JSON.parse(localStorage.getItem('vulnxss_solved_labs') || '[]').map(normalizeLabId);
        if (solved.includes(labId) || window.__justCompletedLab) {
          window.__loadLabSolution();
        }
      }
    }
  }

  // Bind toggle buttons
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetDrawer = btn.dataset.targetDrawer;
      openDrawer(targetDrawer);
    });
  });

  // Bind close buttons & backdrop click
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeAllDrawers);
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeAllDrawers);
  }

  // =========================================================================
  // On-Demand Hints Loader (Zero Raw Source Spoilers)
  // =========================================================================
  window.__loadLabHints = async function() {
    const container = document.getElementById('hints-container');
    if (!container) return;

    if (cachedHints) {
      renderHintsUI(cachedHints, container);
      return;
    }

    try {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#64748b; font-size:13px;">Loading hints securely...</div>';
      const res = await fetch(`/api/lab-data/${labId}/hints`);
      const data = await res.json();
      if (data.success && data.hints) {
        cachedHints = data.hints;
        renderHintsUI(cachedHints, container);
      } else {
        container.innerHTML = '<div style="color:#ef4444; padding:16px;">Failed to load hints.</div>';
      }
    } catch (e) {
      container.innerHTML = '<div style="color:#ef4444; padding:16px;">Error loading hints.</div>';
    }
  };

  function renderHintsUI(hints, container) {
    if (!hints || hints.length === 0) {
      container.innerHTML = '<div style="color:#64748b; padding:16px;">No specific hints for this challenge.</div>';
      return;
    }

    container.innerHTML = hints.map((hintText, idx) => `
      <div class="hint-card" id="hint-card-${idx}">
        <div class="hint-header">
          <span class="hint-title-text">
            <span>💡</span> Hint ${idx + 1}
          </span>
          <button type="button" class="btn-reveal-hint" onclick="window.__revealHint(${idx})">Reveal Hint</button>
          <span class="hint-status-pill hint-locked-pill" id="hint-pill-${idx}">Locked</span>
        </div>
        <div class="hint-body" id="hint-body-${idx}" style="display:none; padding:14px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:13px; color:#334155; line-height:1.6;">
          ${escapeHtml(hintText)}
        </div>
      </div>
    `).join('');
  }

  window.__revealHint = function(idx) {
    const body = document.getElementById(`hint-body-${idx}`);
    const pill = document.getElementById(`hint-pill-${idx}`);
    const btn = document.querySelector(`#hint-card-${idx} .btn-reveal-hint`);

    if (body) {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
      if (pill) {
        pill.textContent = 'Revealed';
        pill.className = 'hint-status-pill hint-revealed-pill';
      }
      if (btn) btn.style.display = 'none';
    }
  };

  // =========================================================================
  // On-Demand Solution Loader (Zero Raw Source Spoilers)
  // =========================================================================
  window.__loadLabSolution = async function() {
    const container = document.getElementById('solution-container');
    if (!container) return;

    if (cachedSolution) {
      renderSolutionUI(cachedSolution, container);
      return;
    }

    try {
      container.innerHTML = '<div style="text-align:center; padding:32px; color:#64748b; font-size:14px;">Retrieving verified solution & remediation...</div>';
      const res = await fetch(`/api/lab-data/${labId}/solution`);
      const data = await res.json();
      if (data.success && data.solution) {
        cachedSolution = data.solution;
        renderSolutionUI(cachedSolution, container);
      } else {
        container.innerHTML = '<div style="color:#ef4444; padding:20px;">Failed to retrieve solution.</div>';
      }
    } catch (e) {
      container.innerHTML = '<div style="color:#ef4444; padding:20px;">Error loading solution.</div>';
    }
  };

  function renderSolutionUI(sol, container) {
    const stepsHtml = (sol.steps || []).map(step => `<li>${escapeHtml(step)}</li>`).join('');

    container.innerHTML = `
      <div class="solution-section" style="animation: fadeIn 0.3s ease;">
        <div class="solution-field">
          <div class="solution-label">Vulnerability Location</div>
          <div class="solution-value"><code>${escapeHtml(sol.location)}</code></div>
        </div>

        <div class="solution-field">
          <div class="solution-label">Injection Context</div>
          <div class="solution-value">${escapeHtml(sol.context)}</div>
        </div>

        <div class="solution-field">
          <div class="solution-label">Why the Application is Vulnerable</div>
          <div class="solution-value">${escapeHtml(sol.whyVulnerable)}</div>
        </div>

        <div class="solution-field">
          <div class="solution-label">Filter & Sanitization Analysis</div>
          <div class="solution-value">${escapeHtml(sol.filterAnalysis)}</div>
        </div>

        <div class="solution-field">
          <div class="solution-label">Working Example Payload</div>
          <pre class="code-block" style="background:#0f172a; color:#38bdf8; padding:12px; border-radius:8px; font-family:monospace; font-size:13px; overflow-x:auto;"><code>${escapeHtml(sol.examplePayload)}</code></pre>
          ${sol.alternativePayload ? `<div style="font-size: 12px; color: #64748b; margin-top: 6px;">Alternative Vector: <code>${escapeHtml(sol.alternativePayload)}</code></div>` : ''}
        </div>

        <div class="solution-field">
          <div class="solution-label">Step-by-Step Reconnaissance & Exploitation</div>
          <ol class="step-list" style="padding-left:20px; font-size:13px; color:#334155; line-height:1.7;">
            ${stepsHtml}
          </ol>
        </div>

        <div class="solution-field">
          <div class="solution-label">Secure Remediation Guidance</div>
          <div class="solution-value">${escapeHtml(sol.defense)}</div>
        </div>

        <div class="solution-field">
          <div class="solution-label">Secure Code Example</div>
          <pre class="code-block" style="background:#0f172a; color:#4ade80; padding:12px; border-radius:8px; font-family:monospace; font-size:13px; overflow-x:auto;"><code>${escapeHtml(sol.secureCodeSnippet)}</code></pre>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Reset Lab State & Clear Solved Status (No False Celebration)
  // =========================================================================
  const resetBtn = document.getElementById('btn-reset-lab');
  if (resetBtn) {
    resetBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      // Ensure platform dialog never triggers XSS detector
      window.__isInternalPlatformAction = true;
      const confirmFunc = window._nativeConfirm || window.confirm;
      let confirmed = false;
      try {
        confirmed = confirmFunc('Reset this lab to its default state and mark it as unsolved?');
      } finally {
        window.__isInternalPlatformAction = false;
      }

      if (!confirmed) return;

      // 1. Immediately remove from localStorage
      try {
        let solved = JSON.parse(localStorage.getItem('vulnxss_solved_labs') || '[]').map(normalizeLabId);
        solved = solved.filter(id => id !== labId);
        localStorage.setItem('vulnxss_solved_labs', JSON.stringify(solved));
      } catch (err) {}

      // 2. Hide success banner, celebration modal & solution unlock
      window.__justCompletedLab = false;
      if (successBanner) successBanner.classList.remove('visible');
      if (solutionBtn) solutionBtn.classList.remove('btn-solution-unlocked');
      if (statusBadge) {
        statusBadge.className = 'status-badge status-unsolved';
        statusBadge.textContent = 'Unsolved';
      }
      if (window.__closeCelebration) window.__closeCelebration();

      // 3. Notify backend to clear server session & stored data
      try {
        await fetch(`/api/reset-lab/${labId}`, { method: 'POST' });
      } catch (err) {}

      // 4. Show non-intrusive toast and reload clean URL
      const toast = document.createElement('div');
      toast.className = 'reset-toast';
      toast.textContent = 'Lab reset to unsolved. Reloading pristine environment...';
      document.body.appendChild(toast);
      toast.style.display = 'block';

      setTimeout(() => {
        window.location.href = window.location.pathname;
      }, 350);
    });
  }
});
