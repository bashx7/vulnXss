// routes/rxss.js - Implementation of all 11 Reflected XSS Mini-Applications

const express = require('express');
const router = express.Router();
const labsData = require('../data/labs');
const { renderLabShell, escapeHtml } = require('../utils/renderLab');
const { renderCategoryPage } = require('../views/platformPages');

const RXSS_LABS = labsData.RXSS;

function getLab(num) {
  return RXSS_LABS.find(l => l.number === num);
}

// Category collection page: /RXSS
router.get('/', (req, res) => {
  res.send(renderCategoryPage('RXSS'));
});

// =========================================================================
// LAB 1: Basic Reflection — PulsePost Blog (Multi-Parameter Search & Filters)
// =========================================================================
router.get('/lab1', (req, res) => {
  const lab = getLab(1);
  const query = req.query.query || '';
  const category = req.query.category || 'all';
  const sort = req.query.sort || 'relevance';
  const author = req.query.author || 'all';

  const appHtml = `
  <div style="background-color: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Publication Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; background: linear-gradient(135deg, #4f46e5, #06b6d4); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 20px;">P</div>
          <div>
            <div style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">PulsePost</div>
            <div style="font-size: 11px; color: #64748b; font-weight: 500;">Engineering, Cloud Architecture & Security</div>
          </div>
        </div>

        <!-- Global Search Bar with Multiple Parameters -->
        <form method="GET" action="/RXSS/lab1" style="display: flex; gap: 8px; flex: 1; max-width: 520px; flex-wrap: wrap;">
          <input type="text" name="query" value="${escapeHtml(query)}" placeholder="Search 1,400+ technical articles..." 
                 style="flex: 1; min-width: 220px; padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
          <select name="category" style="padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff; color: #334155;">
            <option value="all" ${category === 'all' ? 'selected' : ''}>All Categories</option>
            <option value="cloud" ${category === 'cloud' ? 'selected' : ''}>Cloud Security</option>
            <option value="k8s" ${category === 'k8s' ? 'selected' : ''}>Kubernetes</option>
            <option value="rust" ${category === 'rust' ? 'selected' : ''}>Rust & Runtimes</option>
          </select>
          <select name="sort" style="padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff; color: #334155;">
            <option value="relevance" ${sort === 'relevance' ? 'selected' : ''}>Relevance</option>
            <option value="newest" ${sort === 'newest' ? 'selected' : ''}>Newest First</option>
            <option value="popular" ${sort === 'popular' ? 'selected' : ''}>Most Read</option>
          </select>
          <button type="submit" class="btn btn-primary" style="background: #4f46e5; border-color: #4f46e5; padding: 9px 18px; font-weight: 600;">Search</button>
        </form>
      </div>
    </header>

    <!-- Navigation Topics -->
    <div style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
      <div class="container" style="display: flex; gap: 20px; font-size: 13px; font-weight: 600; color: #475569; overflow-x: auto;">
        <a href="/RXSS/lab1" style="color: #4f46e5; text-decoration: none;">All Articles</a>
        <a href="/RXSS/lab1?category=cloud" style="color: #475569; text-decoration: none;">Cloud Architecture</a>
        <a href="/RXSS/lab1?category=k8s" style="color: #475569; text-decoration: none;">Kubernetes & Edge</a>
        <a href="/RXSS/lab1?category=rust" style="color: #475569; text-decoration: none;">Rust & Low-Level</a>
        <a href="/RXSS/lab1?category=cloud&sort=popular" style="color: #475569; text-decoration: none;">Zero Trust Security</a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container" style="padding-top: 32px;">
      ${query ? `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <h2 style="font-size: 16px; font-weight: 600; color: #1e293b;">
          Search results for: <b>${query}</b>
        </h2>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px; display: flex; gap: 16px;">
          <span>Category: <strong style="color: #334155;">${escapeHtml(category)}</strong></span>
          <span>Sorting: <strong style="color: #334155;">${escapeHtml(sort)}</strong></span>
          <span>Author: <strong style="color: #334155;">${escapeHtml(author)}</strong></span>
        </div>
      </div>` : ''}

      <!-- Article Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 40px;">
        <article class="pulsepost-article-card" data-category="k8s" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="height: 160px; background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; color: #fff;">
            <span style="background: rgba(255,255,255,0.18); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; width: fit-content; margin-bottom: 8px;">Cloud Security</span>
            <h3 style="font-size: 18px; font-weight: 700; line-height: 1.3;">Zero Trust Architecture in Kubernetes Clusters</h3>
          </div>
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              A comprehensive guide to securing east-west communication within container networks using mutual TLS and identity attestations...
            </p>
            <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #94a3b8;">
              <span>By Dr. Marcus Vance • 8 min read</span>
              <button type="button" class="btn btn-sm" onclick="window.showAppToast('Opening full article reader...', '📖')" style="color: #4f46e5; background: #eef2ff; border: 1px solid #c7d2fe; font-weight: 700; border-radius: 6px; padding: 4px 12px;">Read Full Story →</button>
            </div>
          </div>
        </article>

        <article class="pulsepost-article-card" data-category="rust" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="height: 160px; background: linear-gradient(135deg, #064e3b, #047857); padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; color: #fff;">
            <span style="background: rgba(255,255,255,0.18); font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; width: fit-content; margin-bottom: 8px;">Runtimes</span>
            <h3 style="font-size: 18px; font-weight: 700; line-height: 1.3;">Benchmarking Memory Footprints: Rust vs Go 1.24</h3>
          </div>
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Analyzing garbage collection latency spikes and cold boot memory allocation under 50,000 concurrent RPC connections...
            </p>
            <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #94a3b8;">
              <span>By Elena Rostova • 12 min read</span>
              <button type="button" class="btn btn-sm" onclick="window.showAppToast('Opening full article reader...', '📖')" style="color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; font-weight: 700; border-radius: 6px; padding: 4px 12px;">Read Full Story →</button>
            </div>
          </div>
        </article>
      </div>

      <!-- Newsletter Dispatch Widget -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">📬 PulsePost Weekly Engineering Briefing</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Curated security advisories, compiler releases, and distributed systems whitepapers.</p>
        <form onsubmit="event.preventDefault(); window.showAppToast('Subscribed to PulsePost Digest!', '✅');" style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="email" placeholder="engineer@organization.com" required style="flex: 1; min-width: 240px; padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
          <select style="padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
            <option>Weekly Digest</option>
            <option>Security Bulletins Only</option>
            <option>Daily Engineering Brief</option>
          </select>
          <button type="submit" class="btn btn-primary" style="background: #4f46e5; border-color: #4f46e5; font-weight: 600; padding: 9px 20px;">Subscribe Free</button>
        </form>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab2' }));
});

// =========================================================================
// LAB 2: HTML Tag Filtering — FreshBlend Juice Co. (Multi-Parameter Catalog)
// =========================================================================
router.get('/lab2', (req, res) => {
  const lab = getLab(2);
  const search = req.query.search || '';
  const category = req.query.category || 'all';
  const dietary = req.query.dietary || 'all';
  const sort = req.query.sort || 'featured';

  const blockedTagRegex = /<(script|img|a)\b/i;
  const isBlocked = blockedTagRegex.test(search);

  if (isBlocked) {
    const errorHtml = `
    <div style="max-width: 520px; margin: 60px auto; padding: 36px; background: #fff; border: 1px solid #fee2e2; border-radius: 16px; text-align: center; box-shadow: 0 10px 25px -5px rgba(239,68,68,0.1);">
      <div style="width: 56px; height: 56px; background: #fef2f2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px;">✕</div>
      <h2 style="color: #991b1b; font-size: 20px; font-weight: 700; margin-bottom: 8px;">403 Forbidden: Security Exception</h2>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 24px;">
        Your search request was blocked by the application security policy.
      </p>
      <a href="/RXSS/lab2" class="btn btn-secondary" style="font-weight: 600;">Back to Juice Shop</a>
    </div>`;
    return res.status(403).send(renderLabShell(lab, errorHtml, { nextLabUrl: '/RXSS/lab3' }));
  }

  const appHtml = `
  <div style="background-color: #fcfdfa; min-height: 100%; padding-bottom: 60px;">
    <!-- Store Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px;">🍃</div>
          <div>
            <div style="font-size: 20px; font-weight: 800; color: #166534; letter-spacing: -0.02em;">FreshBlend Juice Co.</div>
            <div style="font-size: 11px; color: #64748b;">100% Organic Raw Cold-Pressed Elixirs</div>
          </div>
        </div>

        <form method="GET" action="/RXSS/lab2" style="display: flex; gap: 8px; flex: 1; max-width: 560px; flex-wrap: wrap;">
          <input type="text" name="search" value="${escapeHtml(search)}" placeholder="Search organic flavors (e.g. Ginger, Citrus)..."
                 style="flex: 1; min-width: 200px; padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
          <select name="category" style="padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
            <option value="all" ${category === 'all' ? 'selected' : ''}>All Formulas</option>
            <option value="immunity" ${category === 'immunity' ? 'selected' : ''}>Immunity</option>
            <option value="detox" ${category === 'detox' ? 'selected' : ''}>Detox & Cleanse</option>
            <option value="antioxidant" ${category === 'antioxidant' ? 'selected' : ''}>Antioxidant</option>
          </select>
          <select name="dietary" style="padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
            <option value="all" ${dietary === 'all' ? 'selected' : ''}>All Diets</option>
            <option value="raw" ${dietary === 'raw' ? 'selected' : ''}>100% Raw</option>
            <option value="keto" ${dietary === 'keto' ? 'selected' : ''}>Keto Certified</option>
          </select>
          <button type="submit" class="btn" style="background: #16a34a; color: #fff; border-radius: 8px; padding: 9px 18px; font-weight: 600;">Search</button>
        </form>

        <div id="juice-cart-btn" style="display: flex; align-items: center; gap: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; color: #15803d; cursor: pointer;">
          <span>🛒</span> Cart (<span id="juice-cart-count">0</span>)
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px;">
      ${search ? `
      <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-size: 16px; font-weight: 600; color: #166534;">
          Search catalog for: ${search}
        </div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px; display: flex; gap: 16px;">
          <span>Category: <strong>${escapeHtml(category)}</strong></span>
          <span>Dietary: <strong>${escapeHtml(dietary)}</strong></span>
          <span>Sort: <strong>${escapeHtml(sort)}</strong></span>
        </div>
      </div>` : ''}

      <!-- Products Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="height: 140px; background: linear-gradient(135deg, #ffedd5, #fed7aa); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 16px;">
            🍊
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase;">Immunity Boost</span>
          <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 4px 0 6px;">Citrus Sunrise (350ml)</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; flex: 1;">Valencia Orange, Meyer Lemon, Ruby Grapefruit, Ginger & Turmeric.</p>
          <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">$6.50</span>
            <button class="btn btn-sm" onclick="window.showAppToast('Added Citrus Sunrise to Cart!', '🛒')" style="background: #16a34a; color: #fff; font-weight: 600; border-radius: 6px;">Add to Cart</button>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="height: 140px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 16px;">
            🥬
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #16a34a; text-transform: uppercase;">Detox & Cleanse</span>
          <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 4px 0 6px;">Green Vitality (350ml)</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; flex: 1;">Organic Tuscan Kale, Crisp Cucumber, Celery, Green Apple & Mint.</p>
          <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">$7.00</span>
            <button class="btn btn-sm" onclick="window.showAppToast('Added Green Vitality to Cart!', '🛒')" style="background: #16a34a; color: #fff; font-weight: 600; border-radius: 6px;">Add to Cart</button>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column;">
          <div style="height: 140px; background: linear-gradient(135deg, #fce7f3, #fbcfe8); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 16px;">
            🫐
          </div>
          <span style="font-size: 11px; font-weight: 700; color: #db2777; text-transform: uppercase;">Antioxidant Rich</span>
          <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin: 4px 0 6px;">Wild Berry Elixir (350ml)</h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; flex: 1;">Wild Blueberries, Acai Berry, Pomegranate Seed & Beetroot extract.</p>
          <div style="margin-top: 16px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">$7.50</span>
            <button class="btn btn-sm" onclick="window.showAppToast('Added Wild Berry Elixir to Cart!', '🛒')" style="background: #16a34a; color: #fff; font-weight: 600; border-radius: 6px;">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab3' }));
});

// =========================================================================
// LAB 3: JavaScript URL — Apex Support Portal (Multi-Parameter Incident View)
// =========================================================================
router.get('/lab3', (req, res) => {
  const lab = getLab(3);
  const returnUrl = req.query.returnUrl || '/RXSS/lab3';
  const ticketId = req.query.ticket_id || 'INC-4920';
  const dept = req.query.dept || 'Infrastructure SRE';
  const viewMode = req.query.view || 'detailed';

  const appHtml = `
  <div style="background-color: #f1f5f9; min-height: 100%; padding-bottom: 60px;">
    <!-- Helpdesk Navbar -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800;">A</div>
          <span style="font-size: 18px; font-weight: 700; color: #0f172a;">Apex Enterprise Helpdesk</span>
        </div>
        <div style="font-size: 13px; color: #64748b;">
          Logged in as <strong>admin@company.internal</strong> • Department: <strong>${escapeHtml(dept)}</strong>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 880px;">
      <!-- Incident Navigation & Action Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
        <a href="${escapeHtml(returnUrl)}" id="btn-return-portal" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #2563eb; text-decoration: none; font-weight: 600; background: #ffffff; border: 1px solid #e2e8f0; padding: 8px 14px; border-radius: 8px;">
          ← Return to Support Portal
        </a>

        <div style="display: flex; gap: 8px;">
          <a href="/RXSS/lab3?ticket_id=INC-4920&dept=Infrastructure&view=detailed&returnUrl=/RXSS/lab3" class="btn btn-sm ${ticketId === 'INC-4920' ? 'btn-primary' : 'btn-secondary'}" style="font-weight: 600;">Incident #4920</a>
          <a href="/RXSS/lab3?ticket_id=INC-5104&dept=Security&view=detailed&returnUrl=/RXSS/lab3" class="btn btn-sm ${ticketId === 'INC-5104' ? 'btn-primary' : 'btn-secondary'}" style="font-weight: 600;">Incident #5104</a>
        </div>
      </div>

      <!-- Ticket Card -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 12px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 4px;">${escapeHtml(ticketId)}</span>
            <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 8px;">Latency Spikes on Primary US-East Edge Gateway</h1>
          </div>
          <span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 999px; border: 1px solid #fde68a;">Investigation In Progress</span>
        </div>

        <div style="border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 18px 0; margin-bottom: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 13px;">
          <div><span style="color: #94a3b8;">Priority:</span> <strong style="color: #ef4444;">P1 - Critical</strong></div>
          <div><span style="color: #94a3b8;">Assigned Engineer:</span> <strong>David Miller (SRE)</strong></div>
          <div><span style="color: #94a3b8;">Department:</span> <strong>${escapeHtml(dept)}</strong></div>
          <div><span style="color: #94a3b8;">View Mode:</span> <strong>${escapeHtml(viewMode)}</strong></div>
        </div>

        <div style="font-size: 14px; color: #334155; line-height: 1.7; margin-bottom: 24px;">
          <p style="margin-bottom: 12px;">
            Edge router node pool B reports intermittent 504 gateway timeout bursts impacting roughly 8.4% of unauthenticated API telemetry streams.
          </p>
          <p>
            Upstream traffic has been shifted to standby cluster availability zones while load balancer health checks are re-evaluated.
          </p>
        </div>

        <!-- Interactive Incident Action Buttons -->
        <div style="display: flex; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <button class="btn btn-sm" onclick="window.showAppToast('Incident updated with diagnostic snapshot', '📝')" style="background: #2563eb; color: #fff; font-weight: 600;">Add Investigation Log</button>
          <button class="btn btn-sm btn-secondary" onclick="window.showAppToast('Escalated to Tier 3 on-call lead', '⚡')" style="font-weight: 600;">Escalate to Tier 3</button>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab4' }));
});

// =========================================================================
// LAB 4: Input Attribute Reflection — NovaHR Directory (Multi-Parameter Search)
// =========================================================================
router.get('/lab4', (req, res) => {
  const lab = getLab(4);
  const nameQuery = req.query.name || '';
  const department = req.query.department || 'all';
  const location = req.query.location || 'all';
  const status = req.query.status || 'active';

  const appHtml = `
  <div style="background-color: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Intranet Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; background: #7c3aed; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800;">N</div>
          <div>
            <span style="font-size: 18px; font-weight: 700; color: #0f172a;">NovaHR People Directory</span>
            <span style="font-size: 11px; color: #7c3aed; background: #f5f3ff; padding: 2px 8px; border-radius: 999px; margin-left: 6px; font-weight: 600;">Internal Staff</span>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 28px;">
        <form method="GET" action="/RXSS/lab4">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px;">Filter Global Directory</label>
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 120px; gap: 10px; align-items: center;">
            <!-- Intentionally unescaped inside double quotes -->
            <input type="text" name="name" value="${nameQuery}" placeholder="Search name (e.g. Marcus, Elena)..."
                   style="padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
            <select name="department" style="padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="all" ${department === 'all' ? 'selected' : ''}>All Depts</option>
              <option value="infra" ${department === 'infra' ? 'selected' : ''}>Infrastructure</option>
              <option value="secops" ${department === 'secops' ? 'selected' : ''}>AppSec</option>
              <option value="eng" ${department === 'eng' ? 'selected' : ''}>Core Eng</option>
            </select>
            <select name="location" style="padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="all" ${location === 'all' ? 'selected' : ''}>All Locations</option>
              <option value="sf" ${location === 'sf' ? 'selected' : ''}>San Francisco</option>
              <option value="zurich" ${location === 'zurich' ? 'selected' : ''}>Zurich</option>
              <option value="london" ${location === 'london' ? 'selected' : ''}>London</option>
            </select>
            <select name="status" style="padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="active" ${status === 'active' ? 'selected' : ''}>Active Status</option>
              <option value="remote" ${status === 'remote' ? 'selected' : ''}>Remote Only</option>
            </select>
            <button type="submit" class="btn" style="background: #7c3aed; color: #fff; font-weight: 600; padding: 10px 16px; border-radius: 8px;">Filter</button>
          </div>
        </form>
      </div>

      <!-- Personnel Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div class="hr-person-card" data-dept="infra" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px;">MV</div>
            <div>
              <div style="font-weight: 700; font-size: 16px; color: #0f172a;">Dr. Marcus Vance</div>
              <div style="font-size: 13px; color: #64748b;">Principal Systems Architect</div>
              <div style="font-size: 11px; color: #7c3aed; font-weight: 600; margin-top: 4px;">Infrastructure • San Francisco, CA</div>
            </div>
          </div>
          <button type="button" class="btn btn-sm" onclick="window.showAppToast('Loaded employee record for Dr. Marcus Vance', '👤')" style="color: #7c3aed; background: #f5f3ff; border: 1px solid #ddd6fe; font-weight: 600; width: 100%; padding: 6px 0;">View HR Dossier →</button>
        </div>

        <div class="hr-person-card" data-dept="secops" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px;">ER</div>
            <div>
              <div style="font-weight: 700; font-size: 16px; color: #0f172a;">Elena Rostova</div>
              <div style="font-size: 13px; color: #64748b;">Lead Security Engineer</div>
              <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 4px;">AppSec • Zurich, CH</div>
            </div>
          </div>
          <button type="button" class="btn btn-sm" onclick="window.showAppToast('Loaded employee record for Elena Rostova', '👤')" style="color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; font-weight: 600; width: 100%; padding: 6px 0;">View HR Dossier →</button>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab5' }));
});

// =========================================================================
// LAB 5: Attribute Injection Without < and > — SwiftTrack Logistics
// =========================================================================
router.get('/lab5', (req, res) => {
  const lab = getLab(5);
  let trackingId = req.query.tracking_id || '';
  const carrier = req.query.carrier || 'SwiftExpress';
  const postal = req.query.postal || '';
  const sanitizedTrackingId = trackingId.replace(/[<>]/g, '');

  const appHtml = `
  <div style="background-color: #0f172a; min-height: 100%; color: #f8fafc; padding-bottom: 60px;">
    <!-- Logistics Header -->
    <header style="background: #1e293b; border-bottom: 1px solid #334155; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800;">⚡</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc; letter-spacing: -0.01em;">SwiftTrack Global Freight</div>
            <div style="font-size: 11px; color: #94a3b8;">Worldwide Cargo & Container Logistics</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 36px; max-width: 860px;">
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-bottom: 28px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">Track Freight Consignment</h2>
        <form method="GET" action="/RXSS/lab5">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 140px; gap: 10px;">
            <!-- Strips < and >, but unescaped double quotes -->
            <input type="text" name="tracking_id" value="${sanitizedTrackingId}" placeholder="Waybill Number (e.g. SWF-9941)..."
                   style="padding: 11px 16px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 14px; outline: none;">
            <select name="carrier" style="padding: 11px 12px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="SwiftExpress" ${carrier === 'SwiftExpress' ? 'selected' : ''}>Swift Express</option>
              <option value="AirCargo" ${carrier === 'AirCargo' ? 'selected' : ''}>Air Cargo Int'l</option>
              <option value="OceanLine" ${carrier === 'OceanLine' ? 'selected' : ''}>Ocean Freight</option>
            </select>
            <input type="text" name="postal" value="${escapeHtml(postal)}" placeholder="Dest. ZIP code..."
                   style="padding: 11px 14px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 14px; outline: none;">
            <button type="submit" class="btn btn-primary" style="background: #0284c7; border-color: #0284c7; padding: 11px 16px; font-weight: 600;">Track Cargo</button>
          </div>
        </form>
      </div>

      ${sanitizedTrackingId ? `
      <!-- Shipment Tracking Stepper -->
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 12px; color: #94a3b8;">WAYBILL REFERENCE:</span>
            <div style="font-size: 18px; font-weight: 700; color: #38bdf8; font-family: var(--font-mono);">${escapeHtml(sanitizedTrackingId)}</div>
          </div>
          <div>
            <span style="font-size: 12px; color: #94a3b8;">CARRIER ROUTE:</span>
            <div style="font-size: 14px; font-weight: 600; color: #f8fafc;">${escapeHtml(carrier)}</div>
          </div>
          <span style="background: #064e3b; color: #34d399; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px;">In Transit</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; font-size: 12px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
            <div style="color: #10b981; font-weight: 700;">✓ Picked Up</div>
            <div style="color: #64748b; margin-top: 2px;">Singapore Hub</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155;">
            <div style="color: #10b981; font-weight: 700;">✓ Customs Cleared</div>
            <div style="color: #64748b; margin-top: 2px;">Changi Air Hub</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #0284c7;">
            <div style="color: #38bdf8; font-weight: 700;">✈ Inter-hub Transit</div>
            <div style="color: #94a3b8; margin-top: 2px;">Flight SQ-024</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #334155; opacity: 0.5;">
            <div style="color: #94a3b8; font-weight: 700;">Pending Delivery</div>
            <div style="color: #64748b; margin-top: 2px;">Frankfurt Hub</div>
          </div>
        </div>
      </div>` : ''}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab6' }));
});

// =========================================================================
// LAB 6: Function Filtering — EchoFeedback Portal (Multi-Parameter Survey Lookup)
// =========================================================================
router.get('/lab6', (req, res) => {
  const lab = getLab(6);
  const feedbackRef = req.query.feedback_ref || '';
  const orderNum = req.query.order_num || 'ORD-7741';
  const category = req.query.category || 'Product Quality';

  const hasBlockedFunc = /\b(alert|prompt)\b/i.test(feedbackRef);
  let feedbackContent = feedbackRef;

  if (hasBlockedFunc) {
    feedbackContent = `<span style="color: #dc2626; font-weight: 500;">[System Message: Input contained prohibited expression.]</span>`;
  }

  const appHtml = `
  <div style="background-color: #faf5ff; min-height: 100%; padding-bottom: 60px;">
    <!-- Feedback Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #f3e8ff; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #9333ea; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px;">⭐</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #581c87;">EchoFeedback Survey Desk</div>
            <div style="font-size: 11px; color: #7e22ce;">Customer Delight & Experience Ratings</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 36px; max-width: 840px;">
      <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 14px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(147,51,234,0.04); margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #3b0764; margin-bottom: 6px;">Customer Satisfaction Survey Verification</h2>
        <p style="font-size: 13px; color: #6b7280; margin-bottom: 20px;">Lookup your submitted survey response using your verification code and order metadata.</p>

        <form method="GET" action="/RXSS/lab6">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 140px; gap: 10px;">
            <input type="text" name="feedback_ref" value="${escapeHtml(feedbackRef)}" placeholder="Survey Ref Code (e.g. SURV-990)..."
                   style="padding: 10px 16px; border: 1px solid #d8b4fe; border-radius: 8px; font-size: 14px; outline: none;">
            <input type="text" name="order_num" value="${escapeHtml(orderNum)}" placeholder="Order #"
                   style="padding: 10px 12px; border: 1px solid #d8b4fe; border-radius: 8px; font-size: 13px;">
            <select name="category" style="padding: 10px 12px; border: 1px solid #d8b4fe; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="Product Quality" ${category === 'Product Quality' ? 'selected' : ''}>Product Quality</option>
              <option value="Delivery Speed" ${category === 'Delivery Speed' ? 'selected' : ''}>Delivery Speed</option>
              <option value="Customer Support" ${category === 'Customer Support' ? 'selected' : ''}>Support Desk</option>
            </select>
            <button type="submit" class="btn" style="background: #9333ea; color: #fff; font-weight: 600; padding: 10px 16px; border-radius: 8px;">Check Survey</button>
          </div>
        </form>
      </div>

      ${feedbackRef ? `
      <div style="background: #ffffff; border: 1px solid #e9d5ff; border-radius: 14px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span style="font-size: 12px; font-weight: 700; color: #7e22ce; text-transform: uppercase;">Recorded Review Preview</span>
            <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Order: <strong>${escapeHtml(orderNum)}</strong> • Category: <strong>${escapeHtml(category)}</strong></div>
          </div>
          <span style="color: #eab308; font-size: 14px;">★★★★★ (5.0)</span>
        </div>
        <div class="feedback-preview" style="font-size: 14px; color: #1e1b4b; background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 18px;">
          ${feedbackContent}
        </div>
      </div>` : ''}
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab7' }));
});

// =========================================================================
// LAB 7: Keyword Sanitization — OmniMetrics Analytics (Multi-Parameter Console)
// =========================================================================
router.get('/lab7', (req, res) => {
  const lab = getLab(7);
  const metricFilter = req.query.metric_filter || '';
  const timeframe = req.query.timeframe || '1h';
  const cluster = req.query.cluster || 'prod-us-east';
  const aggregation = req.query.aggregation || 'p99';

  const hasKeyword = /(alert|prompt|confirm)/i.test(metricFilter);
  let renderedFilter = metricFilter;

  if (hasKeyword) {
    renderedFilter = `<span style="color: #ef4444; font-weight: 600;">[Metric Query Error: Restricted expression detected]</span>`;
  }

  const appHtml = `
  <div style="background-color: #0b0f19; min-height: 100%; color: #e2e8f0; padding-bottom: 60px;">
    <!-- Dashboard Header -->
    <header style="background: #111827; border-bottom: 1px solid #1f2937; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">Ω</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">OmniMetrics Cloud Telemetry</div>
            <div style="font-size: 11px; color: #94a3b8;">Real-Time Query Ingress & Edge Aggregator</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #10b981; background: #064e3b; padding: 4px 10px; border-radius: 999px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span> Ingress Active
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px;">
      <!-- Search Metric Bar with Multi-Parameters -->
      <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <form method="GET" action="/RXSS/lab7">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 140px; gap: 10px;">
            <input type="text" name="metric_filter" value="${escapeHtml(metricFilter)}" placeholder="Query stream (e.g. latency_p99, ingress_mb)..."
                   style="padding: 10px 16px; border: 1px solid #374151; background: #0b0f19; color: #f8fafc; border-radius: 8px; font-size: 14px; outline: none;">
            <select name="timeframe" style="padding: 10px 12px; border: 1px solid #374151; background: #0b0f19; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="15m" ${timeframe === '15m' ? 'selected' : ''}>Last 15 Mins</option>
              <option value="1h" ${timeframe === '1h' ? 'selected' : ''}>Last 1 Hour</option>
              <option value="24h" ${timeframe === '24h' ? 'selected' : ''}>Last 24 Hours</option>
            </select>
            <select name="cluster" style="padding: 10px 12px; border: 1px solid #374151; background: #0b0f19; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="prod-us-east" ${cluster === 'prod-us-east' ? 'selected' : ''}>prod-us-east</option>
              <option value="prod-eu-west" ${cluster === 'prod-eu-west' ? 'selected' : ''}>prod-eu-west</option>
              <option value="prod-ap-south" ${cluster === 'prod-ap-south' ? 'selected' : ''}>prod-ap-south</option>
            </select>
            <select name="aggregation" style="padding: 10px 12px; border: 1px solid #374151; background: #0b0f19; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="p99" ${aggregation === 'p99' ? 'selected' : ''}>Percentile (p99)</option>
              <option value="p95" ${aggregation === 'p95' ? 'selected' : ''}>Percentile (p95)</option>
              <option value="avg" ${aggregation === 'avg' ? 'selected' : ''}>Average</option>
            </select>
            <button type="submit" class="btn btn-primary" style="background: #06b6d4; border-color: #06b6d4; font-weight: 600; padding: 10px 16px;">Query Stream</button>
          </div>
        </form>
      </div>

      ${metricFilter ? `
      <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 12px; font-weight: 700; color: #06b6d4; text-transform: uppercase;">Active Stream Filter</div>
          <div style="font-size: 12px; color: #94a3b8;">Cluster: <strong>${escapeHtml(cluster)}</strong> • Window: <strong>${escapeHtml(timeframe)}</strong> • Agg: <strong>${escapeHtml(aggregation)}</strong></div>
        </div>
        <div style="font-size: 15px; color: #f8fafc; margin-top: 6px;">${renderedFilter}</div>
      </div>` : ''}

      <!-- Metric Telemetry Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; color: #94a3b8;">Cluster Latency (${escapeHtml(aggregation)})</div>
          <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin: 6px 0;">18.4 ms</div>
          <div style="font-size: 11px; color: #10b981;">↓ 2.1% past window</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; color: #94a3b8;">Ingress Throughput</div>
          <div style="font-size: 24px; font-weight: 800; color: #a855f7; margin: 6px 0;">482.6 MB/s</div>
          <div style="font-size: 11px; color: #10b981;">↑ 8.4% capacity</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; color: #94a3b8;">Memory Pool Pressure</div>
          <div style="font-size: 24px; font-weight: 800; color: #10b981; margin: 6px 0;">32.8%</div>
          <div style="font-size: 11px; color: #94a3b8;">Optimal range</div>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab8' }));
});

// =========================================================================
// LAB 8: Parentheses Restriction — CryptoCalc Discounts (Multi-Parameter Checkout)
// =========================================================================
router.get('/lab8', (req, res) => {
  const lab = getLab(8);
  const coupon = req.query.coupon || '';
  const tier = req.query.tier || 'enterprise';
  const cycle = req.query.cycle || 'annual';
  const currency = req.query.currency || 'USD';

  const hasParens = /[()]/.test(coupon);
  let couponOutput = coupon;

  if (hasParens) {
    couponOutput = `<span style="color: #ef4444;">[Coupon Validation Error: Invalid voucher format]</span>`;
  }

  const appHtml = `
  <div style="background-color: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Checkout Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #059669; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800;">$</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #065f46;">CryptoCalc Pro</div>
            <div style="font-size: 11px; color: #64748b;">Automated Yield & Tax Calculator</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 36px; max-width: 780px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Subscription Licensing & Billing</h2>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 24px;">Configure subscription parameters and apply enterprise promotional codes.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; color: #0f172a;">CryptoCalc Enterprise Tier (${escapeHtml(cycle)})</div>
            <div style="font-size: 12px; color: #64748b;">Multi-wallet automated portfolio accounting & live feeds</div>
          </div>
          <div style="font-size: 20px; font-weight: 800; color: #059669;">$299.00 / yr</div>
        </div>

        <form method="GET" action="/RXSS/lab8" style="margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Tier</label>
              <select name="tier" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
                <option value="enterprise" ${tier === 'enterprise' ? 'selected' : ''}>Enterprise Tier ($299/yr)</option>
                <option value="pro" ${tier === 'pro' ? 'selected' : ''}>Pro Individual ($99/yr)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Billing Cycle</label>
              <select name="cycle" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
                <option value="annual" ${cycle === 'annual' ? 'selected' : ''}>Annual (Save 20%)</option>
                <option value="monthly" ${cycle === 'monthly' ? 'selected' : ''}>Monthly Billing</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px;">Currency</label>
              <select name="currency" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;">
                <option value="USD" ${currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                <option value="EUR" ${currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                <option value="USDT" ${currency === 'USDT' ? 'selected' : ''}>USDT</option>
              </select>
            </div>
          </div>

          <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Promotional Voucher Code</label>
          <div style="display: flex; gap: 10px;">
            <input type="text" name="coupon" value="${escapeHtml(coupon)}" placeholder="Enter voucher (e.g. ALPHA20)..."
                   style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
            <button type="submit" class="btn" style="background: #059669; color: #fff; font-weight: 600; padding: 10px 20px; border-radius: 8px;">Apply Voucher</button>
          </div>
        </form>

        ${coupon ? `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px;">
          <span style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Applied Promotional Code</span>
          <div style="font-size: 14px; color: #14532d; margin-top: 4px;">${couponOutput}</div>
        </div>` : ''}
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab9' }));
});

// =========================================================================
// LAB 9: JavaScript Context — VibeStream Theme Studio (Multi-Parameter Engine)
// =========================================================================
router.get('/lab9', (req, res) => {
  const lab = getLab(9);
  const accent = req.query.accent || '#6366f1';
  const themeName = req.query.theme_name || 'CyberDark';
  const layout = req.query.layout || 'split';

  const appHtml = `
  <div style="background-color: #0f172a; min-height: 100%; color: #f8fafc; padding-bottom: 60px;">
    <!-- Studio Header -->
    <header style="background: #1e293b; border-bottom: 1px solid #334155; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎨</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">VibeStream Studio</div>
            <div style="font-size: 11px; color: #94a3b8;">Creator Overlays & Theme Engine</div>
          </div>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 36px; max-width: 860px;">
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-bottom: 28px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;">Overlay Accent Customization</h2>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 20px;">Choose theme presets and hex accent colors for your live broadcast widget.</p>

        <form method="GET" action="/RXSS/lab9">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 140px; gap: 10px;">
            <select name="theme_name" style="padding: 10px 12px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="CyberDark" ${themeName === 'CyberDark' ? 'selected' : ''}>CyberDark</option>
              <option value="NeonSynth" ${themeName === 'NeonSynth' ? 'selected' : ''}>NeonSynth</option>
              <option value="EmeraldGlow" ${themeName === 'EmeraldGlow' ? 'selected' : ''}>EmeraldGlow</option>
            </select>
            <input type="text" name="accent" value="${escapeHtml(accent)}" placeholder="Accent color (e.g. coral, #8b5cf6)..."
                   style="padding: 10px 16px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 14px; outline: none;">
            <select name="layout" style="padding: 10px 12px; border: 1px solid #475569; background: #0f172a; color: #f8fafc; border-radius: 8px; font-size: 13px;">
              <option value="split" ${layout === 'split' ? 'selected' : ''}>Split Screen</option>
              <option value="pip" ${layout === 'pip' ? 'selected' : ''}>Picture-in-Picture</option>
            </select>
            <button type="submit" class="btn btn-primary" style="background: #8b5cf6; border-color: #8b5cf6; font-weight: 600; padding: 10px 16px;">Apply Theme</button>
          </div>
        </form>
      </div>

      <!-- Live Stream Preview Canvas -->
      <div id="theme-preview-box" style="background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 32px; text-align: center;">
        <div style="width: 72px; height: 72px; margin: 0 auto 16px; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 32px;">🎮</div>
        <h3 id="preview-heading" style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;">${escapeHtml(themeName)} Stream Overlay Preview</h3>
        <p style="font-size: 13px; color: #94a3b8;">Active theme layout: <strong>${escapeHtml(layout)}</strong></p>
      </div>
    </div>
  </div>

  <!-- Intentionally vulnerable JavaScript Context -->
  <script>
    var currentTheme = "${themeName}";
    var customAccent = "${accent}";
    
    function applyStudioTheme() {
      var box = document.getElementById('theme-preview-box');
      if (box && customAccent) {
        box.style.borderTop = "6px solid " + customAccent;
      }
    }
    applyStudioTheme();
  </script>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab10' }));
});

// =========================================================================
// LAB 10: Hidden Parameter Through JavaScript Analysis — CloudPeak Telemetry
// =========================================================================
router.get('/lab10/static/telemetry-monitor.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`/**
 * CloudPeak Enterprise Telemetry SDK v2.4.1
 * (c) CloudPeak Systems Inc. Internal Distribution
 * 
 * Registered API Ingress Endpoints:
 * - GET /RXSS/lab10/api/v2/cluster/health      (Params: zone, verbose, format)
 * - GET /RXSS/lab10/api/v2/metrics/stream      (Params: metric_id, range, interval)
 * - GET /RXSS/lab10/api/v2/nodes/inventory     (Params: cluster_id, limit, sort)
 * - GET /RXSS/lab10/api/v2/logs/export         (Params: service, compress, token)
 * - GET /RXSS/lab10/api/v2/diagnostics/raw-trace  (Internal Diagnostic Ingress: /RXSS/lab10/diagnostic?debug_trace=)
 * 
 * Compatible with Arjun & Param-Miner parameter fuzzers.
 */

const CloudPeakClient = {
  getClusterHealth: function(zone = 'us-east-1') {
    return fetch('/RXSS/lab10/api/v2/cluster/health?zone=' + encodeURIComponent(zone)).then(r => r.json());
  },
  getMetricsStream: function(metric = 'p99_latency') {
    return fetch('/RXSS/lab10/api/v2/metrics/stream?metric_id=' + encodeURIComponent(metric)).then(r => r.json());
  },
  getNodesInventory: function() {
    return fetch('/RXSS/lab10/api/v2/nodes/inventory?cluster_id=prod-01').then(r => r.json());
  },
  triggerLogExport: function(service = 'auth') {
    return fetch('/RXSS/lab10/api/v2/logs/export?service=' + encodeURIComponent(service)).then(r => r.json());
  },
  runDiagnosticsTrace: function(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return fetch('/RXSS/lab10/api/v2/diagnostics/raw-trace?' + qs);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("[CloudPeak SDK] Telemetry agent initialized. Available endpoints:", [
    "/RXSS/lab10/api/v2/cluster/health",
    "/RXSS/lab10/api/v2/metrics/stream",
    "/RXSS/lab10/api/v2/nodes/inventory",
    "/RXSS/lab10/api/v2/logs/export",
    "/RXSS/lab10/api/v2/diagnostics/raw-trace"
  ]);
});
`);
});

// API Endpoints for reconnaissance
router.get('/lab10/api/v2/cluster/health', (req, res) => {
  res.json({ status: "healthy", zone: req.query.zone || "us-east-1", healthyNodes: 8, totalNodes: 8, loadAverage: 0.42 });
});

router.get('/lab10/api/v2/metrics/stream', (req, res) => {
  res.json({ metric: req.query.metric_id || "p99_latency", values: [18.4, 18.2, 19.0, 18.5, 18.4], unit: "ms", interval: "10s" });
});

router.get('/lab10/api/v2/nodes/inventory', (req, res) => {
  res.json({ cluster: req.query.cluster_id || "prod-01", nodes: [{ id: "node-us-east-1a", role: "Worker", status: "Healthy" }, { id: "node-us-east-1b", role: "Ingress", status: "Healthy" }] });
});

router.get('/lab10/api/v2/logs/export', (req, res) => {
  res.json({ service: req.query.service || "auth", export_job: "exp_" + Date.now(), status: "Ready for download" });
});

// Vulnerable reflection endpoint (also aliases /diagnostic for test backwards compatibility)
function handleDiagnosticReflection(req, res) {
  const lab = getLab(10);
  const debugTrace = req.query.debug_trace || '';
  const nodeId = req.query.node_id || 'primary-gateway';
  const format = req.query.format || 'text';

  const diagnosticHtml = `
  <div style="background: #0a0e17; color: #e2e8f0; font-family: var(--font-mono); min-height: 100%; padding: 40px 0;">
    <div class="container-narrow">
      <div style="background: #111827; border: 1px solid #1f2937; border-radius: 10px; padding: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #1f2937; padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <span style="color: #38bdf8; font-weight: 700;">[CloudPeak Diagnostic Ingress Terminal]</span>
          <a href="/RXSS/lab10" style="color: #94a3b8; text-decoration: none; font-size: 13px;">← Return to Main Console</a>
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div style="color: #10b981;">> DIAGNOSTIC TRACE BUFFER INITIALIZED for [${escapeHtml(nodeId)}] (Format: ${escapeHtml(format)})</div>
          <div style="color: #e2e8f0; margin: 14px 0; background: #0b0f19; padding: 14px; border-radius: 6px; border: 1px solid #1f2937;">
            ${debugTrace ? `Trace Buffer Output: ${debugTrace}` : '<span style="color: #64748b;">Target node online. No trace parameter supplied.</span>'}
          </div>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, diagnosticHtml, { nextLabUrl: '/RXSS/lab11' }));
}

router.get('/lab10/api/v2/diagnostics/raw-trace', handleDiagnosticReflection);
router.get('/lab10/diagnostic', handleDiagnosticReflection);

router.get('/lab10', (req, res) => {
  const lab = getLab(10);

  const appHtml = `
  <div style="background-color: #0b0f19; min-height: 100%; color: #f8fafc; padding-bottom: 60px;">
    <!-- Console Header -->
    <header style="background: #111827; border-bottom: 1px solid #1f2937; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">☁</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">CloudPeak Systems Management</div>
            <div style="font-size: 11px; color: #94a3b8;">Multi-Cluster Telemetry Ingress</div>
          </div>
        </div>
        <span style="background: #064e3b; color: #34d399; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px;">Node Status: 100% Operational</span>
      </div>
    </header>

    <div class="container" style="padding-top: 36px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Active Compute Clusters</div>
          <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 6px;">8 / 8 Online</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Aggregated Memory Load</div>
          <div style="font-size: 24px; font-weight: 800; color: #a855f7; margin-top: 6px;">14.2 GB / 64 GB</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Network Throughput</div>
          <div style="font-size: 24px; font-weight: 800; color: #10b981; margin-top: 6px;">1.42 Gbps</div>
        </div>
      </div>

      <div style="background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc;">Cluster Telemetry Query Controls</h3>
          <span style="font-size: 12px; color: #60a5fa; font-family: var(--font-mono);">Agent SDK v2.4.1 Active</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: #0b0f19; padding: 16px; border-radius: 8px; border: 1px solid #1f2937;">
            <div style="font-size: 13px; font-weight: 600; color: #38bdf8; margin-bottom: 8px;">Health Probe Ingress</div>
            <div style="display: flex; gap: 8px;">
              <select id="zone-select" style="flex: 1; padding: 8px; background: #111827; color: #fff; border: 1px solid #374151; border-radius: 6px; font-size: 12px;">
                <option value="us-east-1">us-east-1</option>
                <option value="eu-west-1">eu-west-1</option>
              </select>
              <button class="btn btn-sm btn-primary" onclick="CloudPeakClient.getClusterHealth(document.getElementById('zone-select').value).then(d => window.showAppToast('Cluster status: ' + d.status, '📡'))" style="background: #2563eb;">Probe Zone</button>
            </div>
          </div>
          <div style="background: #0b0f19; padding: 16px; border-radius: 8px; border: 1px solid #1f2937;">
            <div style="font-size: 13px; font-weight: 600; color: #38bdf8; margin-bottom: 8px;">Metrics Export</div>
            <div style="display: flex; gap: 8px;">
              <select id="metric-select" style="flex: 1; padding: 8px; background: #111827; color: #fff; border: 1px solid #374151; border-radius: 6px; font-size: 12px;">
                <option value="p99_latency">p99_latency</option>
                <option value="mem_pressure">mem_pressure</option>
              </select>
              <button class="btn btn-sm btn-primary" onclick="CloudPeakClient.getMetricsStream(document.getElementById('metric-select').value).then(d => window.showAppToast('Stream loaded: ' + d.metric, '📊'))" style="background: #059669;">Fetch Stream</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script src="/RXSS/lab10/static/telemetry-monitor.js"></script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/RXSS/lab11' }));
});

// =========================================================================
// LAB 11: Multi-Step Fuzzing & Parameter Discovery — NextGen Enterprise
// =========================================================================
router.get('/lab11/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Disallow: /RXSS/lab11/dev/
`);
});

router.get('/lab11/dev', (req, res) => {
  const lab = getLab(11);
  const html = `
  <div style="background: #fafafa; min-height: 100%; padding: 40px 0;">
    <div class="container-narrow">
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px;">
        <h2 style="font-size: 18px; color: #111827; margin-bottom: 12px;">Directory Index: /dev</h2>
        <p style="font-size: 14px; color: #4b5563;">
          Development build artifacts. Staging active deployments are located under the <a href="/RXSS/lab11/dev/active">/active</a> directory.
        </p>
      </div>
    </div>
  </div>`;
  res.send(renderLabShell(lab, html, { nextLabUrl: '/SXSS' }));
});

router.get('/lab11/dev/active', (req, res) => {
  const lab = getLab(11);
  const html = `
  <div style="background: #fafafa; min-height: 100%; padding: 40px 0;">
    <div class="container-narrow">
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 28px;">
        <h2 style="font-size: 18px; color: #111827; margin-bottom: 12px;">Directory Index: /dev/active</h2>
        <ul style="padding-left: 20px; font-size: 14px; color: #2563eb;">
          <li><a href="/RXSS/lab11/dev/active/review.html">review.html</a> (Staging QA Target Inspector)</li>
        </ul>
      </div>
    </div>
  </div>`;
  res.send(renderLabShell(lab, html, { nextLabUrl: '/SXSS' }));
});

router.get('/lab11/dev/active/review.html', (req, res) => {
  const lab = getLab(11);
  const id = req.query.id;
  const section = req.query.section || 'overview';
  const format = req.query.format || 'html';

  const html = `
  <div style="background: #fafafa; min-height: 100%; padding: 40px 0;">
    <div class="container-narrow">
      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-size: 12px; color: #2563eb; background: #eff6ff; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono);">INTERNAL STAGING QA</span>
            <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin-top: 8px;">Target Quality Review Inspector</h1>
          </div>
          <div style="font-size: 12px; color: #6b7280;">Section: <strong>${escapeHtml(section)}</strong> • Format: <strong>${escapeHtml(format)}</strong></div>
        </div>

        ${id !== undefined ? `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="font-size: 16px; color: #166534; margin-bottom: 6px;">Reviewing Target: ${id}</h2>
          <p style="font-size: 13px; color: #15803d;">Staging item verification completed.</p>
        </div>` : `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <div style="font-size: 14px; color: #92400e; font-weight: 500;">No Target Selected</div>
          <p style="font-size: 13px; color: #b45309; margin-top: 4px;">Supply a target parameter to review a build component.</p>
        </div>`}
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, html, { nextLabUrl: '/SXSS' }));
});

// Clean Realistic Enterprise Landing Page — No Spoilers!
router.get('/lab11', (req, res) => {
  const lab = getLab(11);

  const appHtml = `
  <div style="background: #0f172a; min-height: 100%; color: #f8fafc; padding-bottom: 60px;">
    <!-- Enterprise Header -->
    <header style="background: #1e293b; border-bottom: 1px solid #334155; padding: 18px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">N</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">NextGen Enterprise Gateway</div>
            <div style="font-size: 11px; color: #94a3b8;">Continuous Integration & Automated Delivery Pipeline</div>
          </div>
        </div>
        <span style="font-size: 12px; color: #94a3b8; font-family: var(--font-mono);">Gateway v3.1.2-RELEASE</span>
      </div>
    </header>

    <div class="container" style="padding-top: 48px; max-width: 800px;">
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center;">
        <div style="width: 64px; height: 64px; background: #0f172a; border: 1px solid #334155; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px;">🛡️</div>
        <h1 style="font-size: 24px; font-weight: 800; color: #f8fafc; margin-bottom: 12px;">Enterprise Staging Gateway</h1>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; max-width: 580px; margin: 0 auto 28px;">
          You have reached the secure gateway for NextGen Enterprise deployment clusters. Unauthorized attempts to discover internal staging files or automated fuzzing are logged and monitored.
        </p>

        <div style="display: inline-flex; gap: 12px;">
          <button class="btn btn-primary" onclick="window.showAppToast('Enterprise SSO identity provider dispatched', '🔐')" style="background: #0284c7; border-color: #0284c7; font-weight: 600;">Enterprise SSO Login</button>
          <button class="btn btn-secondary" onclick="window.showAppToast('System clusters operational across all AZs', '🟢')" style="background: #0f172a; border-color: #334155; color: #f8fafc;">System Status</button>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/SXSS' }));
});

module.exports = router;
