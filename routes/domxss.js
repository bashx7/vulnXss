// routes/domxss.js - Comprehensive Implementation of all 7 DOM-Based XSS Mini-Applications

const express = require('express');
const router = express.Router();
const labsData = require('../data/labs');
const { renderLabShell, escapeHtml } = require('../utils/renderLab');
const { renderCategoryPage } = require('../views/platformPages');

const DOMXSS_LABS = labsData.DOMXSS;

function getLab(num) {
  return DOMXSS_LABS.find(l => l.number === num);
}

// Category collection page: /DOMXSS
router.get('/', (req, res) => {
  res.send(renderCategoryPage('DOMXSS'));
});

// =========================================================================
// LAB 1: Location Source — AeroRoute Travel Planner (Multi-Parameter Flight Search)
// =========================================================================
router.get('/lab1', (req, res) => {
  const lab = getLab(1);

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Flight Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">✈</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">AeroRoute Travel Planner</div>
            <div style="font-size: 11px; color: #64748b;">Global Multi-City Flights & Itineraries</div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; font-size: 13px; font-weight: 600; color: #475569;">
          <span style="color: #0284c7; cursor: pointer;">Search Flights</span>
          <span style="cursor: pointer;" onclick="window.showAppToast('My Bookings: 1 Active Itinerary', '🎫')">My Trips (1)</span>
          <span style="cursor: pointer;" onclick="window.showAppToast('Miles Balance: 42,800 Pts', '⭐')">Miles Club</span>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 28px; max-width: 960px;">
      <!-- Dynamic Breadcrumb Navigation Sink (Source: location.href) -->
      <div id="breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 20px; padding: 10px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
        Loading route path...
      </div>

      <!-- Search Flight Parameters Form -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <form method="GET" action="/DOMXSS/lab1" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 120px; gap: 12px; align-items: flex-end;">
          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">Origin</label>
            <input type="text" name="origin" value="New York (JFK)" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 600;">
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">Destination</label>
            <input type="text" name="destination" value="London Heathrow (LHR)" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 600;">
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">Cabin Class</label>
            <select name="cabin" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: #fff;">
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business" selected>Business Class</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">Departure Date</label>
            <input type="date" name="depart_date" value="2026-10-15" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;">
          </div>
          <div>
            <button type="submit" class="btn btn-primary" style="width: 100%; background: #0284c7; border-color: #0284c7; font-weight: 600; padding: 9px 0;">Find Flights</button>
          </div>
        </form>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a;">Available Nonstop & Direct Itineraries</h2>
        <div style="display: flex; gap: 8px; font-size: 12px; font-weight: 600;">
          <span style="background: #0284c7; color: #fff; padding: 4px 10px; border-radius: 6px; cursor: pointer;">All Flights</span>
          <span style="background: #fff; border: 1px solid #cbd5e1; color: #475569; padding: 4px 10px; border-radius: 6px; cursor: pointer;" onclick="window.showAppToast('Filtered by Cheapest Fare', '💲')">Cheapest First</span>
          <span style="background: #fff; border: 1px solid #cbd5e1; color: #475569; padding: 4px 10px; border-radius: 6px; cursor: pointer;" onclick="window.showAppToast('Filtered by Fastest Flight Time', '⏱')">Fastest</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 16px; font-weight: 800; color: #0284c7;">JFK ➔ LHR</span>
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">$640</span>
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">British Airways • Flight BA-178</div>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Boeing 787-9 • Direct • 6h 55m (Evening 19:30)</div>
          <button class="btn btn-primary" onclick="window.showAppToast('Flight BA-178 selected for booking', '✈️')" style="width: 100%; background: #0284c7; border-color: #0284c7; font-weight: 600;">Select Flight</button>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 16px; font-weight: 800; color: #0284c7;">SFO ➔ NRT</span>
            <span style="font-size: 18px; font-weight: 800; color: #0f172a;">$890</span>
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">Japan Airlines • Flight JL-001</div>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Airbus A350-1000 • Direct • 11h 10m (11:15)</div>
          <button class="btn btn-primary" onclick="window.showAppToast('Flight JL-001 selected for booking', '✈️')" style="width: 100%; background: #0284c7; border-color: #0284c7; font-weight: 600;">Select Flight</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    document.addEventListener("DOMContentLoaded", function() {
      // Source: location.href
      // Sink: innerHTML
      var currentUrl = window.location.href;
      var breadcrumb = document.getElementById('breadcrumb');
      if (breadcrumb) {
        breadcrumb.innerHTML = "<span>📍 Active Route Telemetry:</span> " + currentUrl;
      }
    });
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab2' }));
});

// =========================================================================
// LAB 2: Query Parameter — DocsFlow Developer Knowledge Base
// =========================================================================
router.get('/lab2', (req, res) => {
  const lab = getLab(2);

  const appHtml = `
  <div style="background: #fafafa; min-height: 100%; padding-bottom: 60px;">
    <!-- Docs Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #111827; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">📚</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #111827;">DocsFlow API Reference</div>
            <div style="font-size: 11px; color: #6b7280;">Developer Documentation & SDK Guides</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
          <span style="background: #f3f4f6; color: #374151; padding: 4px 10px; border-radius: 6px; font-family: monospace;">v2.4.0 (Latest)</span>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 960px;">
      <div style="display: grid; grid-template-columns: 240px 1fr; gap: 28px;">
        <!-- API Sidebar Modules -->
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 10px;">Core SDK Modules</div>
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px; font-weight: 600;">
            <div style="padding: 8px 12px; background: #111827; color: #fff; border-radius: 6px; cursor: pointer;">Authentication (OAuth2)</div>
            <div style="padding: 8px 12px; color: #4b5563; border-radius: 6px; cursor: pointer;" onclick="window.showAppToast('Loaded Cryptographic Signatures docs', '🔐')">CryptoClient Signatures</div>
            <div style="padding: 8px 12px; color: #4b5563; border-radius: 6px; cursor: pointer;" onclick="window.showAppToast('Loaded Webhook Delivery docs', '⚡')">Webhook Ingress</div>
            <div style="padding: 8px 12px; color: #4b5563; border-radius: 6px; cursor: pointer;" onclick="window.showAppToast('Loaded Identity SCIM docs', '👥')">Identity & SCIM API</div>
          </div>
        </div>

        <!-- Main Search & Docs Content -->
        <div>
          <form id="docs-search-form" onsubmit="handleSearch(event)" style="display: grid; grid-template-columns: 2fr 1fr 1fr 120px; gap: 8px; margin-bottom: 20px;">
            <input type="text" id="query-input" placeholder="Search API methods (e.g. auth, crypto)..."
                   style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;">
            <select id="module-select" style="padding: 10px 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="all">All Modules</option>
              <option value="auth">OAuth2 & Auth</option>
              <option value="crypto">CryptoSignatures</option>
              <option value="webhooks">Webhooks Ingress</option>
            </select>
            <select id="version-select" style="padding: 10px 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; background: #fff;">
              <option value="v2.4">v2.4 (Latest)</option>
              <option value="v2.3">v2.3</option>
              <option value="v1.0">v1.0 (Legacy)</option>
            </select>
            <button type="submit" class="btn btn-primary" style="padding: 10px 16px; font-weight: 600;">Search</button>
          </form>

          <!-- Search Status Box Sink -->
          <div id="search-status-box" style="display: none; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
            <div id="search-summary" style="font-size: 14px; color: #374151;"></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 15px; color: #2563eb;">CryptoClient.signPayload(bytes, key)</div>
                <span style="font-size: 11px; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Node.js & Go</span>
              </div>
              <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
                Generates deterministic Ed25519 digital signature envelopes for microservice payload integrity checks.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-family: var(--font-mono); font-weight: 700; font-size: 15px; color: #2563eb;">AuthSession.validateJwt(token)</div>
                <span style="font-size: 11px; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-weight: 600;">Security Core</span>
              </div>
              <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
                Verifies RS256 token claims and issuer expiration thresholds against cached JSON Web Key Sets (JWKS).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    function renderQueryStatus() {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      var mod = params.get('module') || 'All';
      if (query) {
        var statusBox = document.getElementById('search-status-box');
        var summaryEl = document.getElementById('search-summary');
        if (statusBox && summaryEl) {
          statusBox.style.display = 'block';
          // Sink: innerHTML
          summaryEl.innerHTML = "Showing documentation results for query: <strong>" + query + "</strong> in module: <em>" + mod + "</em> (0 exact matches)";
          var input = document.getElementById('query-input');
          if (input) input.value = query;
        }
      }
    }

    function handleSearch(e) {
      e.preventDefault();
      var q = document.getElementById('query-input').value;
      var mod = document.getElementById('module-select').value;
      var ver = document.getElementById('version-select').value;
      window.location.search = '?q=' + encodeURIComponent(q) + '&module=' + encodeURIComponent(mod) + '&version=' + encodeURIComponent(ver);
    }

    document.addEventListener("DOMContentLoaded", renderQueryStatus);
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab3' }));
});

// =========================================================================
// LAB 3: Hash Fragment — Zenith Digital Assets (Crypto / DeFi Exchange)
// =========================================================================
router.get('/lab3', (req, res) => {
  const lab = getLab(3);

  const appHtml = `
  <div style="background: #0b0f19; color: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Portfolio Header -->
    <header style="background: #111827; border-bottom: 1px solid #1f2937; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff;">Z</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">Zenith Digital Assets</div>
            <div style="font-size: 11px; color: #94a3b8;">Decentralized Multi-Chain Vault & Swap</div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; font-size: 13px; font-family: monospace;">
          <span style="color: #10b981;">BTC: $64,280.00</span>
          <span style="color: #38bdf8;">ETH: $3,450.20</span>
          <span style="color: #a78bfa;">SOL: $145.80</span>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 900px;">
      <!-- Interactive Section Hash Tabs -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto;">
        <a href="#overview" class="btn btn-secondary btn-sm" style="background: #111827; border-color: #374151; color: #cbd5e1; font-weight: 600; padding: 8px 16px;">📊 Overview</a>
        <a href="#swap" class="btn btn-secondary btn-sm" style="background: #111827; border-color: #374151; color: #cbd5e1; font-weight: 600; padding: 8px 16px;">🔄 Token Swap</a>
        <a href="#staking" class="btn btn-secondary btn-sm" style="background: #111827; border-color: #374151; color: #cbd5e1; font-weight: 600; padding: 8px 16px;">🌱 Staking Pools</a>
        <a href="#security" class="btn btn-secondary btn-sm" style="background: #111827; border-color: #374151; color: #cbd5e1; font-weight: 600; padding: 8px 16px;">🔐 Hardware Vault</a>
      </div>

      <!-- Tab Content Sink Container -->
      <div id="tab-content" style="background: #111827; border: 1px solid #1f2937; border-radius: 14px; padding: 32px;">
        <h3 id="tab-title" style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Portfolio Vault Overview</h3>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Total Vault Valuation: <strong style="color: #38bdf8; font-size: 16px;">$184,920.45 USD</strong><br>
          Select any navigation tab above to inspect dynamic blockchain telemetry.
        </p>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    function updateTabFromHash() {
      var rawHash = window.location.hash;
      if (rawHash) {
        var tabName = decodeURIComponent(rawHash.substring(1));
        var container = document.getElementById('tab-content');
        if (container) {
          // Sink: innerHTML
          container.innerHTML = "<h3 style='font-size: 18px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;'>Active Vault Section: " + tabName + "</h3><p style='font-size: 14px; color: #94a3b8;'>Live blockchain state and asset liquidity loaded for telemetry view.</p>";
        }
      }
    }

    window.addEventListener('hashchange', updateTabFromHash);
    document.addEventListener('DOMContentLoaded', function() {
      if (window.location.hash) {
        updateTabFromHash();
      }
    });
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab4' }));
});

// =========================================================================
// LAB 4: JavaScript Transformation — GlobalFx Currency & Institutional Converter
// =========================================================================
router.get('/lab4', (req, res) => {
  const lab = getLab(4);

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- FX Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #059669; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">💱</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #065f46;">GlobalFx Currency Exchange</div>
            <div style="font-size: 11px; color: #64748b;">Real-Time Institutional Foreign Exchange</div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #10b981; background: #ecfdf5; padding: 4px 10px; border-radius: 999px;">
          Live Interbank Rates Active
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 860px;">
      <!-- Dynamic Promo Banner Sink -->
      <div id="promo-notice-box" style="display: none; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div id="promo-notice" style="font-size: 14px; color: #065f46; font-weight: 600;"></div>
      </div>

      <!-- Live Converter Card -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 20px;">Institutional Forex Calculator</h2>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 12px; font-weight: 700; color: #64748b;">Source Amount (USD)</label>
            <input type="number" id="fx-source" value="10000" style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; margin-top: 4px; font-size: 15px; font-weight: 600;" oninput="document.getElementById('fx-target').value = '€' + (this.value * 0.924).toFixed(2)">
          </div>
          <div style="font-size: 24px; color: #94a3b8; padding-top: 18px;">➔</div>
          <div style="flex: 1; min-width: 200px;">
            <label style="font-size: 12px; font-weight: 700; color: #64748b;">Target Converted (EUR)</label>
            <input type="text" id="fx-target" value="€9,240.00" readonly style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fafc; margin-top: 4px; font-size: 15px; font-weight: 600; color: #059669;">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    document.addEventListener("DOMContentLoaded", function() {
      // Source: ?config= URL parameter
      var params = new URLSearchParams(window.location.search);
      var configStr = params.get('config');
      if (configStr) {
        try {
          // Transformation: JSON.parse
          var configObj = JSON.parse(decodeURIComponent(configStr));
          if (configObj && configObj.notice) {
            var box = document.getElementById('promo-notice-box');
            var noticeEl = document.getElementById('promo-notice');
            if (box && noticeEl) {
              box.style.display = 'block';
              // Sink: innerHTML
              noticeEl.innerHTML = configObj.notice;
            }
          }
        } catch (e) {
          console.error("Malformed configuration payload:", e);
        }
      }
    });
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab5' }));
});

// =========================================================================
// LAB 5: Source-to-Sink Analysis — TaskPilot Agile Workflow
// =========================================================================
router.get('/lab5', (req, res) => {
  const lab = getLab(5);

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Kanban Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #4f46e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">📋</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">TaskPilot Agile Workflow</div>
            <div style="font-size: 11px; color: #64748b;">Sprint Planning & Board Telemetry</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" style="background: #4f46e5; border-color: #4f46e5;" onclick="window.showAppToast('Task story composer initialized', '➕')">+ Create Story</button>
      </div>
    </header>

    <div class="container" style="padding-top: 32px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a;">Active Sprint Board (Sprint #14)</h1>
          <div style="font-size: 13px; color: #64748b;">Telemetry: 12 User Stories in Active Pipeline</div>
        </div>
        <!-- Sink Container -->
        <div id="filter-badge-container"></div>
      </div>

      <!-- Kanban Columns -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 12px;">In Progress (1)</div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Migrate auth tokens to Redis v7</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Assigned: Dan W. • Story Points: 5</div>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; margin-bottom: 12px;">Code Review (1)</div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Optimize composite Postgres index</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Assigned: Lisa M. • Story Points: 3</div>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: #d97706; text-transform: uppercase; margin-bottom: 12px;">Backlog (1)</div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Add webhook retry jitter backoff</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Assigned: Kevin T. • Story Points: 8</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    function extractFilterState() {
      var params = new URLSearchParams(window.location.search);
      return params.get('tag');
    }

    function normalizeFilterData(rawTag) {
      if (!rawTag) return null;
      return rawTag.trim();
    }

    function compileFilterBadge(normalizedTag) {
      return "<span class='diff-badge diff-Easy' style='font-size:13px; padding:4px 12px;'>Filter Tag: " + normalizedTag + "</span>";
    }

    function renderBoardHeader(template) {
      var container = document.getElementById('filter-badge-container');
      if (container && template) {
        container.innerHTML = template;
      }
    }

    document.addEventListener("DOMContentLoaded", function() {
      var raw = extractFilterState();
      var normalized = normalizeFilterData(raw);
      if (normalized) {
        var html = compileFilterBadge(normalized);
        renderBoardHeader(html);
      }
    });
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab6' }));
});

// =========================================================================
// LAB 6: Client-Side Filtering — SanitizePro Markdown & Doc Studio
// =========================================================================
router.get('/lab6', (req, res) => {
  const lab = getLab(6);

  const appHtml = `
  <div style="background: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Editor Header -->
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #fff;">📝</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">SanitizePro Markdown Studio</div>
            <div style="font-size: 11px; color: #64748b;">Live Document Preview & Rendering Engine</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertMarkdown('**Bold Text**')">Bold</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertMarkdown('*Italic*')">Italic</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="insertMarkdown('[Link Text](javascript:...)')">Link</button>
        </div>
      </div>
    </header>

    <div class="container" style="padding-top: 32px; max-width: 920px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 8px;">Document Editor (Markdown / HTML)</label>
          <textarea id="raw-input" rows="10" placeholder="Type document content, links, or notes..."
                    style="width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: var(--font-mono); outline: none;"></textarea>
          <button type="button" class="btn btn-primary" style="margin-top: 12px; font-weight: 600;" onclick="updatePreview()">Render Live Preview</button>
        </div>
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 8px;">Sanitized Live Preview</label>
          <div id="preview-output" style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; min-height: 220px; background: #ffffff; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <span style="color: #94a3b8;">Formatted output renders here...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    function insertMarkdown(snippet) {
      var textarea = document.getElementById('raw-input');
      if (textarea) {
        textarea.value += snippet;
        updatePreview();
      }
    }

    function cleanseInput(str) {
      if (!str) return '';
      var clean = str.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');
      // Flawed single-pass string replacement
      clean = clean.replace('javascript:', '');
      return clean;
    }

    function updatePreview() {
      var raw = document.getElementById('raw-input').value;
      var sanitized = cleanseInput(raw);
      var output = document.getElementById('preview-output');
      if (output) {
        output.innerHTML = sanitized;
      }
    }

    document.addEventListener("DOMContentLoaded", function() {
      var params = new URLSearchParams(window.location.search);
      var contentParam = params.get('content');
      if (contentParam) {
        document.getElementById('raw-input').value = contentParam;
        updatePreview();
      }
    });
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/DOMXSS/lab7' }));
});

// =========================================================================
// LAB 7: Advanced DOM XSS — HyperApp Cloud Orchestrator
// =========================================================================
router.get('/lab7', (req, res) => {
  const lab = getLab(7);

  const appHtml = `
  <div style="background: #0b0f19; color: #f8fafc; min-height: 100%; padding-bottom: 60px;">
    <!-- Orchestrator Header -->
    <header style="background: #111827; border-bottom: 1px solid #1f2937; padding: 16px 0;">
      <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: #fff;">H</div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #f8fafc;">HyperApp Cloud Orchestrator</div>
            <div style="font-size: 11px; color: #94a3b8;">Kubernetes Node Clusters & State Engine</div>
          </div>
        </div>
        <span style="font-size: 12px; background: #064e3b; color: #34d399; font-weight: 600; padding: 4px 12px; border-radius: 999px;">Cluster: Healthy (64 Pods)</span>
      </div>
    </header>

    <div class="container" style="padding-top: 32px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Active Ingress Nodes</div>
          <div style="font-size: 24px; font-weight: 800; color: #38bdf8; margin-top: 6px;">12 / 12 Online</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Reactive Store State</div>
          <div id="store-status" style="font-size: 15px; font-weight: 700; color: #f8fafc; margin-top: 10px;">Synchronized</div>
        </div>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 22px;">
          <div style="font-size: 12px; color: #94a3b8;">Loaded Plugin Extension</div>
          <div id="plugin-status" style="font-size: 15px; font-weight: 700; color: #a78bfa; margin-top: 10px;">Standard Ingress</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- Focus: That's current lab code                                            -->
  <!-- ========================================================================= -->
  <script id="target-application-script">
    (function() {
      var HyperStore = {
        state: {
          clusterId: "prod-us-east-1",
          activePlugins: []
        },
        dispatch: function(action, payload) {
          if (action === "REGISTER_PLUGIN") {
            this.state.activePlugins.push(payload);
            this.executePluginLifecycle(payload);
          }
        },
        executePluginLifecycle: function(plugin) {
          var pluginStatusEl = document.getElementById('plugin-status');
          if (pluginStatusEl) pluginStatusEl.textContent = plugin.name || "Custom Extension";

          if (plugin && plugin.hook) {
            try {
              var hookFn = new Function('ctx', plugin.hook);
              hookFn(this.state);
            } catch (err) {
              console.error("[HyperStore] Plugin hook error:", err);
            }
          }
        }
      };

      document.addEventListener("DOMContentLoaded", function() {
        var params = new URLSearchParams(window.location.search);
        var configParam = params.get('plugin_config');
        if (configParam) {
          try {
            var parsedPlugin = JSON.parse(decodeURIComponent(configParam));
            HyperStore.dispatch("REGISTER_PLUGIN", parsedPlugin);
          } catch (e) {
            console.error("Malformed plugin configuration:", e);
          }
        }
      });
    })();
  </script>
  <!-- ========================================================================= -->
  <!-- Current lab code is End Here                                              -->
  <!-- ========================================================================= -->`;

  res.send(renderLabShell(lab, appHtml, { nextLabUrl: '/' }));
});

module.exports = router;
