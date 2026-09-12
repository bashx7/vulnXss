// public/js/xss-detector.js - Reliable XSS Execution Detection & Celebration Engine

(function() {
  // Store original native dialog functions
  const _originalAlert = window.alert;
  const _originalConfirm = window.confirm;
  const _originalPrompt = window.prompt;

  // Expose clean native dialogs for internal platform actions (reset confirmation, etc.)
  window._nativeAlert = _originalAlert;
  window._nativeConfirm = _originalConfirm;
  window._nativePrompt = _originalPrompt;

  // Canonical Lab ID Normalizer
  function normalizeLabId(id) {
    if (!id) return '';
    const match = String(id).toUpperCase().trim().match(/^(RXSS|SXSS|DOMXSS)[-_]?0*(\d+)$/);
    if (match) {
      return `${match[1]}-${match[2].padStart(2, '0')}`;
    }
    return String(id).toUpperCase().trim();
  }

  // Retrieve current lab ID
  function getCurrentLabId() {
    const bodyLabId = document.body ? document.body.dataset.labId : null;
    if (bodyLabId) return normalizeLabId(bodyLabId);
    const match = window.location.pathname.match(/\/(RXSS|SXSS|DOMXSS)\/lab(\d+)/i);
    if (match) {
      return normalizeLabId(`${match[1].toUpperCase()}-${match[2].padStart(2, '0')}`);
    }
    return null;
  }

  // Synthesized Fanfare Chime via Web Audio API
  window.playCelebrationChime = function() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz) chord fanfare
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.5);
      });
    } catch (e) {
      // Ignore audio context autoplay restrictions
    }
  };

  // Full-Screen Shower Confetti Cannon
  window.launchConfetti = function() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#14b8a6', '#f97316'];

    // Spawn 150 vibrant particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5,
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        r: Math.random() * 5 + 3,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        dx: (Math.random() - 0.5) * 4,
        dy: Math.random() * 4 + 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame;
    let frameCount = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      particles.forEach((p) => {
        p.y += p.dy;
        p.x += p.dx;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      });

      if (frameCount < 240) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  };

  // Trigger celebration UI
  function triggerCelebration(labId, source) {
    window.__justCompletedLab = true;

    // 1. Play audio chime
    if (window.playCelebrationChime) {
      window.playCelebrationChime();
    }

    // 2. Launch vibrant confetti
    if (window.launchConfetti) {
      window.launchConfetti();
    }

    // 3. Show top success banner
    const successBanner = document.getElementById('success-banner');
    if (successBanner) {
      successBanner.classList.add('visible');
      const titleEl = document.getElementById('success-title');
      const subEl = document.getElementById('success-subtitle');
      if (titleEl) titleEl.textContent = '🎉 ✓ Lab Completed!';
      if (subEl) subEl.textContent = `XSS successfully demonstrated via ${source}.`;
    }

    // 4. Unlock Solution button with glowing pulse
    const solutionBtn = document.getElementById('btn-solution-toggle');
    if (solutionBtn) {
      solutionBtn.classList.add('btn-solution-unlocked');
    }

    // 5. Open Centered Celebration Modal
    const modal = document.getElementById('xss-celebration-modal');
    if (modal) {
      modal.classList.add('active');
    }

    // 6. Update Header Status Badge
    const statusBadge = document.getElementById('lab-status-badge');
    if (statusBadge) {
      statusBadge.className = 'status-badge status-solved';
      statusBadge.textContent = '✓ Solved';
    }
  }

  // Handle triggered XSS
  function handleXSSExecution(source, message) {
    if (window.__isInternalPlatformAction) return;

    const labId = getCurrentLabId();
    console.log(`[VulnXSS Detector] XSS execution detected via ${source}:`, message);

    // Save to localStorage
    if (labId) {
      try {
        const solved = JSON.parse(localStorage.getItem('vulnxss_solved_labs') || '[]').map(normalizeLabId);
        if (!solved.includes(labId)) {
          solved.push(labId);
          localStorage.setItem('vulnxss_solved_labs', JSON.stringify(solved));
        }
      } catch (e) {}

      // Notify server
      fetch('/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId, source })
      }).catch(() => {});
    }

    // Execute celebration UI immediately or on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => triggerCelebration(labId, source), 50);
      });
    } else {
      setTimeout(() => triggerCelebration(labId, source), 50);
    }
  }

  // Hook window.alert
  window.alert = function(msg) {
    if (window.__isInternalPlatformAction) {
      return _originalAlert.apply(this, arguments);
    }
    let res;
    try {
      res = _originalAlert.apply(this, arguments);
    } finally {
      handleXSSExecution('alert()', msg);
    }
    return res;
  };

  // Hook window.confirm
  window.confirm = function(msg) {
    if (window.__isInternalPlatformAction) {
      return _originalConfirm.apply(this, arguments);
    }
    let res;
    try {
      res = _originalConfirm.apply(this, arguments);
    } finally {
      handleXSSExecution('confirm()', msg);
    }
    return res;
  };

  // Hook window.prompt
  window.prompt = function(msg, defaultText) {
    if (window.__isInternalPlatformAction) {
      return _originalPrompt.apply(this, arguments);
    }
    let res;
    try {
      res = _originalPrompt.apply(this, arguments);
    } finally {
      handleXSSExecution('prompt()', msg);
    }
    return res;
  };

  // Global helper for explicit verification or headless checks
  window.__triggerXSSSuccess = function(source = 'Custom Script Sink') {
    handleXSSExecution(source, 'Explicit Trigger');
  };
})();
