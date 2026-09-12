// public/js/progress.js - Handles real-time progress counters and solved badges

document.addEventListener('DOMContentLoaded', async () => {
  function normalizeLabId(id) {
    if (!id) return '';
    const match = String(id).toUpperCase().trim().match(/^(RXSS|SXSS|DOMXSS)[-_]?0*(\d+)$/);
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    }
    return String(id).toUpperCase().trim();
  }

  function getLocalSolvedLabs() {
    try {
      return JSON.parse(localStorage.getItem('vulnxss_solved_labs') || '[]').map(normalizeLabId);
    } catch (e) {
      return [];
    }
  }

  let solvedLabs = getLocalSolvedLabs();

  // Sync with server session
  try {
    const res = await fetch('/api/progress');
    const data = await res.json();
    if (data && Array.isArray(data.solved)) {
      const serverSolved = data.solved.map(normalizeLabId);
      serverSolved.forEach(id => {
        if (!solvedLabs.includes(id)) solvedLabs.push(id);
      });
      localStorage.setItem('vulnxss_solved_labs', JSON.stringify(solvedLabs));
    }
  } catch (err) {}

  function updateUI() {
    // 1. Update global progress text in nav
    const progressText = document.getElementById('global-progress-text');
    if (progressText) {
      progressText.textContent = `${solvedLabs.length}/24 Completed`;
    }

    // 2. Update category card solved counts on home
    const rxssCount = solvedLabs.filter(id => id.startsWith('RXSS')).length;
    const sxssCount = solvedLabs.filter(id => id.startsWith('SXSS')).length;
    const domxssCount = solvedLabs.filter(id => id.startsWith('DOMXSS')).length;

    const rxssEl = document.getElementById('cat-progress-rxss');
    if (rxssEl) rxssEl.textContent = `${rxssCount}/11 Completed`;

    const sxssEl = document.getElementById('cat-progress-sxss');
    if (sxssEl) sxssEl.textContent = `${sxssCount}/6 Completed`;

    const domxssEl = document.getElementById('cat-progress-domxss');
    if (domxssEl) domxssEl.textContent = `${domxssCount}/7 Completed`;

    // 3. Update individual lab badges on category pages
    document.querySelectorAll('[data-lab-row-id]').forEach(row => {
      const rawRowId = row.dataset.labRowId;
      const rowLabId = normalizeLabId(rawRowId);
      const statusEl = row.querySelector('.status-badge');
      if (statusEl) {
        if (solvedLabs.includes(rowLabId)) {
          statusEl.className = 'status-badge status-solved';
          statusEl.textContent = '✓ Solved';
        } else {
          statusEl.className = 'status-badge status-unsolved';
          statusEl.textContent = 'Unsolved';
        }
      }
    });
  }

  updateUI();

  // Global reset progress button if on home/category
  const resetAllBtn = document.getElementById('btn-reset-all-progress');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', async () => {
      const confirmFunc = window._nativeConfirm || window.confirm;
      if (!confirmFunc('Reset all completed lab progress and stored data across the entire platform?')) return;

      try {
        await fetch('/api/reset-all', { method: 'POST' });
      } catch (err) {}

      localStorage.removeItem('vulnxss_solved_labs');
      window.location.reload();
    });
  }
});
