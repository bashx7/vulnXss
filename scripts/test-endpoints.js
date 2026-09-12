// scripts/test-endpoints.js - Automated Verification of all VulnXSS Endpoints & Filtering

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const TEST_PORT = 3099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function makeRequest(reqPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${reqPath}`;
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log("====================================================");
  console.log(" Starting VulnXSS Automated Verification Suite...");
  console.log("====================================================");

  // Spawn test server on isolated port 3099
  const serverProcess = spawn('node', [path.join(__dirname, '../server.js')], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: 'pipe'
  });

  let serverReady = false;
  serverProcess.stdout.on('data', (d) => {
    if (d.toString().includes('VulnXSS Training Laboratory')) {
      serverReady = true;
    }
  });

  // Wait for server to bind
  for (let i = 0; i < 20; i++) {
    if (serverReady) break;
    await delay(150);
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Home Page
    const homeRes = await makeRequest('/');
    assert(homeRes.status === 200, "Home page returns HTTP 200");
    assert(homeRes.body.includes("XSS Training Lab"), "Home page contains title");
    assert(homeRes.body.includes("/RXSS") && homeRes.body.includes("/SXSS") && homeRes.body.includes("/DOMXSS"), "Home page links to all 3 categories");

    // 2. Category Pages
    const rxssCat = await makeRequest('/RXSS');
    assert(rxssCat.status === 200 && rxssCat.body.includes("Reflected XSS"), "Category /RXSS returns HTTP 200");
    assert(rxssCat.body.includes("RXSS-11"), "Category /RXSS contains 11 challenges");

    const sxssCat = await makeRequest('/SXSS');
    assert(sxssCat.status === 200 && sxssCat.body.includes("Stored / Persistent XSS"), "Category /SXSS returns HTTP 200");
    assert(sxssCat.body.includes("SXSS-06"), "Category /SXSS contains 6 challenges");

    const domCat = await makeRequest('/DOMXSS');
    assert(domCat.status === 200 && domCat.body.includes("DOM-Based XSS"), "Category /DOMXSS returns HTTP 200");
    assert(domCat.body.includes("DOMXSS-07"), "Category /DOMXSS contains 7 challenges");

    // 3. Test Reflected Labs (1 to 11)
    console.log("\nTesting Reflected XSS Labs (RXSS 01-11)...");
    for (let i = 1; i <= 11; i++) {
      const res = await makeRequest(`/RXSS/lab${i}`);
      assert(res.status === 200, `/RXSS/lab${i} responds with HTTP 200`);
    }

    // Specific Reflected behavior tests
    const rxss1 = await makeRequest('/RXSS/lab1?query=VulnCheckCanary123');
    assert(rxss1.body.includes('<b>VulnCheckCanary123</b>'), "RXSS-01 reflects query inside <b>");

    const rxss2Block = await makeRequest('/RXSS/lab2?search=<script>alert(1)</script>');
    assert(rxss2Block.status === 403, "RXSS-02 returns 403 Forbidden for <script>");

    const rxss2Allow = await makeRequest('/RXSS/lab2?search=<svg onload=alert(1)>');
    assert(rxss2Allow.status === 200 && rxss2Allow.body.includes('<svg onload=alert(1)>'), "RXSS-02 allows <svg> with HTTP 200");

    const rxss5 = await makeRequest('/RXSS/lab5?tracking_id="onfocus="alert(1)<>');
    assert(!rxss5.body.includes('<>') && rxss5.body.includes('value=""onfocus="alert(1)"'), "RXSS-05 strips angle brackets but retains attribute");

    const rxss6Alert = await makeRequest('/RXSS/lab6?feedback_ref=<script>alert(1)</script>');
    assert(rxss6Alert.body.includes("prohibited expression"), "RXSS-06 blocks alert()");

    const rxss6Confirm = await makeRequest('/RXSS/lab6?feedback_ref=<script>confirm(1)</script>');
    assert(rxss6Confirm.body.includes("<script>confirm(1)</script>"), "RXSS-06 permits confirm()");

    const rxss8 = await makeRequest('/RXSS/lab8?coupon=SAVE(10)');
    assert(rxss8.body.includes("Invalid voucher format"), "RXSS-08 blocks parentheses");

    // RXSS-10 reconnaissance assets & multi-endpoint API
    const rxss10Js = await makeRequest('/RXSS/lab10/static/telemetry-monitor.js');
    assert(rxss10Js.body.includes("/RXSS/lab10/diagnostic?debug_trace="), "RXSS-10 monitor.js reveals diagnostic endpoint");

    const rxss10Diag = await makeRequest('/RXSS/lab10/diagnostic?debug_trace=<script>alert(1)</script>');
    assert(rxss10Diag.body.includes('<script>alert(1)</script>'), "RXSS-10 diagnostic reflects debug_trace");

    // RXSS-11 multi-step fuzzing tree
    const rxss11Robots = await makeRequest('/RXSS/lab11/robots.txt');
    assert(rxss11Robots.body.includes('/RXSS/lab11/dev/'), "RXSS-11 robots.txt points to /dev/");

    const rxss11Active = await makeRequest('/RXSS/lab11/dev/active');
    assert(rxss11Active.body.includes('review.html'), "RXSS-11 /dev/active reveals review.html");

    const rxss11Review = await makeRequest('/RXSS/lab11/dev/active/review.html?id=<script>alert(1)</script>');
    assert(rxss11Review.body.includes('Reviewing Target: <script>alert(1)</script>'), "RXSS-11 review.html reflects ?id=");

    // 4. Test Stored Labs (1 to 6)
    console.log("\nTesting Stored XSS Labs (SXSS 01-06)...");
    for (let i = 1; i <= 6; i++) {
      const res = await makeRequest(`/SXSS/lab${i}`);
      assert(res.status === 200, `/SXSS/lab${i} responds with HTTP 200`);
    }

    // Test SXSS-01 post persistence
    const commentBody = "author=HackerBob&content=<script>alert(1)</script>";
    await makeRequest('/SXSS/lab1/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(commentBody) },
      body: commentBody
    });
    const sxss1Check = await makeRequest('/SXSS/lab1');
    assert(sxss1Check.body.includes('<script>alert(1)</script>') && sxss1Check.body.includes('HackerBob'), "SXSS-01 stores and reflects raw comment");

    // Test SXSS-05 audit log tab
    const sxss5Audit = await makeRequest('/SXSS/lab5?tab=audit');
    assert(sxss5Audit.body.includes("Internal Compliance Audit Trail"), "SXSS-05 renders audit trail tab");

    // 5. Test DOM Labs (1 to 7)
    console.log("\nTesting DOM XSS Labs (DOMXSS 01-07)...");
    for (let i = 1; i <= 7; i++) {
      const res = await makeRequest(`/DOMXSS/lab${i}`);
      assert(res.status === 200, `/DOMXSS/lab${i} responds with HTTP 200`);
    }

    // 6. Test On-Demand Hints & Solution API (Zero page source spoilers)
    console.log("\nTesting On-Demand Hints & Solution Protection...");
    const hintsRes = await makeRequest('/api/lab-data/RXSS-01/hints');
    assert(hintsRes.status === 200 && hintsRes.body.includes("hints"), "API /api/lab-data/RXSS-01/hints returns HTTP 200");

    const solRes = await makeRequest('/api/lab-data/RXSS-01/solution');
    assert(solRes.status === 200 && solRes.body.includes("solution"), "API /api/lab-data/RXSS-01/solution returns HTTP 200");

    // Ensure raw initial lab HTML does NOT leak the solution payload
    const rawLabHtml = await makeRequest('/RXSS/lab1');
    assert(!rawLabHtml.body.includes("Vulnerability Location") && !rawLabHtml.body.includes("Secure Code Example"), "Raw lab HTML source does not spoil solution text");

    assert(rxss1.body.includes("xss-detector.js"), "Individual labs load reliable xss-detector.js");

    console.log("====================================================");
    console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("====================================================");

    serverProcess.kill('SIGTERM');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test execution failed:", err);
    serverProcess.kill('SIGTERM');
    process.exit(1);
  }
}

runTests();
