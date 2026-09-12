// routes/sxss.js - Comprehensive Multi-View Implementation of all 6 Stored XSS Mini-Applications

const express = require('express');
const router = express.Router();
const labsData = require('../data/labs');
const { renderLabShell, escapeHtml } = require('../utils/renderLab');
const { renderCategoryPage } = require('../views/platformPages');

const SXSS_LABS = labsData.SXSS;

function getLab(num) {
  return SXSS_LABS.find(l => l.number === num);
}

// In-Memory Data Stores with Rich Default Data
const labStores = {
  lab1: [
    { 
      id: 1,
      author: "Alex Turner", 
      headline: "Staff SRE @ CloudSphere | Distributed Systems & K8s", 
      content: "Excited to share our team's latest benchmark on graceful termination in container topologies. Draining WebSockets properly before SIGKILL drops latency spikes by 94%!", 
      date: "2 hours ago",
      likes: 42,
      comments: [
        { author: "Marcus Vance", text: "Great insights! Did you test this with Istio sidecars enabled?" },
        { author: "Elena Rostova", text: "Impressive numbers Alex. What was the CPU throttle overhead?" }
      ]
    },
    { 
      id: 2,
      author: "Sarah Chen", 
      headline: "VP of Engineering @ FintechCore", 
      content: "We are actively hiring Senior Backend Engineers experienced with Rust, Go microservices, and distributed consensus. DM me or check our careers page!", 
      date: "Yesterday",
      likes: 89,
      comments: [
        { author: "Alex Turner", text: "Awesome team! Highly recommend working with Sarah." }
      ]
    },
    { 
      id: 3,
      author: "Dr. Marcus Vance", 
      headline: "Principal Systems Architect @ NovaHR", 
      content: "Zero Trust isn't just a network perimeter policy—it begins with cryptographic workload identities and SPIFFE/SPIRE attestations at the kernel level.", 
      date: "2 days ago",
      likes: 64,
      comments: []
    }
  ],
  lab1_user: {
    name: "Alex Turner",
    headline: "Staff SRE @ CloudSphere | Distributed Systems & K8s",
    bio: "Passionate about high-throughput distributed consensus, Rust networking, and Linux kernel eBPF observability.",
    company: "CloudSphere Systems",
    location: "San Francisco, CA",
    connections: 482
  },
  lab2: [
    { 
      id: 1,
      author: "Chef Gordon", 
      board: "Artisan Pastas", 
      pin_title: "Classic Basil Pesto Genovese",
      note: "A pinch of toasted pine nuts and cold-pressed olive oil emulsified to silky perfection.", 
      image: "🌿",
      date: "2 days ago",
      saves: 124
    },
    { 
      id: 2,
      author: "Elena Rostova", 
      board: "Dessert Concepts", 
      pin_title: "Dark Chocolate Fondant with Sea Salt",
      note: "Bake at 200°C for exactly 9 minutes for a molten lava core.", 
      image: "🍫",
      date: "Yesterday",
      saves: 88
    },
    { 
      id: 3,
      author: "Kenji Sato", 
      board: "Modern Architecture", 
      pin_title: "Brutalist Concrete Loft in Kyoto",
      note: "Minimalist natural light voids paired with raw cedar timber accents.", 
      image: "🏛️",
      date: "3 days ago",
      saves: 215
    }
  ],
  lab3: {
    name: "Sarah Lin",
    title: "Senior Commercial Broker",
    relationship: "Single",
    workplace: "Skyline Commercial Realty",
    website: "https://sarahlin-realty.example.com",
    bio: "Specializing in luxury corporate headquarters and commercial office towers across downtown Manhattan.",
    hobbies: "Architectural photography, Sailing, Urban Design",
    posts: [
      { 
        id: 1, 
        author: "Sarah Lin",
        text: "Just closed the commercial lease on the 48th floor of the Midtown Apex Tower! Stunning views of the Hudson River.", 
        time: "3 hours ago", 
        likes: 18,
        comments: [
          { author: "David Miller", text: "Huge congratulations Sarah! Well deserved." }
        ]
      },
      { 
        id: 2, 
        author: "David Miller",
        text: "Keynote presentation at Global FinTech Summit wrapped up. Great discussions on compliance automation!", 
        time: "Yesterday", 
        likes: 34,
        comments: []
      }
    ]
  },
  lab4: [
    { 
      author: "TechBuyer88", 
      orderId: "ORD-94102",
      rating: "5/5", 
      title: "Best ANC headphones I've tested this year",
      review: "Crisp sound quality, deep bass response, and 45 hours of real-world battery life on transatlantic flights.", 
      date: "3 days ago" 
    },
    { 
      author: "AudioEnthusiast", 
      orderId: "ORD-88194",
      rating: "4/5", 
      title: "Super comfortable for long coding sessions",
      review: "Memory foam earcups don't clamp too tightly. Multipoint Bluetooth switching works seamlessly between MacBook and phone.", 
      date: "5 days ago" 
    }
  ],
  lab5: {
    clientName: "Acme Global Dynamics",
    contactEmail: "procurement@acme.example.com",
    phone: "+1 (555) 019-2834",
    assignedRep: "David Miller (Enterprise Lead)",
    statusNote: "Contract renewal pending legal signoff.",
    auditLogs: [
      { timestamp: "2026-09-10 10:14:02", actor: "System Provisioner", status: "Account created under Enterprise Tier" },
      { timestamp: "2026-09-10 14:22:18", actor: "David Miller", status: "Contract renewal pending legal signoff." }
    ]
  },
  lab6: [
    { 
      id: 1041, 
      patient: "Anonymous Patient #884", 
      department: "Neurology Triage",
      urgency: "Medium Priority",
      title: "Portal login biometric prompt timeout", 
      description: "Biometric login keeps timing out on mobile iOS 18 when accessing electronic health records.", 
      status: "Reviewed by Dr. Jenkins", 
      timestamp: "Today, 09:15 UTC" 
    },
    { 
      id: 1042, 
      patient: "Patient Ref #319", 
      department: "Cardiology Care",
      urgency: "High Priority",
      title: "Holter monitor sync telemetry latency", 
      description: "Nightly ECG readings are delayed by 4 hours during peak server ingestion sync.", 
      status: "Awaiting Review", 
      timestamp: "Today, 11:30 UTC" 
    }
  ]
};

// Reset Helper for Stored Labs
function resetLabStore(num) {
  const n = parseInt(num, 10);
  if (n === 1) {
    labStores.lab1 = [
      { id: 1, author: "Alex Turner", headline: "Staff SRE @ CloudSphere | Distributed Systems & K8s", content: "Excited to share our team's latest benchmark on graceful termination in container topologies!", date: "2 hours ago", likes: 42, comments: [] },
      { id: 2, author: "Sarah Chen", headline: "VP of Engineering @ FintechCore", content: "We are actively hiring Senior Backend Engineers experienced with Rust and Go.", date: "Yesterday", likes: 89, comments: [] }
    ];
    labStores.lab1_user = {
      name: "Alex Turner",
      headline: "Staff SRE @ CloudSphere | Distributed Systems & K8s",
      bio: "Passionate about high-throughput distributed consensus, Rust networking, and Linux kernel eBPF observability.",
      company: "CloudSphere Systems",
      location: "San Francisco, CA",
      connections: 482
    };
  } else if (n === 2) {
    labStores.lab2 = [
      { id: 1, author: "Chef Gordon", board: "Artisan Pastas", pin_title: "Classic Basil Pesto Genovese", note: "A pinch of toasted pine nuts and cold-pressed olive oil emulsified to silky perfection.", image: "🌿", date: "2 days ago", saves: 124 },
      { id: 2, author: "Elena Rostova", board: "Dessert Concepts", pin_title: "Dark Chocolate Fondant with Sea Salt", note: "Bake at 200°C for exactly 9 minutes for a molten lava core.", image: "🍫", date: "Yesterday", saves: 88 }
    ];
  } else if (n === 3) {
    labStores.lab3 = {
      name: "Sarah Lin",
      title: "Senior Commercial Broker",
      relationship: "Single",
      workplace: "Skyline Commercial Realty",
      website: "https://sarahlin-realty.example.com",
      bio: "Specializing in luxury corporate headquarters and commercial office towers across downtown Manhattan.",
      hobbies: "Architectural photography, Sailing, Urban Design",
      posts: [
        { id: 1, author: "Sarah Lin", text: "Just closed the commercial lease on the 48th floor of the Midtown Apex Tower!", time: "3 hours ago", likes: 18, comments: [] }
      ]
    };
  } else if (n === 4) {
    labStores.lab4 = [
      { author: "TechBuyer88", orderId: "ORD-94102", rating: "5/5", title: "Best ANC headphones I've tested this year", review: "Crisp sound quality, deep bass response, and 45 hours battery life.", date: "3 days ago" }
    ];
  } else if (n === 5) {
    labStores.lab5 = {
      clientName: "Acme Global Dynamics",
      contactEmail: "procurement@acme.example.com",
      phone: "+1 (555) 019-2834",
      assignedRep: "David Miller (Enterprise Lead)",
      statusNote: "Contract renewal pending legal signoff.",
      auditLogs: [
        { timestamp: "2026-09-10 10:14:02", actor: "System Provisioner", status: "Account created under Enterprise Tier" }
      ]
    };
  } else if (n === 6) {
    labStores.lab6 = [
      { id: 1041, patient: "Anonymous Patient #884", department: "Neurology Triage", urgency: "Medium Priority", title: "Portal login biometric prompt timeout", description: "Biometric login keeps timing out on mobile iOS 18.", status: "Reviewed by Dr. Jenkins", timestamp: "Today, 09:15 UTC" }
    ];
  }
}

router.resetLabStore = resetLabStore;

// Reset Endpoint for Stored Labs
router.post('/reset/:labNum', (req, res) => {
  const num = parseInt(req.params.labNum, 10);
  resetLabStore(num);
  res.json({ success: true, message: `Lab ${num} data reset to defaults.` });
});

// Category Collection Page: /SXSS
router.get('/', (req, res) => {
  res.send(renderCategoryPage('SXSS'));
});

// =========================================================================
// LAB 1: Basic Stored XSS — ProNet Professional Social Network (LinkedIn Clone)
// =========================================================================
router.get('/lab1', (req, res) => {
  const lab = getLab(1);
  const view = req.query.view || 'feed';
  const user = labStores.lab1_user;

  // Render Post Feeds
  const postsHtml = labStores.lab1.map(p => `
    <div class="pronet-post-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #0a66c2, #0077b5); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
            ${escapeHtml((p.author || 'User').slice(0,2).toUpperCase())}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 15px; color: #0f172a;">${escapeHtml(p.author)}</div>
            <!-- Unescaped Stored Headline Sink -->
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${p.headline || ''}</div>
          </div>
        </div>
        <span style="font-size: 12px; color: #94a3b8;">${escapeHtml(p.date || 'Just now')}</span>
      </div>

      <!-- Post Body Content -->
      <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 14px;">
        ${escapeHtml(p.content)}
      </div>

      <!-- Post Actions -->
      <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; display: flex; gap: 24px; font-size: 13px; color: #64748b; font-weight: 600;">
        <span class="pronet-like-btn" style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.togglePostLike(this, ${p.likes || 0})">
          <span>👍</span> <span class="like-label">Like</span> (<span class="like-count">${p.likes || 0}</span>)
        </span>
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="document.getElementById('comment-thread-${p.id || 0}').classList.toggle('active')">
          <span>💬</span> Comment (${p.comments ? p.comments.length : 0})
        </span>
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.showAppToast('Post shared to your network!', '🔄')">
          <span>🔄</span> Repost
        </span>
      </div>

      <!-- Comment Thread Section -->
      <div id="comment-thread-${p.id || 0}" class="pronet-comment-thread" style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #f8fafc;">
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
          ${(p.comments && p.comments.length > 0) ? p.comments.map(c => `
            <div style="background: #f8fafc; border-radius: 8px; padding: 10px 14px; font-size: 13px; border: 1px solid #edf2f7;">
              <strong style="color: #0f172a;">${escapeHtml(c.author)}:</strong> <span style="color: #475569;">${c.text}</span>
            </div>
          `).join('') : '<div style="font-size: 12px; color: #94a3b8; font-style: italic;">No comments yet. Be the first to share your thoughts!</div>'}
        </div>
        <form method="POST" action="/SXSS/lab1/comment" style="display: flex; gap: 8px;">
          <input type="text" name="author" placeholder="Your Name" value="${escapeHtml(user.name)}" required style="width: 130px; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; outline: none;">
          <input type="text" name="content" placeholder="Add a comment..." required style="flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; outline: none;">
          <button type="submit" class="btn btn-sm btn-primary" style="background: #0a66c2; border-color: #0a66c2; font-weight: 600; padding: 0 16px;">Reply</button>
        </form>
      </div>
    </div>
  `).join('');

  // 1. News Feed View
  const feedHtml = `
  <div style="display: grid; grid-template-columns: 240px 1fr 240px; gap: 20px;">
    <!-- Left Profile Card -->
    <div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03); margin-bottom: 16px;">
        <div style="height: 60px; background: linear-gradient(135deg, #0a66c2, #0077b5);"></div>
        <div style="padding: 0 16px 16px; text-align: center; position: relative;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #ffffff; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin: -26px auto 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0a66c2; font-size: 18px;">
            AT
          </div>
          <div style="font-weight: 700; font-size: 15px; color: #0f172a;">${escapeHtml(user.name)}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 3px; line-height: 1.4;">${user.headline}</div>
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
            <span>Profile viewers</span>
            <strong style="color: #0a66c2;">128</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-top: 4px;">
            <span>Connections</span>
            <strong style="color: #0a66c2;">${user.connections}</strong>
          </div>
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
            <a href="/SXSS/lab1?view=profile" style="font-size: 12px; font-weight: 700; color: #0a66c2; text-decoration: none;">View Full Profile →</a>
          </div>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 13px;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 10px;">Quick Shortcuts</div>
        <div style="display: flex; flex-direction: column; gap: 8px; color: #475569;">
          <a href="/SXSS/lab1?view=network" style="color: #475569; text-decoration: none;">👥 My Network (482)</a>
          <a href="/SXSS/lab1?view=notifications" style="color: #475569; text-decoration: none;">🔔 Notifications (4)</a>
          <a href="/SXSS/lab1?view=profile" style="color: #475569; text-decoration: none;">👤 Public Profile</a>
        </div>
      </div>
    </div>

    <!-- Center Feed & Posts -->
    <div>
      <!-- Share an Update Composer -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #0a66c2; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">AT</div>
          <div style="font-weight: 600; font-size: 14px; color: #64748b;">What project or insight are you working on today?</div>
        </div>
        <form method="POST" action="/SXSS/lab1/post">
          <input type="hidden" name="author" value="${escapeHtml(user.name)}">
          <input type="hidden" name="headline" value="${escapeHtml(user.headline)}">
          <textarea name="content" rows="2" placeholder="Write a post or share an update with your connections..." required
                    style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 10px;"></textarea>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px; font-size: 12px; color: #64748b; font-weight: 600;">
              <span style="cursor: pointer;" onclick="window.showAppToast('Image upload available in Enterprise tier', '📷')">📷 Photo</span>
              <span style="cursor: pointer;" onclick="window.showAppToast('Video upload available in Enterprise tier', '🎥')">🎥 Video</span>
              <span style="cursor: pointer;" onclick="window.showAppToast('Article draft initialized', '📝')">📝 Article</span>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" style="background: #0a66c2; border-color: #0a66c2; font-weight: 700; padding: 6px 18px;">Publish</button>
          </div>
        </form>
      </div>

      <!-- Timeline Stream -->
      <div>
        ${postsHtml}
      </div>
    </div>

    <!-- Right Sidebar: ProNet News -->
    <div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">ProNet Tech News</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 12px;">
          <div>
            <div style="font-weight: 600; color: #0f172a; line-height: 1.4;">• Kubernetes v1.32 Ingress Updates</div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">4,812 readers</div>
          </div>
          <div>
            <div style="font-weight: 600; color: #0f172a; line-height: 1.4;">• Zero-Day Advisory in Legacy CNI Drivers</div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">9,120 readers</div>
          </div>
          <div>
            <div style="font-weight: 600; color: #0f172a; line-height: 1.4;">• Memory Safety Benchmarks: Rust vs Go</div>
            <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">12,450 readers</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // 2. Full Profile View (LinkedIn style)
  const profileHtml = `
  <div style="max-width: 800px; margin: 0 auto;">
    <!-- Profile Card Header -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
      <div style="height: 140px; background: linear-gradient(135deg, #0a66c2, #0284c7);"></div>
      <div style="padding: 0 28px 28px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: -48px; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div style="width: 96px; height: 96px; border-radius: 50%; background: #ffffff; border: 4px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #0a66c2;">
            AT
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="/SXSS/lab1?view=settings" class="btn btn-secondary btn-sm" style="font-weight: 600; border-radius: 999px; padding: 6px 18px;">
              ✏️ Edit Intro & Headline
            </a>
          </div>
        </div>

        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${escapeHtml(user.name)}</h1>
        <!-- Stored Headline reflection sink -->
        <div style="font-size: 15px; color: #475569; font-weight: 500; line-height: 1.5; margin-bottom: 8px;">${user.headline}</div>
        <div style="font-size: 13px; color: #64748b;">${escapeHtml(user.location)} • <span style="color: #0a66c2; font-weight: 600;">${user.connections} connections</span></div>

        <div style="margin-top: 20px; display: flex; gap: 10px;">
          <button class="btn btn-primary btn-sm" style="background: #0a66c2; border-color: #0a66c2; border-radius: 999px; font-weight: 600; padding: 6px 16px;">Open to Work</button>
          <button class="btn btn-secondary btn-sm" style="border-radius: 999px; font-weight: 600; padding: 6px 16px;" onclick="window.showAppToast('Profile section tools active', '✓')">Add Profile Section</button>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="font-size: 17px; font-weight: 700; color: #0f172a;">About</h2>
        <a href="/SXSS/lab1?view=settings" style="font-size: 13px; color: #0a66c2; text-decoration: none; font-weight: 600;">✏️ Edit</a>
      </div>
      <p style="font-size: 14px; color: #334155; line-height: 1.7;">${escapeHtml(user.bio)}</p>
    </div>

    <!-- Experience Timeline -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
      <h2 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Experience</h2>
      <div style="display: flex; gap: 14px; margin-bottom: 16px;">
        <div style="width: 44px; height: 44px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #0a66c2;">🏢</div>
        <div>
          <div style="font-weight: 700; font-size: 15px; color: #0f172a;">Staff Site Reliability Engineer</div>
          <div style="font-size: 13px; color: #475569;">${escapeHtml(user.company)} • Full-time</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">2023 - Present • 3 yrs • San Francisco, CA</div>
        </div>
      </div>
    </div>
  </div>`;

  // 3. Settings / Profile Editor View
  const settingsHtml = `
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a;">Edit Intro & Public Profile</h2>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Update your professional credentials visible across the ProNet global directory.</p>
    </div>

    <form method="POST" action="/SXSS/lab1/update-profile">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">First & Last Name</label>
          <input type="text" name="name" value="${escapeHtml(user.name)}" required
                 style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Current Organization</label>
          <input type="text" name="company" value="${escapeHtml(user.company)}" required
                 style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">Professional Headline (Appears under your name on all posts)</label>
        <input type="text" name="headline" value="${escapeHtml(user.headline)}" placeholder="e.g. Principal Security Architect | Distributed Systems" required
               style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px;">About / Summary</label>
        <textarea name="bio" rows="3" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">${escapeHtml(user.bio)}</textarea>
      </div>

      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary" style="background: #0a66c2; border-color: #0a66c2; font-weight: 700; padding: 10px 24px;">Save & Apply Changes</button>
        <a href="/SXSS/lab1?view=profile" class="btn btn-secondary" style="font-weight: 600;">Cancel</a>
      </div>
    </form>
  </div>`;

  // 4. Network View
  const networkHtml = `
  <div style="max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
    <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Pending Connection Invitations (2)</h2>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">MV</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Dr. Marcus Vance</div>
            <div style="font-size: 12px; color: #64748b;">Principal Systems Architect @ NovaHR</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-primary" onclick="window.showAppToast('Connected with Dr. Marcus Vance!', '🤝')" style="background: #0a66c2; font-weight: 600;">Accept</button>
          <button class="btn btn-sm btn-secondary" onclick="window.showAppToast('Invitation dismissed', '✕')">Ignore</button>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #10b981; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">ER</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Elena Rostova</div>
            <div style="font-size: 12px; color: #64748b;">Lead Security Engineer @ CyberCore Zurich</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-primary" onclick="window.showAppToast('Connected with Elena Rostova!', '🤝')" style="background: #0a66c2; font-weight: 600;">Accept</button>
          <button class="btn btn-sm btn-secondary" onclick="window.showAppToast('Invitation dismissed', '✕')">Ignore</button>
        </div>
      </div>
    </div>
  </div>`;

  // 5. Notifications View
  const notificationsHtml = `
  <div style="max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
    <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Notifications</h2>
    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
      <div style="padding: 14px; background: #eff6ff; border-radius: 8px; border-left: 3px solid #0a66c2;">
        <strong>Sarah Chen</strong> and 42 others reacted to your benchmark post. • <span style="color: #94a3b8;">1 hour ago</span>
      </div>
      <div style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #cbd5e1;">
        <strong>Dr. Marcus Vance</strong> commented: "Great insights! Did you test this with Istio sidecars enabled?" • <span style="color: #94a3b8;">3 hours ago</span>
      </div>
      <div style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #cbd5e1;">
        <strong>CloudSphere Systems</strong> posted a new engineering opening. • <span style="color: #94a3b8;">Yesterday</span>
      </div>
    </div>
  </div>`;

  let activeContent = feedHtml;
  if (view === 'settings') activeContent = settingsHtml;
  else if (view === 'profile') activeContent = profileHtml;
  else if (view === 'network') activeContent = networkHtml;
  else if (view === 'notifications') activeContent = notificationsHtml;

  const appHtml = `
  <div style="background: #f3f4f6; min-height: 100%; padding-bottom: 60px;">
    <!-- ProNet Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 10px 0; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1080px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <a href="/SXSS/lab1" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
            <div style="width: 34px; height: 34px; background: #0a66c2; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 20px;">in</div>
            <span style="font-size: 18px; font-weight: 800; color: #0a66c2; letter-spacing: -0.02em;">ProNet</span>
          </a>
          <input type="text" placeholder="🔍 Search posts, colleagues..." style="padding: 7px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; width: 220px; outline: none; background: #f8fafc;">
        </div>

        <div style="display: flex; gap: 20px; align-items: center; font-size: 13px; font-weight: 600;">
          <a href="/SXSS/lab1?view=feed" style="color: ${view === 'feed' ? '#0a66c2' : '#475569'}; text-decoration: none; display: flex; flex-direction: column; align-items: center;">
            <span style="font-size: 16px;">🏠</span>
            <span style="font-size: 11px;">Feed</span>
          </a>
          <a href="/SXSS/lab1?view=network" style="color: ${view === 'network' ? '#0a66c2' : '#475569'}; text-decoration: none; display: flex; flex-direction: column; align-items: center; position: relative;">
            <span style="font-size: 16px;">👥</span>
            <span style="font-size: 11px;">My Network</span>
          </a>
          <a href="/SXSS/lab1?view=notifications" style="color: ${view === 'notifications' ? '#0a66c2' : '#475569'}; text-decoration: none; display: flex; flex-direction: column; align-items: center; position: relative;">
            <span style="font-size: 16px;">🔔</span>
            <span style="font-size: 11px;">Notifications</span>
            <span style="position: absolute; top: -4px; right: 2px; background: #ef4444; color: #fff; font-size: 9px; font-weight: 700; border-radius: 999px; padding: 1px 4px;">4</span>
          </a>
          
          <!-- User Dropdown Menu -->
          <div style="position: relative; cursor: pointer;" onclick="document.getElementById('pronet-user-menu').classList.toggle('active')">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #0a66c2; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700;">AT</div>
              <span style="font-size: 11px; color: #475569;">Me ▾</span>
            </div>
            <div id="pronet-user-menu" class="pronet-dropdown-menu" style="display: none; position: absolute; right: 0; top: 38px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 190px; padding: 8px 0; z-index: 1000;">
              <div style="padding: 8px 14px; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${escapeHtml(user.name)}</div>
                <div style="font-size: 11px; color: #64748b; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${user.headline}</div>
              </div>
              <a href="/SXSS/lab1?view=profile" style="display: block; padding: 8px 14px; font-size: 12px; color: #334155; text-decoration: none; font-weight: 600;">👤 View Profile</a>
              <a href="/SXSS/lab1?view=settings" style="display: block; padding: 8px 14px; font-size: 12px; color: #334155; text-decoration: none; font-weight: 600;">⚙️ Settings & Intro</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 24px; max-width: 1080px;">
      ${activeContent}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS/lab2' }));
});

router.post('/lab1/post', (req, res) => {
  const { author, headline, content } = req.body;
  if (author && (headline || content)) {
    labStores.lab1.unshift({
      id: Date.now(),
      author: author.trim(),
      headline: headline || labStores.lab1_user.headline, // Stored unescaped headline sink
      content: content ? content.trim() : '',
      date: "Just now",
      likes: 0,
      comments: []
    });
  }
  res.redirect('/SXSS/lab1');
});

router.post('/lab1/update-profile', (req, res) => {
  const { name, company, headline, bio } = req.body;
  if (name && headline) {
    labStores.lab1_user.name = name.trim();
    labStores.lab1_user.company = company || 'ProNet Member';
    labStores.lab1_user.headline = headline; // Unescaped stored headline sink
    labStores.lab1_user.bio = bio || '';

    // Also update existing user posts with new headline
    labStores.lab1.unshift({
      id: Date.now(),
      author: name.trim(),
      headline: headline,
      content: `Updated my professional headline to "${headline}"!`,
      date: "Just now",
      likes: 0,
      comments: []
    });
  }
  res.redirect('/SXSS/lab1?view=profile');
});

router.post('/lab1/comment', (req, res) => {
  const { author, content, headline } = req.body;
  if (author && (content || headline)) {
    // If commenting on feed or user post
    if (labStores.lab1.length > 0) {
      labStores.lab1[0].comments.push({
        author: author.trim(),
        text: content ? content.trim() : headline
      });
    }
  }
  res.redirect('/SXSS/lab1');
});

// =========================================================================
// LAB 2: Stored HTML Context — PinCraft Visual Discovery (Pinterest Clone)
// =========================================================================
router.get('/lab2', (req, res) => {
  const lab = getLab(2);
  const view = req.query.view || 'explore';
  const categoryFilter = req.query.category || 'all';

  const pinsHtml = labStores.lab2.map(p => `
    <div class="pincraft-card" style="background: #ffffff; border: 1px solid #fee2e2; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.03); display: flex; flex-direction: column;">
      <div style="height: 140px; background: linear-gradient(135deg, #e60023, #b6001b); display: flex; align-items: center; justify-content: center; font-size: 48px; color: #fff;">
        ${p.image || '📌'}
      </div>
      <div style="padding: 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #e60023; text-transform: uppercase;">${escapeHtml(p.board)}</span>
            <span style="font-size: 11px; color: #94a3b8;">${escapeHtml(p.date)}</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${escapeHtml(p.pin_title || 'Visual Pin')}</h3>
          <!-- Stored Pin Description with Flawed Tag Stripper -->
          <div style="font-size: 13px; color: #475569; line-height: 1.5;">${p.note}</div>
        </div>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b;">
          <span>Pinned by <strong>${escapeHtml(p.author)}</strong></span>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.showAppToast('Pin saved to your board!', '📌')">Save (${p.saves || 0})</button>
        </div>
      </div>
    </div>
  `).join('');

  const createPinHtml = `
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #fed7aa; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 28px;">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #7c2d12;">📌 Create and Publish New Pin to Community Board</h2>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Share visual culinary ideas, architecture designs, or secret recipes.</p>
    </div>

    <form method="POST" action="/SXSS/lab2/pin">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Creator Name</label>
          <input type="text" name="author" placeholder="e.g. Chef Gordon" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Board Category</label>
          <select name="board" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
            <option value="Artisan Pastas">Artisan Pastas</option>
            <option value="Dessert Concepts">Dessert Concepts</option>
            <option value="Modern Architecture">Modern Architecture</option>
            <option value="Cocktail Craft">Cocktail Craft</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Pin Title</label>
          <input type="text" name="pin_title" placeholder="e.g. Basil Pesto Dip" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Pin Description & Secret Notes</label>
        <textarea name="note" rows="3" placeholder="Describe this pin (e.g. emulsify basil leaves with roasted pine nuts)..." required
                  style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;"></textarea>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn" style="background: #e60023; color: #fff; font-weight: 700; padding: 10px 24px; border-radius: 8px;">Save to PinCraft Board</button>
        <a href="/SXSS/lab2" class="btn btn-secondary" style="font-weight: 600;">Cancel</a>
      </div>
    </form>
  </div>`;

  const exploreHtml = `
  <div>
    <!-- Filter Chips -->
    <div style="display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto;">
      <a href="/SXSS/lab2" class="btn btn-sm ${categoryFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" style="${categoryFilter === 'all' ? 'background: #e60023; border-color: #e60023;' : ''} font-weight: 600; border-radius: 999px;">All Pins</a>
      <a href="/SXSS/lab2?category=pastas" class="btn btn-sm btn-secondary" style="font-weight: 600; border-radius: 999px;">Artisan Pastas</a>
      <a href="/SXSS/lab2?category=desserts" class="btn btn-sm btn-secondary" style="font-weight: 600; border-radius: 999px;">Desserts</a>
      <a href="/SXSS/lab2?category=arch" class="btn btn-sm btn-secondary" style="font-weight: 600; border-radius: 999px;">Modern Architecture</a>
    </div>

    <!-- Pins Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
      ${pinsHtml}
    </div>
  </div>`;

  const appHtml = `
  <div style="background: #faf5f5; min-height: 100%; padding-bottom: 60px;">
    <!-- PinCraft Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #fee2e2; padding: 14px 0; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1000px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="/SXSS/lab2" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; background: #e60023; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 20px;">P</div>
            <div>
              <div style="font-size: 18px; font-weight: 800; color: #e60023;">PinCraft</div>
            </div>
          </a>
          <input type="text" placeholder="🔍 Search aesthetic recipes, designs..." style="padding: 7px 14px; border: 1px solid #cbd5e1; border-radius: 999px; font-size: 13px; width: 260px; outline: none; background: #f8fafc;">
        </div>
        <div style="display: flex; gap: 16px; align-items: center; font-size: 13px; font-weight: 600;">
          <a href="/SXSS/lab2" style="color: ${view === 'explore' ? '#e60023' : '#475569'}; text-decoration: none;">Explore</a>
          <a href="/SXSS/lab2?view=create" class="btn btn-sm" style="background: #e60023; color: #fff; font-weight: 700; border-radius: 999px; padding: 6px 16px;">+ Create Pin</a>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 28px; max-width: 1000px;">
      ${view === 'create' ? createPinHtml : exploreHtml}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS/lab3' }));
});

router.post('/lab2/pin', (req, res) => {
  let { author, board, pin_title, note } = req.body;
  if (author && note) {
    const filteredNote = note.replace(/<script>/gi, '').replace(/<\/script>/gi, '');
    labStores.lab2.unshift({
      id: Date.now(),
      author: author.trim(),
      board: board ? board.trim() : 'General',
      pin_title: pin_title ? pin_title.trim() : 'New Pin',
      note: filteredNote,
      image: "📌",
      date: "Just now",
      saves: 0
    });
  }
  res.redirect('/SXSS/lab2');
});

router.post('/lab2/note', (req, res) => {
  let { author, board, pin_title, note } = req.body;
  if (author && note) {
    const filteredNote = note.replace(/<script>/gi, '').replace(/<\/script>/gi, '');
    labStores.lab2.unshift({
      id: Date.now(),
      author: author.trim(),
      board: board ? board.trim() : 'General',
      pin_title: pin_title ? pin_title.trim() : 'Kitchen Note',
      note: filteredNote,
      image: "📌",
      date: "Just now",
      saves: 0
    });
  }
  res.redirect('/SXSS/lab2');
});

// =========================================================================
// LAB 3: Stored Attribute Context — MetroSpace (Social Network / Facebook Clone)
// =========================================================================
router.get('/lab3', (req, res) => {
  const lab = getLab(3);
  const view = req.query.view || 'feed';
  const user = labStores.lab3;

  // News Feed View
  const feedHtml = `
  <div style="display: grid; grid-template-columns: 240px 1fr 220px; gap: 20px;">
    <!-- Left Navigation Sidebar -->
    <div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <a href="/SXSS/lab3?view=profile" style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; text-decoration: none;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #1877f2; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800;">SL</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${escapeHtml(user.name)}</div>
            <div style="font-size: 11px; color: #64748b;">${escapeHtml(user.title)}</div>
          </div>
        </a>

        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600;">
          <a href="/SXSS/lab3?view=feed" style="padding: 8px 12px; border-radius: 8px; background: #e7f3ff; color: #1877f2; text-decoration: none;">📰 News Feed</a>
          <a href="/SXSS/lab3?view=profile" style="padding: 8px 12px; border-radius: 8px; color: #475569; text-decoration: none;">👤 View Profile Page</a>
          <a href="/SXSS/lab3?view=friends" style="padding: 8px 12px; border-radius: 8px; color: #475569; text-decoration: none;">👥 Friends (742)</a>
          <a href="/SXSS/lab3?view=notifications" style="padding: 8px 12px; border-radius: 8px; color: #475569; text-decoration: none;">🔔 Notifications</a>
        </div>
      </div>
    </div>

    <!-- Center Feed & Posts -->
    <div>
      <!-- Stories Reel -->
      <div style="display: flex; gap: 10px; margin-bottom: 16px; overflow-x: auto;">
        <div style="width: 100px; height: 130px; border-radius: 10px; background: linear-gradient(135deg, #1877f2, #0052cc); color: #fff; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; font-weight: 700; flex-shrink: 0;">
          <span>+ Add Story</span>
          <span>Your Story</span>
        </div>
        <div style="width: 100px; height: 130px; border-radius: 10px; background: linear-gradient(135deg, #059669, #10b981); color: #fff; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; font-weight: 700; flex-shrink: 0;">
          <span>🏙️ Apex Tower</span>
          <span>David Miller</span>
        </div>
        <div style="width: 100px; height: 130px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: #fff; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; font-weight: 700; flex-shrink: 0;">
          <span>🔐 Keynote</span>
          <span>Elena Rostova</span>
        </div>
      </div>

      <!-- Status Composer -->
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #1877f2; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">SL</div>
          <span style="font-size: 13px; color: #64748b; font-weight: 500;">What's on your mind, ${escapeHtml(user.name.split(' ')[0])}?</span>
        </div>
        <form method="POST" action="/SXSS/lab3/post">
          <textarea name="text" rows="2" placeholder="Share a status update with friends..." required
                    style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 10px;"></textarea>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px; font-size: 12px; color: #64748b; font-weight: 600;">
              <span>🖼️ Photo</span>
              <span>😊 Feeling</span>
              <span>🏷️ Tag</span>
            </div>
            <button type="submit" class="btn btn-primary btn-sm" style="background: #1877f2; border-color: #1877f2; font-weight: 600; padding: 6px 18px;">Post</button>
          </div>
        </form>
      </div>

      <!-- Feed Posts -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${user.posts.map(p => `
          <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; gap: 10px; align-items: center;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: #1877f2; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">${escapeHtml((p.author || user.name).slice(0,2).toUpperCase())}</div>
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${escapeHtml(p.author || user.name)}</div>
                  <div style="font-size: 11px; color: #64748b;">${escapeHtml(p.time || 'Just now')} • 🌍 Public</div>
                </div>
              </div>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 14px;">${escapeHtml(p.text)}</p>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; display: flex; gap: 24px; font-size: 13px; color: #64748b; font-weight: 600;">
              <span style="cursor: pointer;" onclick="window.togglePostLike(this, ${p.likes || 0})">👍 Like (<span class="like-count">${p.likes || 0}</span>)</span>
              <span style="cursor: pointer;" onclick="window.showAppToast('Comment box active', '💬')">💬 Comment</span>
              <span style="cursor: pointer;" onclick="window.showAppToast('Post shared to your timeline!', '↗️')">↗️ Share</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Right Sidebar: Contacts -->
    <div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; font-size: 13px;">
        <div style="font-weight: 700; color: #64748b; margin-bottom: 12px; text-transform: uppercase; font-size: 11px;">Contacts Online (4)</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
            <span style="font-weight: 600; color: #0f172a;">David Miller</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
            <span style="font-weight: 600; color: #0f172a;">Elena Rostova</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
            <span style="font-weight: 600; color: #0f172a;">Dr. Marcus Vance</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // Profile View (Contains the unescaped href website link!)
  const profileHtml = `
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="height: 160px; background: linear-gradient(135deg, #1877f2, #0052cc);"></div>
      <div style="padding: 0 28px 28px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: -50px; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
          <div style="width: 96px; height: 96px; border-radius: 50%; background: #ffffff; border: 4px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 34px; font-weight: 800; color: #1877f2;">
            SL
          </div>
          
          <div style="display: flex; gap: 10px;">
            <!-- Stored attribute context link -->
            <a href="${user.website}" id="user-website-link" class="btn btn-primary btn-sm" style="background: #1877f2; border-color: #1877f2; font-weight: 600; text-decoration: none; padding: 8px 18px;">
              🌐 Visit External Website
            </a>
            <a href="/SXSS/lab3?view=settings" class="btn btn-secondary btn-sm" style="font-weight: 600; padding: 8px 18px;">
              ⚙️ Edit Profile Info
            </a>
          </div>
        </div>

        <div>
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a;">${escapeHtml(user.name)}</h1>
          <div style="font-size: 13px; color: #64748b; margin-top: 2px;">${escapeHtml(user.title)} • ${escapeHtml(user.workplace)}</div>
        </div>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; color: #334155;">
          <div><strong>Relationship:</strong> ${escapeHtml(user.relationship)}</div>
          <div><strong>Workplace:</strong> ${escapeHtml(user.workplace)}</div>
          <div style="grid-column: span 2;"><strong>Bio:</strong> ${escapeHtml(user.bio)}</div>
        </div>
      </div>
    </div>
  </div>`;

  // Settings / Edit Profile View
  const settingsHtml = `
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a;">Edit MetroSpace Profile & Links</h2>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Update your bio, personal details, and external portfolio website link.</p>
    </div>

    <form method="POST" action="/SXSS/lab3/update">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Display Name</label>
          <input type="text" name="name" value="${escapeHtml(user.name)}" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Job Title</label>
          <input type="text" name="title" value="${escapeHtml(user.title)}" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">External Website Link URL (Appears on your public profile button)</label>
        <input type="text" name="website" value="${escapeHtml(user.website)}" placeholder="https://yourwebsite.example.com" required
               style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">About Me / Bio</label>
        <textarea name="bio" rows="2" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">${escapeHtml(user.bio)}</textarea>
      </div>

      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary" style="background: #1877f2; border-color: #1877f2; font-weight: 600; padding: 10px 24px;">Save MetroSpace Profile</button>
        <a href="/SXSS/lab3?view=profile" class="btn btn-secondary" style="font-weight: 600;">Cancel</a>
      </div>
    </form>
  </div>`;

  // Notifications View
  const notificationsHtml = `
  <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Notifications</h2>
    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
      <div style="padding: 12px; background: #e7f3ff; border-radius: 8px; color: #1877f2;">
        <strong>David Miller</strong> commented on your status: "Congratulations on the Midtown lease!"
      </div>
      <div style="padding: 12px; background: #f8fafc; border-radius: 8px; color: #475569;">
        <strong>Elena Rostova</strong> reacted to your photo.
      </div>
    </div>
  </div>`;

  let activeViewHtml = feedHtml;
  if (view === 'profile') activeViewHtml = profileHtml;
  else if (view === 'settings') activeViewHtml = settingsHtml;
  else if (view === 'notifications') activeViewHtml = notificationsHtml;

  const appHtml = `
  <div style="background: #f0f2f5; min-height: 100%; padding-bottom: 60px;">
    <!-- MetroSpace Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 10px 0; position: sticky; top: 0; z-index: 100;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1080px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="/SXSS/lab3" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
            <div style="width: 36px; height: 36px; background: #1877f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 20px;">f</div>
            <span style="font-size: 18px; font-weight: 800; color: #1877f2;">MetroSpace</span>
          </a>
          <input type="text" placeholder="🔍 Search MetroSpace..." style="padding: 7px 12px; border: 1px solid #cbd5e1; border-radius: 999px; font-size: 13px; width: 220px; outline: none; background: #f8fafc;">
        </div>

        <div style="display: flex; gap: 24px; font-size: 13px; font-weight: 600; align-items: center;">
          <a href="/SXSS/lab3?view=feed" style="color: ${view === 'feed' ? '#1877f2' : '#475569'}; text-decoration: none; font-size: 18px;">🏠</a>
          <a href="/SXSS/lab3?view=profile" style="color: ${view === 'profile' ? '#1877f2' : '#475569'}; text-decoration: none; font-size: 18px;">👤</a>
          <a href="/SXSS/lab3?view=notifications" style="color: ${view === 'notifications' ? '#1877f2' : '#475569'}; text-decoration: none; font-size: 18px; position: relative;">
            🔔
            <span style="position: absolute; top: -4px; right: -6px; background: #ef4444; color: #fff; font-size: 9px; font-weight: 700; border-radius: 999px; padding: 1px 4px;">2</span>
          </a>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 24px; max-width: 1080px;">
      ${activeViewHtml}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS/lab4' }));
});

router.post('/lab3/update', (req, res) => {
  const { name, title, website, bio } = req.body;
  if (name && website) {
    labStores.lab3.name = name;
    labStores.lab3.title = title || 'Member';
    labStores.lab3.website = website; // Stored in unescaped attribute context
    labStores.lab3.bio = bio || '';
  }
  res.redirect('/SXSS/lab3?view=profile');
});

router.post('/lab3/post', (req, res) => {
  const { text } = req.body;
  if (text) {
    labStores.lab3.posts.unshift({
      id: Date.now(),
      author: labStores.lab3.name,
      text: text.trim(),
      time: "Just now",
      likes: 0
    });
  }
  res.redirect('/SXSS/lab3?view=feed');
});

// =========================================================================
// LAB 4: Case Sensitivity Filter — ShopNest Electronics Reviews (Amazon Clone)
// =========================================================================
router.get('/lab4', (req, res) => {
  const lab = getLab(4);
  const view = req.query.view || 'product';

  const reviewsHtml = labStores.lab4.map(r => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">
            ${escapeHtml((r.author || 'User').slice(0,2).toUpperCase())}
          </div>
          <span style="font-weight: 700; color: #0f172a; font-size: 15px;">${escapeHtml(r.author)}</span>
          <span style="background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">✓ Verified Purchase</span>
        </div>
        <span style="color: #f59e0b; font-size: 14px; font-weight: 700;">★ ${escapeHtml(r.rating)}</span>
      </div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">${escapeHtml(r.title || 'Product Feedback')}</div>
      <!-- Unescaped review content subject to case-sensitive filter -->
      <div style="font-size: 14px; color: #475569; line-height: 1.6;">${r.review}</div>
      <div style="margin-top: 12px; font-size: 12px; color: #94a3b8; display: flex; gap: 16px;">
        <span style="cursor: pointer;" onclick="window.showAppToast('Feedback recorded: Helpful', '👍')">Helpful (14)</span>
        <span style="cursor: pointer;" onclick="window.showAppToast('Review report submitted', '🚩')">Report</span>
      </div>
    </div>
  `).join('');

  const productDetailHtml = `
  <div>
    <!-- Product Showcase -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: grid; grid-template-columns: 280px 1fr; gap: 32px;">
      <div style="height: 260px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 80px; border: 1px solid #e2e8f0;">
        🎧
      </div>
      <div>
        <span style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Wireless Over-Ear Noise Cancelling</span>
        <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 6px 0 10px;">AeroSound Pro Wireless ANC Headphones</h1>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="color: #f59e0b; font-weight: 700;">★★★★★ 4.8</span>
          <span style="font-size: 13px; color: #2563eb;">2,490 customer ratings</span>
        </div>
        <div style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">$249.00</div>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
          Custom 40mm graphene drivers, hybrid active noise cancellation, and up to 45 hours of continuous battery playback with quick USB-C charging.
        </p>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-primary" onclick="window.showAppToast('Added AeroSound Pro to Cart! (1 item)', '🛒')" style="background: #0f172a; font-weight: 600;">Add to Cart</button>
          <a href="/SXSS/lab4?view=write_review" class="btn btn-secondary" style="font-weight: 600;">✍️ Write Customer Review</a>
        </div>
      </div>
    </div>

    <!-- Customer Reviews -->
    <div style="margin-bottom: 32px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0f172a;">Verified Customer Reviews (${labStores.lab4.length})</h2>
        <a href="/SXSS/lab4?view=write_review" class="btn btn-sm btn-secondary" style="font-weight: 600; text-decoration: none;">+ Write Review</a>
      </div>
      ${reviewsHtml}
    </div>
  </div>`;

  const writeReviewHtml = `
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a;">Submit a Verified Product Review</h2>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Reviewing: <strong>AeroSound Pro Wireless ANC Headphones</strong></p>
    </div>

    <form method="POST" action="/SXSS/lab4/review">
      <div style="display: grid; grid-template-columns: 1fr 1fr 140px; gap: 12px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Your Name</label>
          <input type="text" name="author" placeholder="e.g. TechBuyer88" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Review Headline</label>
          <input type="text" name="title" placeholder="e.g. Outstanding audio clarity" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Rating</label>
          <select name="rating" style="width: 100%; padding: 9px 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none;">
            <option value="5/5">5 Stars ★★★★★</option>
            <option value="4/5">4 Stars ★★★★☆</option>
            <option value="3/5">3 Stars ★★★☆☆</option>
          </select>
        </div>
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Review Description</label>
        <textarea name="review" rows="3" placeholder="Share your hands-on experience with the noise cancellation and audio performance..." required
                  style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;"></textarea>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary" style="background: #0f172a; border-color: #0f172a; padding: 10px 24px; font-weight: 600;">Post Customer Review</button>
        <a href="/SXSS/lab4?view=product" class="btn btn-secondary" style="font-weight: 600;">Cancel</a>
      </div>
    </form>
  </div>`;

  const cartHtml = `
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="/SXSS/lab4?view=product" class="btn btn-sm btn-secondary" style="font-weight: 600; text-decoration: none;">← Back to Product</a>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Shopping Cart (1 Item)</h2>
      </div>
      <span style="font-size: 14px; color: #64748b; font-weight: 600;">Price</span>
    </div>

    <!-- Cart Item -->
    <div style="display: grid; grid-template-columns: 100px 1fr 120px; gap: 20px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; margin-bottom: 24px; align-items: center;">
      <div style="height: 100px; background: #f8fafc; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 44px; border: 1px solid #e2e8f0;">
        🎧
      </div>
      <div>
        <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">AeroSound Pro Wireless ANC Headphones</h3>
        <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-bottom: 6px;">✓ In Stock • Free 2-Day Prime Delivery</div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 10px;">Color: Midnight Matte Black | Edition: Pro Active Noise Cancelling</div>
        <div style="display: flex; gap: 16px; font-size: 12px; color: #2563eb; font-weight: 600;">
          <span>Qty: 1</span>
          <span style="cursor: pointer;" onclick="window.showAppToast('Quantity updated to 1', '✓')">Update</span>
          <span style="cursor: pointer; color: #64748b;" onclick="window.showAppToast('Item saved for later', '💾')">Save for later</span>
        </div>
      </div>
      <div style="text-align: right; font-size: 20px; font-weight: 800; color: #0f172a;">
        $249.00
      </div>
    </div>

    <!-- Subtotal & Actions -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <a href="/SXSS/lab4?view=product" class="btn btn-secondary" style="font-weight: 600; text-decoration: none;">
        ← Back to Product Details
      </a>
      <div style="text-align: right;">
        <div style="font-size: 16px; color: #334155; margin-bottom: 10px;">
          Subtotal (1 item): <strong style="font-size: 20px; color: #0f172a;">$249.00</strong>
        </div>
        <button type="button" class="btn btn-primary" style="background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: 700; padding: 10px 24px;" onclick="window.showAppToast('Order placed successfully! Express delivery scheduled.', '📦')">
          Proceed to Checkout ($249.00)
        </button>
      </div>
    </div>
  </div>`;

  let activeShopContent = productDetailHtml;
  if (view === 'write_review') activeShopContent = writeReviewHtml;
  else if (view === 'cart') activeShopContent = cartHtml;

  const appHtml = `
  <div style="background: #fafafa; min-height: 100%; padding-bottom: 60px;">
    <!-- ShopNest Header -->
    <header style="background: #0f172a; color: #fff; padding: 14px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 960px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="/SXSS/lab4?view=product" style="text-decoration: none; display: flex; align-items: center; gap: 8px; color: #fff;">
            <span style="font-size: 22px;">🎧</span>
            <span style="font-size: 18px; font-weight: 800; letter-spacing: -0.02em;">ShopNest</span>
          </a>
        </div>
        <div style="display: flex; gap: 20px; font-size: 13px; font-weight: 500; align-items: center;">
          <a href="/SXSS/lab4?view=product" style="color: ${view === 'product' ? '#60a5fa' : '#fff'}; text-decoration: none; font-weight: 600;">Product Details</a>
          <a href="/SXSS/lab4?view=write_review" style="color: ${view === 'write_review' ? '#60a5fa' : '#93c5fd'}; text-decoration: none; font-weight: 600;">Write a Review</a>
          <a href="/SXSS/lab4?view=cart" style="color: ${view === 'cart' ? '#60a5fa' : '#fff'}; text-decoration: none; display: flex; align-items: center; gap: 6px; background: #1e293b; padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;">
            🛒 Cart (1)
          </a>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 960px;">
      ${activeShopContent}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS/lab5' }));
});

router.post('/lab4/review', (req, res) => {
  let { author, title, rating, review } = req.body;
  if (author && review) {
    const filteredReview = review.replace(/<script>/g, '').replace(/onerror/g, '');
    labStores.lab4.unshift({
      author: author.trim(),
      title: title ? title.trim() : 'Verified Review',
      rating: rating || "5/5",
      review: filteredReview,
      date: "Just now"
    });
  }
  res.redirect('/SXSS/lab4?view=product');
});

// =========================================================================
// LAB 5: Multiple Rendering Locations — Nexus Global CRM (Salesforce Clone)
// =========================================================================
router.get('/lab5', (req, res) => {
  const lab = getLab(5);
  const data = labStores.lab5;
  const activeTab = req.query.tab || 'overview';

  const overviewHtml = `
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a;">${escapeHtml(data.clientName)}</h2>
        <div style="font-size: 13px; color: #64748b;">${escapeHtml(data.contactEmail)} • ${escapeHtml(data.phone)}</div>
      </div>
      <span style="background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px;">Enterprise Tier ($180k ARR)</span>
    </div>

    <!-- SAFELY ENCODED on the public client overview page -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Client Account Status Note (Customer Facing Overview)</div>
      <div style="font-size: 15px; color: #1e293b; line-height: 1.5;">${escapeHtml(data.statusNote)}</div>
    </div>

    <form method="POST" action="/SXSS/lab5/update-status">
      <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Log Internal Status Update</label>
      <div style="display: flex; gap: 10px;">
        <input type="text" name="status" value="${escapeHtml(data.statusNote)}" required
               style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        <button type="submit" class="btn btn-primary" style="background: #2563eb; border-color: #2563eb; font-weight: 600; padding: 10px 20px;">Save & Log</button>
      </div>
    </form>
  </div>`;

  const auditRows = data.auditLogs.map(log => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 14px 18px; font-family: var(--font-mono); font-size: 12px; color: #64748b;">${escapeHtml(log.timestamp)}</td>
      <td style="padding: 14px 18px; font-size: 13px; font-weight: 600; color: #0f172a;">${escapeHtml(log.actor)}</td>
      <!-- Unescaped Stored Context in Compliance Audit Table -->
      <td style="padding: 14px 18px; font-size: 14px; color: #334155;">${log.status}</td>
    </tr>
  `).join('');

  const auditLogHtml = `
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
    <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Internal Compliance Audit Trail</h2>
    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; background: #f8fafc;">
          <th style="padding: 12px 18px; font-size: 12px; color: #64748b; font-weight: 700;">Timestamp</th>
          <th style="padding: 12px 18px; font-size: 12px; color: #64748b; font-weight: 700;">Actor</th>
          <th style="padding: 12px 18px; font-size: 12px; color: #64748b; font-weight: 700;">Action / Status Recorded</th>
        </tr>
      </thead>
      <tbody>
        ${auditRows}
      </tbody>
    </table>
  </div>`;

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- CRM Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 920px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">N</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">Nexus Enterprise CRM</div>
            <div style="font-size: 11px; color: #64748b;">Client Accounts & Pipeline Manager</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 920px;">
      <div style="display: flex; gap: 8px; margin-bottom: 20px;">
        <a href="/SXSS/lab5?tab=overview" class="btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}" style="font-weight: 600; text-decoration: none;">Account Overview</a>
        <a href="/SXSS/lab5?tab=audit" class="btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}" style="font-weight: 600; text-decoration: none;">Internal Audit Log</a>
      </div>

      ${activeTab === 'audit' ? auditLogHtml : overviewHtml}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS/lab6' }));
});

router.post('/lab5/update-status', (req, res) => {
  const { status } = req.body;
  if (status) {
    labStores.lab5.statusNote = status;
    labStores.lab5.auditLogs.unshift({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Sales Lead",
      status: status // Unencoded in the compliance audit trail
    });
  }
  res.redirect('/SXSS/lab5?tab=overview');
});

// =========================================================================
// LAB 6: Privileged Viewer — CarePulse Clinical Telehealth Desk
// =========================================================================
router.get('/lab6', (req, res) => {
  const lab = getLab(6);
  const view = req.query.view || 'queue';
  const tickets = labStores.lab6;
  const isSimulatedAdmin = req.query.admin_bot === '1';

  if (isSimulatedAdmin) {
    res.cookie('admin_session_token', 'carepulse_sec_adm_99182', { httpOnly: false });
  }

  const ticketsHtml = tickets.map(t => `
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div>
          <span style="font-size: 14px; font-weight: 700; color: #0284c7;">Ticket #${escapeHtml(t.id)}: ${escapeHtml(t.title)}</span>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${escapeHtml(t.patient)} • ${escapeHtml(t.department)}</div>
        </div>
        <span style="font-size: 12px; background: #e0f2fe; color: #0369a1; font-weight: 600; padding: 3px 10px; border-radius: 999px;">${escapeHtml(t.status)}</span>
      </div>
      <!-- Unescaped patient description executed when admin officer reviews -->
      <div style="font-size: 14px; color: #334155; line-height: 1.6;">${t.description}</div>
    </div>
  `).join('');

  const queueHtml = `
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a;">Active Patient Triage Queue (${tickets.length})</h2>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="triggerAdminReview()" style="font-weight: 600;">
          👤 Request Compliance Officer Review
        </button>
        <a href="/SXSS/lab6?view=new_ticket" class="btn btn-primary btn-sm" style="background: #0284c7; border-color: #0284c7; font-weight: 600;">
          + Open Patient Ticket
        </a>
      </div>
    </div>
    ${ticketsHtml}
  </div>`;

  const newTicketHtml = `
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a;">Open New Confidential Patient Ticket</h2>
      <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Submit medical triage notes to the attending compliance officer and doctors.</p>
    </div>

    <form method="POST" action="/SXSS/lab6/ticket">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Department</label>
          <select name="department" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
            <option value="Neurology Triage">Neurology Triage</option>
            <option value="Cardiology Care">Cardiology Care</option>
            <option value="Telehealth Authentication">Telehealth Authentication</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Ticket Subject</label>
          <input type="text" name="title" placeholder="e.g. Biometric portal timeout" required
                 style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
        </div>
      </div>
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Confidential Clinical Description</label>
        <textarea name="description" rows="3" placeholder="Provide confidential clinical issue details..." required
                  style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;"></textarea>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary" style="background: #0284c7; border-color: #0284c7; font-weight: 600; padding: 10px 24px;">Submit Ticket to Queue</button>
        <a href="/SXSS/lab6?view=queue" class="btn btn-secondary" style="font-weight: 600;">Cancel</a>
      </div>
    </form>
  </div>`;

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Clinical Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 900px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">🩺</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">CarePulse Clinical Support</div>
            <div style="font-size: 11px; color: #64748b;">Confidential Patient Helpdesk & Triage</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 36px; max-width: 900px;">
      ${view === 'new_ticket' ? newTicketHtml : queueHtml}
    </div>
  </div>

  <iframe id="admin-bot-frame" style="display:none;" title="Compliance Bot Sandbox"></iframe>

  <script>
    function triggerAdminReview() {
      var frame = document.getElementById('admin-bot-frame');
      if (frame) {
        frame.src = '/SXSS/lab6?admin_bot=1&t=' + Date.now();
        if (window.showAppToast) {
          window.showAppToast('Compliance Officer (Dr. Sarah Jenkins) is now reviewing the active ticket queue in administrative context.', '👤');
        }
      }
    }
  </script>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS' }));
});

router.post('/lab6/ticket', (req, res) => {
  const { title, description, department } = req.body;
  if (title && description) {
    const nextId = 1040 + labStores.lab6.length + 1;
    labStores.lab6.unshift({
      id: nextId,
      patient: `Patient Ref #${Math.floor(Math.random() * 800) + 100}`,
      department: department || 'General Support',
      urgency: "Normal",
      title: title.trim(),
      description: description,
      status: "Awaiting Compliance Review",
      timestamp: "Just now"
    });
  }
  res.redirect('/SXSS/lab6?view=queue');
});

module.exports = router;
