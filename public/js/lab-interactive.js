// public/js/lab-interactive.js - Comprehensive Client-Side Interactivity for VulnXSS Mini-Applications

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // Global Notification & Modal Infrastructure
  // =========================================================================

  window.showAppToast = function(message, icon = '✓') {
    let toast = document.getElementById('app-interactive-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-interactive-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${message}</span>`;
    toast.classList.add('visible');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  };

  window.openAppModal = function(title, contentHtml) {
    let modal = document.getElementById('app-generic-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'app-generic-modal';
      modal.className = 'app-modal-backdrop';
      modal.innerHTML = `
        <div class="app-modal-card">
          <div class="app-modal-header">
            <h3 id="app-modal-title" style="font-size: 18px; font-weight: 700; color: #0f172a;"></h3>
            <button type="button" class="app-modal-close" onclick="window.closeAppModal()">✕</button>
          </div>
          <div id="app-modal-body" class="app-modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeAppModal();
      });
    }

    const titleEl = document.getElementById('app-modal-title');
    const bodyEl = document.getElementById('app-modal-body');
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = contentHtml;
    modal.classList.add('active');
  };

  window.closeAppModal = function() {
    const modal = document.getElementById('app-generic-modal');
    if (modal) modal.classList.remove('active');
  };

  // Post Like Interaction with state toggling
  window.togglePostLike = function(el, baseCount) {
    const isLiked = el.classList.contains('liked');
    const countEl = el.querySelector('.like-count');
    const labelEl = el.querySelector('.like-label');
    if (isLiked) {
      el.classList.remove('liked');
      el.style.color = '#64748b';
      if (countEl) countEl.textContent = baseCount;
      if (labelEl) labelEl.textContent = 'Like';
    } else {
      el.classList.add('liked');
      el.style.color = '#0a66c2';
      if (countEl) countEl.textContent = baseCount + 1;
      if (labelEl) labelEl.textContent = 'Liked';
      window.showAppToast('Liked post! (Total: ' + (baseCount + 1) + ')', '👍');
    }
  };

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[onclick*="classList.toggle"]')) {
      document.querySelectorAll('.pronet-dropdown-menu.active').forEach(m => m.classList.remove('active'));
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeAppModal();
    }
  });

  // =========================================================================
  // 1. PulsePost Blog (RXSS-01) - Full Article Reading & Dynamic Topic Filter
  // =========================================================================
  const pulseArticles = {
    k8s: {
      title: "Zero Trust Architecture in Kubernetes Clusters",
      category: "Cloud Security",
      topic: "Zero Trust Security",
      author: "Dr. Marcus Vance",
      readTime: "8 min read",
      date: "Published Yesterday",
      content: `
        <p>In modern microservice topologies, the traditional network perimeter has completely dissolved. Relying solely on ingress firewalls or flat container network interfaces (CNI) leaves east-west traffic vulnerable to lateral movement.</p>
        <h4 style="margin: 16px 0 8px; font-size: 15px; color: #0f172a;">Core Tenets of Cluster Zero Trust:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; margin-bottom: 16px;">
          <li><strong>Mutual TLS (mTLS):</strong> Enforce cryptographic identities on all service-to-service calls using SPIFFE/SPIRE attestations.</li>
          <li><strong>Layer 7 Authorization Policies:</strong> Define granular method-level RBAC rules instead of basic IP allowlists.</li>
          <li><strong>Continuous Verification:</strong> Rotate ephemeral certificates automatically every 12 hours.</li>
        </ul>
        <div style="background:#0f172a; color:#f8fafc; padding:14px; border-radius:8px; font-family:monospace; font-size:13px; margin:16px 0;">
apiVersion: security.istio.io/v1beta1<br>
kind: PeerAuthentication<br>
metadata:<br>
&nbsp;&nbsp;name: default<br>
&nbsp;&nbsp;namespace: production<br>
spec:<br>
&nbsp;&nbsp;mtls:<br>
&nbsp;&nbsp;&nbsp;&nbsp;mode: STRICT
        </div>
        <p style="margin-top: 14px;">By implementing strict mTLS across your service mesh, any compromised workload is prevented from pivoting to sensitive backend databases without verified identity tokens.</p>
      `
    },
    rust: {
      title: "Benchmarking Memory Footprints: Rust vs Go 1.24",
      category: "Runtimes",
      topic: "Rust & Low-Level",
      author: "Elena Rostova",
      readTime: "12 min read",
      date: "Published 3 days ago",
      content: `
        <p>We benchmarked sustained throughput and memory allocation under 50,000 concurrent gRPC connections comparing Go 1.24's modern concurrent garbage collector with Rust's zero-cost abstraction ownership model.</p>
        <h4 style="margin: 16px 0 8px; font-size: 15px; color: #0f172a;">Benchmark Findings:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; margin-bottom: 16px;">
          <li><strong>P99 Latency:</strong> Rust maintained sub-millisecond p99 latency (0.84ms) with zero GC pauses. Go 1.24 achieved an impressive 2.4ms with concurrent marking.</li>
          <li><strong>Resident Memory:</strong> Go's heap overhead stabilized around 184MB, whereas Rust's explicit lifetime allocations consumed only 28MB.</li>
        </ul>
        <div style="background:#0f172a; color:#f8fafc; padding:14px; border-radius:8px; font-family:monospace; font-size:13px; margin:16px 0;">
// Rust Zero-Allocation Ingress Buffer<br>
let mut stream = TcpStream::connect("127.0.0.1:8080").await?;<br>
let mut buffer = BytesMut::with_capacity(4096);<br>
stream.read_buf(&mut buffer).await?;
        </div>
      `
    },
    cloud: {
      title: "Building Multi-Region Distributed State Stores",
      category: "Architecture",
      topic: "Cloud Architecture",
      author: "David Miller",
      readTime: "10 min read",
      date: "Published 5 days ago",
      content: `
        <p>Designing active-active data stores spanning US-East, EU-Central, and AP-East requires strict consistency guarantees without compromising read latency for local edge workers.</p>
        <h4 style="margin: 16px 0 8px; font-size: 15px; color: #0f172a;">Key Architectural Strategies:</h4>
        <ul style="padding-left: 20px; line-height: 1.7; margin-bottom: 16px;">
          <li><strong>CRDT Conflict Resolution:</strong> Conflict-free replicated data types eliminate locking overhead for counter and set operations.</li>
          <li><strong>Raft Quorum Slicing:</strong> Segment state machines by tenant boundary to scale write throughput linearly.</li>
        </ul>
      `
    }
  };

  // Open article modal on card or button click
  document.querySelectorAll('.pulsepost-article-card, article').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't intercept search input
      if (e.target.tagName === 'INPUT') return;
      const key = card.dataset.category || (card.textContent.includes('Kubernetes') ? 'k8s' : (card.textContent.includes('Rust') ? 'rust' : 'cloud'));
      const article = pulseArticles[key] || pulseArticles.k8s;

      window.openAppModal(article.title, `
        <div style="margin-bottom: 16px; font-size: 13px; color: #64748b;">
          <span style="font-weight:600; color:#4f46e5;">${article.category}</span> • <span>${article.author}</span> • <span>${article.readTime}</span> • <span>${article.date}</span>
        </div>
        <div style="font-size: 14px; color: #334155; line-height: 1.7;">
          ${article.content}
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; color: #10b981; font-weight: 600;">✓ Verified Editorial Publication</span>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAppModal()">Back to Feed</button>
        </div>
      `);
    });
  });

  // PulsePost Topic Filter Pills
  const topicPills = document.querySelectorAll('.topic-filter-btn');
  topicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      topicPills.forEach(p => {
        p.style.color = '#475569';
        p.style.fontWeight = '500';
      });
      pill.style.color = '#4f46e5';
      pill.style.fontWeight = '700';

      const topicText = pill.textContent.trim();
      const articles = document.querySelectorAll('.pulsepost-article-card, article');
      
      articles.forEach(art => {
        if (topicText === 'All Articles') {
          art.style.display = 'flex';
        } else if (topicText === 'Cloud Architecture' || topicText === 'Kubernetes & Edge' || topicText === 'Zero Trust Security') {
          art.style.display = art.textContent.includes('Kubernetes') || art.textContent.includes('Cloud') ? 'flex' : 'none';
        } else if (topicText === 'Rust & Low-Level') {
          art.style.display = art.textContent.includes('Rust') ? 'flex' : 'none';
        } else {
          art.style.display = 'flex';
        }
      });

      window.showAppToast(`Category Filter: ${topicText}`, '📚');
    });
  });

  // =========================================================================
  // 2. Shopping Cart Handlers (RXSS-02 Juice & SXSS-04 ShopNest)
  // =========================================================================
  let cartItems = [];
  const isShopNest = window.location.pathname.includes('/SXSS/lab4');

  // Add to Cart Button Handlers
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim().includes('Add to Cart')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isShopNest) {
          window.showAppToast('Added to Cart! <a href="/SXSS/lab4?view=cart" style="color:#93c5fd;font-weight:700;margin-left:8px;text-decoration:underline;">View Cart (1) →</a>', '🛒');
        } else {
          const card = btn.closest('div[style*="border-radius: 14px"], .freshblend-card') || btn.parentElement.parentElement;
          const title = card ? card.querySelector('h3')?.textContent : 'Organic Cold-Pressed Juice';
          cartItems.push(title || 'Organic Juice');
          const counterEl = document.getElementById('juice-cart-count');
          if (counterEl) counterEl.textContent = cartItems.length;
          window.showAppToast(`Added ${title || 'Juice'} to cart!`, '🛒');
        }
      });
    }
  });

  // Juice Cart Modal Trigger
  const juiceCartBtn = document.getElementById('juice-cart-btn');
  if (juiceCartBtn) {
    juiceCartBtn.style.cursor = 'pointer';
    juiceCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemsList = cartItems.length > 0 
        ? cartItems.map((item, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f1f5f9; font-size:14px;">
              <span><strong>${i+1}.</strong> ${item}</span>
              <strong style="color:#166534;">$6.50</strong>
            </div>
          `).join('')
        : `<p style="font-size:14px; color:#64748b; text-align:center; padding:24px 0;">Your organic juice cart is currently empty.</p>`;

      const total = (cartItems.length * 6.5).toFixed(2);

      window.openAppModal('Your Shopping Cart', `
        <div>
          ${itemsList}
          ${cartItems.length > 0 ? `
            <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:16px; font-weight:700;">
              <span>Subtotal:</span>
              <span style="color:#166534;">$${total}</span>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
              <button class="btn btn-secondary" style="font-weight:600;" onclick="window.closeAppModal()">← Back to Store</button>
              <button class="btn btn-primary" style="flex:1; background:#16a34a; border-color:#16a34a; font-weight:700;" onclick="window.showAppToast('Order submitted! Cold-pressed juices will be express shipped on dry ice.', '🍃'); window.closeAppModal();">
                Checkout ($${total})
              </button>
            </div>
          ` : `
            <button class="btn btn-secondary" style="width:100%; margin-top:16px; font-weight:600;" onclick="window.closeAppModal()">← Back to Flavors</button>
          `}
        </div>
      `);
    });
  }

  // =========================================================================
  // 3. NovaHR Directory (RXSS-04) - Personnel Dossiers & Department Filtering
  // =========================================================================
  const hrFilterBtns = document.querySelectorAll('.hr-filter-btn');
  hrFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dept = btn.dataset.dept;
      hrFilterBtns.forEach(b => {
        b.style.background = '#fff';
        b.style.color = '#475569';
        b.style.border = '1px solid #cbd5e1';
      });
      btn.style.background = '#7c3aed';
      btn.style.color = '#fff';
      btn.style.border = '1px solid #7c3aed';

      document.querySelectorAll('.hr-person-card').forEach(card => {
        if (dept === 'all' || card.dataset.dept === dept) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      window.showAppToast(`Filtered by department: ${btn.textContent.trim()}`, '👥');
    });
  });

  document.querySelectorAll('.hr-person-card, button').forEach(el => {
    if (el.classList.contains('hr-person-card') || el.textContent.includes('View HR Dossier')) {
      el.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        const card = el.closest('.hr-person-card') || el;
        const isMarcus = card.textContent.includes('Marcus');
        
        if (isMarcus) {
          window.openAppModal('HR Personnel Dossier: Dr. Marcus Vance', `
            <div style="font-size:14px; color:#334155; line-height:1.6;">
              <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
                <div style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:20px;">MV</div>
                <div>
                  <h4 style="font-size:18px; font-weight:700; color:#0f172a;">Dr. Marcus Vance</h4>
                  <div style="font-size:13px; color:#6366f1; font-weight:600;">Principal Systems Architect • Employee #8942</div>
                </div>
              </div>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
                <div><strong>Email:</strong> m.vance@novahr.internal</div>
                <div><strong>Office:</strong> San Francisco Headquarters (Tower B, Floor 14)</div>
                <div><strong>Security Clearance:</strong> Level 4 (Production Cluster Root)</div>
              </div>
              <button class="btn btn-primary" style="width:100%; background:#7c3aed; border-color:#7c3aed;" onclick="window.showAppToast('Direct message channel opened'); window.closeAppModal();">Open Direct Message</button>
            </div>
          `);
        } else {
          window.openAppModal('HR Personnel Dossier: Elena Rostova', `
            <div style="font-size:14px; color:#334155; line-height:1.6;">
              <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
                <div style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,#059669,#10b981); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:20px;">ER</div>
                <div>
                  <h4 style="font-size:18px; font-weight:700; color:#0f172a;">Elena Rostova</h4>
                  <div style="font-size:13px; color:#059669; font-weight:600;">Lead Security Engineer • Employee #6120</div>
                </div>
              </div>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
                <div><strong>Email:</strong> e.rostova@novahr.internal</div>
                <div><strong>Office:</strong> Zurich Engineering Center (Suite 402)</div>
                <div><strong>Specialization:</strong> Application Security & Memory Safety</div>
              </div>
              <button class="btn btn-primary" style="width:100%; background:#059669; border-color:#059669;" onclick="window.showAppToast('Direct message channel opened'); window.closeAppModal();">Open Direct Message</button>
            </div>
          `);
        }
      });
    }
  });

  // =========================================================================
  // 4. NextGen Enterprise (RXSS-11) - SSO & Status Modals
  // =========================================================================
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Enterprise SSO Login')) {
      btn.addEventListener('click', () => {
        window.openAppModal('NextGen Enterprise Single Sign-On', `
          <div style="font-size:14px; color:#334155;">
            <p style="margin-bottom:16px; color:#64748b;">Authenticate using your corporate Okta / SAML 2.0 credentials:</p>
            <div style="margin-bottom:12px;">
              <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Corporate Email</label>
              <input type="email" placeholder="user@nextgen.enterprise" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
            </div>
            <div style="margin-bottom:16px;">
              <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Hardware Security Key / Password</label>
              <input type="password" placeholder="••••••••••••" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
            </div>
            <button class="btn btn-primary" style="width:100%; background:#0284c7; border-color:#0284c7;" onclick="window.showAppToast('Access Restricted: NextGen Staging clusters require active internal VPN tunnel.', '🔒'); window.closeAppModal();">Authenticate with SAML 2.0</button>
          </div>
        `);
      });
    }

    if (btn.textContent.includes('System Status')) {
      btn.addEventListener('click', () => {
        window.openAppModal('Cluster Deployment Status', `
          <div style="font-size:14px; color:#334155;">
            <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f1f5f9;">
              <span>API Gateway Mesh</span>
              <strong style="color:#10b981;">Operational (99.99%)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f1f5f9;">
              <span>Dev Staging Subsystem</span>
              <strong style="color:#0284c7;">Active (v3.1.2)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:10px 0; font-size:12px; color:#64748b; margin-top:10px;">
              <span>All pods nominal. Continuous automated regression tests running.</span>
            </div>
          </div>
        `);
      });
    }

    if (btn.textContent.includes('Select Flight')) {
      btn.addEventListener('click', () => {
        window.openAppModal('Flight Reservation Summary', `
          <div style="font-size:14px; color:#334155;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
              <div style="font-size:16px; font-weight:700; color:#0284c7; margin-bottom:4px;">Boeing 787-9 Dreamliner</div>
              <div style="color:#64748b;">Nonstop • Includes 2 Checked Bags & In-Flight Wi-Fi</div>
            </div>
            <div style="margin-bottom:14px;">
              <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px;">Passenger Full Legal Name</label>
              <input type="text" placeholder="As shown on passport" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
            </div>
            <button class="btn btn-primary" style="width:100%; background:#0284c7;" onclick="window.showAppToast('Seat confirmed! Electronic boarding pass emailed.', '✈️'); window.closeAppModal();">Confirm Seat Selection</button>
          </div>
        `);
      });
    }
  });

});
