// data/labs.js - Complete metadata, stories, hints, solutions and defenses for all 24 labs

const labsData = {
  // ==========================================
  // REFLECTED XSS (11 LABS)
  // ==========================================
  RXSS: [
    {
      id: "RXSS-01",
      number: 1,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Basic Reflection",
      appName: "PulsePost Blog",
      appTagline: "Modern Engineering & Tech Publication",
      difficulty: "Beginner",
      technique: "Raw HTML Reflection",
      description: "User search query is reflected directly into the HTML response without sanitization.",
      story: "You are conducting an authorized assessment of PulsePost, a technology publication platform. Visitors can search through recent technical articles using the top search bar. Your objective is to determine whether user-supplied search queries are handled safely when presented back on the results page.",
      objective: "Identify the reflection point on the search page and execute arbitrary JavaScript (such as alert(1)).",
      hints: [
        "Perform a simple search on the blog and observe where your search term appears in the rendered page.",
        "Inspect the HTML source code surrounding your reflected query.",
        "Notice that the query is placed directly between HTML tags (e.g., <b>...</b>) without any character filtering or encoding.",
        "Submit standard HTML script tags or an HTML image tag with an onerror event handler."
      ],
      solution: {
        location: "Article search query parameter `query` on the search results view.",
        context: "HTML Context (`<b>USER_INPUT</b>`) within the main results container.",
        whyVulnerable: "The server directly interpolates the raw `query` request parameter into the HTML output without converting dangerous characters like `<`, `>`, and `\"` into HTML entities.",
        filterAnalysis: "No filtering or sanitization is applied to the input.",
        examplePayload: "<script>alert(1)</script>",
        alternativePayload: "<img src=x onerror=alert(1)>",
        steps: [
          "Navigate to the search bar and submit a benign canary value such as `test1234`.",
          "Right-click and inspect the element to find `<b>test1234</b>` in the DOM.",
          "Submit `<script>alert(1)</script>` into the search field and submit the form.",
          "The browser parses the `<script>` tag and executes the JavaScript payload immediately."
        ],
        defense: "Context-aware HTML entity encoding must be applied to all dynamic data before rendering it in an HTML body context. In Node.js / Express, utilize a template engine that auto-escapes output (e.g., EJS `<%= %>`) or an encoding library such as `he` or `validator.escape()`.",
        secureCodeSnippet: "// Secure Implementation\nconst escapeHtml = require('escape-html');\nconst safeQuery = escapeHtml(req.query.query || '');\nres.send(`Search results for: <b>${safeQuery}</b>`);"
      }
    },
    {
      id: "RXSS-02",
      number: 2,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "HTML Tag Filtering",
      appName: "FreshBlend Juice Co.",
      appTagline: "Artisanal Cold-Pressed Juices & Smoothies",
      difficulty: "Beginner",
      technique: "Tag Blacklist Bypass",
      description: "The application enforces a blacklist blocking specific HTML tags with a 403 Forbidden response, but permits alternative execution tags.",
      story: "FreshBlend operates an online juice catalogue. The application developer attempted to stop cross-site scripting by implementing a web application firewall rule that blocks the most common HTML tags. Determine whether this tag blacklist is sufficient to protect the application.",
      objective: "Analyze the tag filtering behavior, identify an allowed HTML tag that supports execution handlers, and trigger XSS.",
      hints: [
        "Test various standard tags such as <script>, <img>, and <a> in the product search box and note the HTTP response code.",
        "Notice that when blocked tags are detected, the server returns an explicit 403 Forbidden page.",
        "Explore modern HTML5 vector tags that do not use the blocked words (e.g., <svg>, <body>, <details>, <video>).",
        "Try an <svg> tag with an onload handler or an <audio>/<video> tag with an onerror event."
      ],
      solution: {
        location: "Product catalog search parameter `search`.",
        context: "HTML Context (`<div class=\"results-notice\">...</div>`).",
        whyVulnerable: "The developer implemented a flawed blacklist that explicitly blocks `<script>`, `<img>`, and `<a>`. Blacklists are notoriously incomplete because HTML5 defines dozens of elements that support automated lifecycle events (e.g. `onload`, `onerror`, `ontoggle`).",
        filterAnalysis: "Regular expression `/<(script|img|a)\\b/i` triggers an HTTP 403 response. Elements like `<svg>`, `<body>`, and `<details>` pass through cleanly.",
        examplePayload: "<svg onload=alert(1)>",
        alternativePayload: "<details open ontoggle=alert(1)>",
        steps: [
          "Enter `<script>alert(1)</script>` into the search field and submit. Observe the HTTP 403 'Security Alert: Disallowed tag detected'.",
          "Test `<img src=x onerror=alert(1)>` and note that it is also blocked with 403.",
          "Test `<svg onload=alert(1)>`. The server allows the request and reflects the SVG element.",
          "The browser renders the SVG and executes the `onload` handler."
        ],
        defense: "Never rely on tag blacklists to prevent XSS. Always use contextual output encoding or a verified HTML sanitization library (such as DOMPurify or sanitize-html) configured with an allowlist.",
        secureCodeSnippet: "// Secure Implementation with DOMPurify / sanitize-html\nconst sanitizeHtml = require('sanitize-html');\nconst cleanHtml = sanitizeHtml(req.query.search, {\n  allowedTags: [], // Strip all HTML or encode\n  allowedAttributes: {}\n});"
      }
    },
    {
      id: "RXSS-03",
      number: 3,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "JavaScript URL",
      appName: "Apex Support Portal",
      appTagline: "Enterprise Client Helpdesk & Ticketing",
      difficulty: "Easy",
      technique: "JavaScript Pseudo-Protocol (URL Context)",
      description: "A dynamic navigation link reflects user input into an href attribute without protocol validation.",
      story: "You are testing the customer helpdesk portal for Apex Technologies. When customers browse support articles, a dynamic 'Return to Previous Page' link is rendered based on a URL parameter. Your goal is to determine whether this navigation mechanism can be abused to execute client-side code.",
      objective: "Locate the navigation parameter and execute JavaScript when the user interacts with or navigates the link.",
      hints: [
        "Look at the 'Back to Tickets' or 'Return to Portal' link at the top of the ticket view.",
        "Inspect the href attribute of the return link in Developer Tools.",
        "Notice which query parameter controls the URL destination in the href attribute.",
        "In modern browsers, what happens when a hyperlink href starts with the `javascript:` pseudo-protocol?"
      ],
      solution: {
        location: "URL parameter `returnUrl` reflected into `<a href=\"...\">`.",
        context: "URL / Attribute Context (`href` attribute of an anchor tag).",
        whyVulnerable: "While HTML entity encoding prevents breakout from the attribute quotes, the browser interprets `javascript:` URLs as executable script when clicked or navigated.",
        filterAnalysis: "No scheme validation is performed on the URL. Absolute or relative HTTP links are accepted, but `javascript:` is not blocked.",
        examplePayload: "javascript:alert(1)",
        alternativePayload: "javascript:confirm(document.domain)",
        steps: [
          "Observe the URL on the article page: `/RXSS/lab3?returnUrl=/RXSS/lab3/portal`.",
          "Inspect the 'Return to Portal' link and verify its `href` contains the parameter value.",
          "Modify the query parameter to `?returnUrl=javascript:alert(1)` and reload.",
          "Click the 'Return to Portal' link to execute the JavaScript."
        ],
        defense: "Validate destination URLs against a strict allowlist or verify that the URL begins with `https://`, `http://`, or a safe relative path (`/`). Reject any URI scheme starting with `javascript:`, `data:`, or `vbscript:`.",
        secureCodeSnippet: "// Secure Implementation\nfunction isValidReturnUrl(url) {\n  return url && (url.startsWith('/') && !url.startsWith('//'));\n}\nconst safeUrl = isValidReturnUrl(req.query.returnUrl) ? req.query.returnUrl : '/RXSS/lab3';"
      }
    },
    {
      id: "RXSS-04",
      number: 4,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Attribute Context",
      appName: "NovaHR Directory",
      appTagline: "Internal Corporate Employee Directory",
      difficulty: "Easy",
      technique: "HTML Attribute Breakout",
      description: "User input is reflected inside an input value attribute without quote escaping.",
      story: "NovaHR provides an internal employee directory where staff members can search for colleagues by name or department. The search input box retains the previously searched string in its `value` attribute so users don't have to retype it. Determine if an attacker can break out of the attribute boundary.",
      objective: "Break out of the `<input value=\"...\">` attribute context and execute arbitrary JavaScript.",
      hints: [
        "Search for a name and inspect the search <input> element in Developer Tools.",
        "Look at how your input is enclosed: `value=\"YOUR_INPUT\"`.",
        "What character is used to delimit the value attribute?",
        "Try closing the quote with `\"` and injecting either a new attribute (like an event handler) or closing the tag with `>`."
      ],
      solution: {
        location: "Query parameter `name` reflected inside `<input type=\"text\" name=\"name\" value=\"...\">`.",
        context: "Attribute context inside double quotes.",
        whyVulnerable: "The application renders the user query inside the `value` attribute without escaping double quote characters (`\"`).",
        filterAnalysis: "No character filtering is present.",
        examplePayload: "\" onfocus=\"alert(1)\" autofocus=\"",
        alternativePayload: "\"><script>alert(1)</script>",
        steps: [
          "Search for `Jane` and inspect the DOM: `<input name=\"name\" value=\"Jane\">`.",
          "Enter `Jane\" onfocus=\"alert(1)\" autofocus=\"` into the search box.",
          "Inspect the resulting DOM: `<input name=\"name\" value=\"Jane\" onfocus=\"alert(1)\" autofocus=\"\">`.",
          "Because `autofocus` automatically focuses the input upon page render, the `onfocus` handler executes immediately."
        ],
        defense: "Ensure all attribute values are enclosed in quotes and encode HTML special characters, especially `\"` (`&quot;`), `'` (`&#39;`), `&` (`&amp;`), `<`, and `>`.",
        secureCodeSnippet: "// Secure Implementation\nconst escapeHtml = require('escape-html');\nconst safeValue = escapeHtml(req.query.name || '');\nres.send(`<input type=\"text\" name=\"name\" value=\"${safeValue}\">`);"
      }
    },
    {
      id: "RXSS-05",
      number: 5,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Attribute Injection Without < and >",
      appName: "SwiftTrack Logistics",
      appTagline: "Global Parcel Delivery & Freight Tracking",
      difficulty: "Easy",
      technique: "Attribute Breakout Without Tag Delimiters",
      description: "Angle brackets are completely stripped by the server, but the input attribute remains exploitable.",
      story: "SwiftTrack is a parcel tracking platform. To prevent cross-site scripting, the development team introduced a sanitization filter that strips all `<` and `>` characters from user input before reflecting it into the tracking query input box. Test whether stripping angle brackets alone is sufficient.",
      objective: "Demonstrate JavaScript execution within the input attribute without using `<` or `>`.",
      hints: [
        "Try submitting `<script>alert(1)</script>` and inspect the rendered input field. Notice what happened to the angle brackets.",
        "Can you still break out of the `value=\"...\"` attribute without opening a new HTML tag?",
        "HTML attributes support event handlers like `onfocus`, `onmouseover`, `onclick`, and `oninput`.",
        "Pair an event handler with an attribute that triggers automatically, such as `autofocus`."
      ],
      solution: {
        location: "Tracking code parameter `tracking_id` reflected into `<input name=\"tracking_id\" value=\"...\">`.",
        context: "Attribute context with `<` and `>` stripped.",
        whyVulnerable: "Many developers believe that blocking angle brackets completely eliminates XSS. However, when reflection occurs within an attribute, an attacker can remain inside the element by injecting new attributes and event handlers.",
        filterAnalysis: "Input passes through `input.replace(/[<>]/g, '')`. Double quotes (`\"`), spaces, and equals signs are untouched.",
        examplePayload: "\" onfocus=\"alert(1)\" autofocus=\"",
        alternativePayload: "\" onmouseover=\"alert(1)\" style=\"width:100%;height:100px;display:block;\"",
        steps: [
          "Submit `123<test>` and verify the DOM shows `value=\"123test\"`.",
          "Submit `\" onfocus=\"alert(1)\" autofocus=\"`.",
          "The rendered HTML becomes `<input name=\"tracking_id\" value=\"\" onfocus=\"alert(1)\" autofocus=\"\">`.",
          "The input gains focus on page load, executing `alert(1)` without any angle brackets."
        ],
        defense: "Attribute values must be escaped with full HTML attribute encoding, which replaces `\"` with `&quot;` and `'` with `&#x27;`. Never assume stripping angle brackets protects attribute contexts.",
        secureCodeSnippet: "// Secure Implementation\nconst escapeAttr = (str) => str.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');"
      }
    },
    {
      id: "RXSS-06",
      number: 6,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Function Filtering",
      appName: "EchoFeedback Portal",
      appTagline: "Customer Satisfaction & Experience Analytics",
      difficulty: "Intermediate",
      technique: "JavaScript Function Blacklist Bypass",
      description: "The application reflects input but blocks common JavaScript functions like alert and prompt.",
      story: "You are assessing EchoFeedback, a customer experience survey platform. Users can review their feedback confirmation before submitting. The developer filters out the functions `alert` and `prompt` to block proof-of-concept scripts. Find an alternative execution vector that bypasses this filter.",
      objective: "Identify the filtered function names and trigger JavaScript execution using an unblocked method.",
      hints: [
        "Test submitting `<script>alert(1)</script>` and inspect the response or error message.",
        "Test submitting `<script>prompt(1)</script>` as well.",
        "What other dialog function exists in the standard browser Window interface alongside alert and prompt?",
        "Try using `confirm(1)` or custom execution sinks."
      ],
      solution: {
        location: "Parameter `feedback_ref` reflected into the feedback preview container.",
        context: "HTML Context (`<div class=\"preview-text\">...</div>`).",
        whyVulnerable: "The developer used a naive keyword filter that looks for specific function names (`alert`, `prompt`), forgetting that JavaScript provides multiple dialog methods and infinite ways to invoke code.",
        filterAnalysis: "Server checks for `/(alert|prompt)/i` and rejects the payload if found. `confirm` is completely unblocked.",
        examplePayload: "<script>confirm(1)</script>",
        alternativePayload: "<img src=x onerror=confirm(1)>",
        steps: [
          "Enter `<script>alert(1)</script>` and submit. The server responds with 'Disallowed keyword: alert'.",
          "Enter `<script>confirm(1)</script>` and submit.",
          "The server allows the payload because `confirm` is not on the blacklist.",
          "The browser renders the script and displays the confirmation dialog."
        ],
        defense: "Do not attempt to blacklist JavaScript function names. Prevent user input from being interpreted as code altogether using proper context encoding.",
        secureCodeSnippet: "// Secure Implementation\nconst safeText = escapeHtml(req.query.feedback_ref || '');"
      }
    },
    {
      id: "RXSS-07",
      number: 7,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Keyword Sanitization",
      appName: "OmniMetrics Analytics",
      appTagline: "Real-Time Cloud Performance & Telemetry",
      difficulty: "Intermediate",
      technique: "Dynamic Function Resolution",
      description: "The application strips or blocks the keywords alert, prompt, and confirm from reflected input.",
      story: "OmniMetrics offers a cloud metrics dashboard where engineers can filter live telemetry streams. The security team implemented a filter that searches for and blocks `alert`, `prompt`, and `confirm`. Your mission is to construct a payload that invokes one of these functions dynamically without writing the forbidden keywords directly.",
      objective: "Execute JavaScript by dynamically resolving or constructing the function name at runtime.",
      hints: [
        "Try submitting alert, prompt, and confirm and notice that all three are blocked by the filter.",
        "In JavaScript, all global functions are properties of the global object `window` or `self` (e.g., `window['alert']`).",
        "Can you construct the property name string using concatenation or encoding?",
        "Consider `self['al' + 'ert'](1)` or `window[atob('YWxlcnQ=')](1)`."
      ],
      solution: {
        location: "Query parameter `metric_filter` on the dashboard view.",
        context: "HTML Context.",
        whyVulnerable: "Keyword blacklists can always be bypassed in dynamic languages like JavaScript because object properties can be accessed via bracket notation with concatenated or decoded strings.",
        filterAnalysis: "Regex `/(alert|prompt|confirm)/i` blocks any input containing those words as contiguous strings.",
        examplePayload: "<script>self['al'+'ert'](1)</script>",
        alternativePayload: "<script>window[String.fromCharCode(97,108,101,114,116)](1)</script>",
        steps: [
          "Verify that `<script>alert(1)</script>` is blocked.",
          "Notice that `self` and `window` are permitted.",
          "Construct the function name using string concatenation: `'al' + 'ert'`.",
          "Submit `<script>self['al'+'ert'](1)</script>` to successfully trigger the alert."
        ],
        defense: "Do not rely on keyword matching. Use contextual HTML output escaping so that `<script>` and event handlers cannot be introduced.",
        secureCodeSnippet: "// Secure Implementation\nconst safeFilter = escapeHtml(req.query.metric_filter || '');"
      }
    },
    {
      id: "RXSS-08",
      number: 8,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Parentheses Restriction",
      appName: "CryptoCalc Discounts",
      appTagline: "Decentralized Financial Calculators & Coupons",
      difficulty: "Intermediate",
      technique: "Parenthesis-Free JavaScript Invocation",
      description: "Parentheses () are strictly forbidden by the input filter, requiring alternative JS execution syntax.",
      story: "CryptoCalc allows customers to validate discount coupons. The server filters out parentheses `(` and `)` because the developers believed that without parentheses, a function cannot be invoked in JavaScript. Demonstrate that JavaScript offers syntax capable of executing functions without parentheses.",
      objective: "Achieve JavaScript execution using an alternative invocation syntax that does not contain parentheses.",
      hints: [
        "Try entering `<script>alert(1)</script>` and notice the error indicating parentheses are forbidden.",
        "How do ES6 template literals interact with functions (Tagged Template Literals)?",
        "Consider what happens when you write `alert\`1\`` in the browser console.",
        "Another option is error handling with `onerror=alert; throw 1`."
      ],
      solution: {
        location: "Coupon parameter `coupon` reflected in the promotional banner.",
        context: "HTML Context.",
        whyVulnerable: "Modern JavaScript (ECMAScript 6+) introduced tagged template literals (`func\`args\``), which pass string arrays to functions without traditional parentheses.",
        filterAnalysis: "Character filter `/[()]/` triggers a validation error if parentheses are present.",
        examplePayload: "<script>alert`1`</script>",
        alternativePayload: "<svg onload=\"throw onerror=alert,1\">",
        steps: [
          "Submit coupon `SAVE(20)` and observe the filter rejection: 'Parentheses not allowed'.",
          "Test in your browser console: `alert\`1\``. Notice that the alert dialog displays `1`.",
          "Submit `<script>alert\`1\`</script>` as the coupon parameter.",
          "The server accepts the payload and the browser executes `alert` via the tagged template literal."
        ],
        defense: "Never rely on syntax character blacklists. Encode all dynamic input using HTML entity escaping before rendering in the document body.",
        secureCodeSnippet: "// Secure Implementation\nconst safeCoupon = escapeHtml(req.query.coupon || '');"
      }
    },
    {
      id: "RXSS-09",
      number: 9,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "JavaScript Context",
      appName: "VibeStream Theme Studio",
      appTagline: "Creator Stream Overlays & Customization",
      difficulty: "Intermediate",
      technique: "Script Block Variable Breakout",
      description: "User input is placed directly inside an inline JavaScript script block.",
      story: "VibeStream lets streamers customize their broadcast theme colors through URL query parameters. The accent color parameter is written directly into an inline JavaScript configuration block on the page. Inspect the page source to analyze how the variable is initialized and break out of the script context.",
      objective: "Analyze the inline JavaScript code, escape the string literal, and execute your own code.",
      hints: [
        "Change the theme color and inspect the page source using Ctrl+U / Cmd+Option+U.",
        "Look for `<script>` tags containing your parameter value.",
        "Notice how the variable is declared: `var themeAccent = \"YOUR_INPUT\";`.",
        "Try closing the string literal with `\";` followed by your JavaScript code and commenting out the rest with `//`."
      ],
      solution: {
        location: "Parameter `accent` reflected inside an inline `<script>` tag.",
        context: "JavaScript String Literal Context (`var themeAccent = \"USER_INPUT\";`).",
        whyVulnerable: "Standard HTML entity encoding does not protect against XSS inside `<script>` blocks, because HTML entities are not automatically decoded by the JavaScript parser, and quotes allow breakout of the JS string literal.",
        filterAnalysis: "No sanitization is applied to the `accent` parameter.",
        examplePayload: "blue\"; alert(1); //",
        alternativePayload: "</script><script>alert(1)</script>",
        steps: [
          "Submit `?accent=cyan` and view the page source.",
          "Locate: `var themeAccent = \"cyan\";`.",
          "Submit `?accent=cyan\";alert(1);//`.",
          "The source becomes: `var themeAccent = \"cyan\";alert(1);//\";`.",
          "The browser evaluates the variable assignment, executes `alert(1)`, and ignores the trailing quote via the comment."
        ],
        defense: "Never concatenate untrusted input directly into JavaScript code blocks. Pass data to the client using a safe `data-*` HTML attribute (properly HTML-encoded) or serialize with a safe JSON serializer that escapes characters like `<`, `>`, `\"`, `'`, and `\\`.",
        secureCodeSnippet: "// Secure Implementation\nconst safeConfig = JSON.stringify({ accent: req.query.accent || 'default' }).replace(/</g, '\\\\u003c');"
      }
    },
    {
      id: "RXSS-10",
      number: 10,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Hidden Parameter Through JavaScript Analysis",
      appName: "CloudPeak Telemetry",
      appTagline: "Multi-Cloud Node Monitoring & Uptime",
      difficulty: "Advanced",
      technique: "Client Reconnaissance & Hidden Parameter Discovery",
      description: "The vulnerable endpoint and query parameter are not shown in the UI but referenced inside client-side JS.",
      story: "You are testing CloudPeak Telemetry, an infrastructure monitoring dashboard. The primary user interface contains no visible search or input fields. However, real-world penetration testers frequently uncover undocumented debug and diagnostic parameters by auditing client-side JavaScript assets. Discover the hidden endpoint and parameter.",
      objective: "Inspect the application's loaded JavaScript assets, locate the hidden diagnostic endpoint/parameter, and achieve XSS.",
      hints: [
        "Open Developer Tools (F12) and inspect the Network or Sources tab.",
        "Look for external script files loaded by the page, such as `/RXSS/lab10/static/telemetry-monitor.js`.",
        "Read the comments and API configuration objects inside the JavaScript file.",
        "Find the debug diagnostic endpoint and the parameter it expects."
      ],
      solution: {
        location: "Hidden diagnostic endpoint `/RXSS/lab10/diagnostic` and parameter `debug_trace`.",
        context: "HTML Reflection inside the system diagnostic terminal view.",
        whyVulnerable: "The developer left a development/staging telemetry endpoint active in production, documented only in a client-side JavaScript file. The endpoint reflects `debug_trace` into the diagnostic response without encoding.",
        filterAnalysis: "No filtering is performed on `debug_trace`.",
        examplePayload: "<script>alert(1)</script>",
        alternativePayload: "<img src=x onerror=alert(1)>",
        steps: [
          "Open Developer Tools and inspect the page source: find `<script src=\"/RXSS/lab10/static/telemetry-monitor.js\"></script>`.",
          "Open `telemetry-monitor.js` and read the code: discover `// Internal Diagnostic API: /RXSS/lab10/diagnostic?debug_trace=`.",
          "Navigate to `/RXSS/lab10/diagnostic?debug_trace=<script>alert(1)</script>` in the browser.",
          "The diagnostic view reflects the trace log directly into the page, executing the payload."
        ],
        defense: "Remove all diagnostic/debug endpoints from production builds. Ensure any diagnostic logging views strictly encode all log outputs before displaying them in web interfaces.",
        secureCodeSnippet: "// Secure Implementation\napp.get('/RXSS/lab10/diagnostic', (req, res) => {\n  const trace = escapeHtml(req.query.debug_trace || 'No trace specified');\n  res.send(`<pre>${trace}</pre>`);\n});"
      }
    },
    {
      id: "RXSS-11",
      number: 11,
      category: "RXSS",
      categoryName: "Reflected XSS",
      title: "Multi-Step Fuzzing & Parameter Discovery",
      appName: "NextGen Enterprise Staging",
      appTagline: "Continuous Integration & Staging Gateway",
      difficulty: "Advanced",
      technique: "Multi-Stage Content & Parameter Discovery",
      description: "The vulnerable component must be uncovered through directory discovery, file fuzzing, and parameter analysis.",
      story: "NextGen Enterprise has deployed an internal staging environment. The public landing page is a standard placeholder. As an authorized penetration tester, you must follow a methodical reconnaissance workflow: discover hidden directories, enumerate active files, identify unlinked parameters, and test for reflection.",
      objective: "Follow the discovery chain: /dev → /active → review.html → discover parameter id → execute XSS.",
      hints: [
        "Check robots.txt or perform common directory enumeration on the lab root.",
        "Explore `/RXSS/lab11/dev`. What directories or status codes exist there?",
        "Enumerate subdirectories under `/RXSS/lab11/dev/` to discover `/active`.",
        "Under `/RXSS/lab11/dev/active/`, discover the file `review.html` and fuzz for hidden parameters like `id`, `ref`, or `view`."
      ],
      solution: {
        location: "Multi-step path: `/RXSS/lab11/dev/active/review.html?id=`.",
        context: "HTML Reflection in the stage review banner.",
        whyVulnerable: "Unprotected staging files were left accessible without access control or directory listing protection, and `review.html` reflects the `id` parameter directly into `<h2>Reviewing Target: USER_INPUT</h2>`.",
        filterAnalysis: "No filtering applied on the staging parameter.",
        examplePayload: "<script>alert(1)</script>",
        alternativePayload: "<svg onload=alert(1)>",
        steps: [
          "Access `/RXSS/lab11/robots.txt` or fuzz common paths to discover `/RXSS/lab11/dev`.",
          "Access `/RXSS/lab11/dev` which indicates staging assets reside in `/active`.",
          "Navigate to `/RXSS/lab11/dev/active` and discover `review.html`.",
          "Test parameters using fuzzing or inspection: `?id=<script>alert(1)</script>`.",
          "The page reflects the payload directly, achieving execution."
        ],
        defense: "Disable public access to staging/dev paths with strict IP restrictions or authentication. Always encode query parameters before rendering them in HTML.",
        secureCodeSnippet: "// Secure Implementation\nconst safeId = escapeHtml(req.query.id || 'None');\nres.send(`<h2>Reviewing Target: ${safeId}</h2>`);"
      }
    }
  ],

  // ==========================================
  // STORED XSS (6 LABS)
  // ==========================================
  SXSS: [
    {
      id: "SXSS-01",
      number: 1,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Basic Stored XSS",
      appName: "DevForum Community",
      appTagline: "Open Developer Discussions & Knowledge Base",
      difficulty: "Beginner",
      technique: "Persistent HTML Injection",
      description: "User submitted thread comments are stored persistently in the database and rendered raw to all readers.",
      story: "DevForum is a developer discussion platform where programmers discuss frameworks and troubleshooting. Users can reply to active threads. Determine if submitted comments are sanitized before being stored and served to subsequent visitors.",
      objective: "Post a comment containing a JavaScript payload that executes whenever the thread is viewed.",
      hints: [
        "Post a normal comment on the active thread to observe how comments are rendered.",
        "Inspect the HTML structure of the comments list in your browser.",
        "Submit a comment with HTML tags such as <b> or <i> to check if formatting tags are permitted.",
        "Submit a standard <script> or <img> tag payload and see if it persists after refreshing the page."
      ],
      solution: {
        location: "Thread comment submission form (`content` field) on `/SXSS/lab1`.",
        context: "HTML Context in the comments feed.",
        whyVulnerable: "The server stores the comment string directly into persistent storage without validation, and renders it directly into the HTML response when any user loads the page.",
        filterAnalysis: "Zero server-side sanitization or encoding.",
        examplePayload: "<script>alert(1)</script>",
        alternativePayload: "<img src=x onerror=alert(1)>",
        steps: [
          "Enter your name and payload `<script>alert(1)</script>` into the comment box.",
          "Click 'Post Comment'.",
          "The comment is saved. The page reloads, renders the stored comment, and executes `alert(1)`.",
          "Open the page in another tab or refresh to confirm the payload is persistently stored."
        ],
        defense: "Always encode dynamic data upon output, and validate/sanitize input using DOMPurify or sanitize-html if rich text formatting is required.",
        secureCodeSnippet: "// Secure Implementation\nconst cleanComment = sanitizeHtml(req.body.content, {\n  allowedTags: ['b', 'i', 'em', 'strong', 'p'],\n  allowedAttributes: {}\n});"
      }
    },
    {
      id: "SXSS-02",
      number: 2,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Stored HTML Context",
      appName: "RecipeShare Culinary",
      appTagline: "Community Recipe Notes & Kitchen Secrets",
      difficulty: "Beginner",
      technique: "Naive Tag Strip Bypass (Nested Tags)",
      description: "The application uses a naive regex to strip script tags once, which can be bypassed using nested tags.",
      story: "RecipeShare allows chefs to post kitchen notes and cooking tips on recipes. The developers noticed XSS attacks and implemented a filter that removes `<script>` tags from incoming notes. Test if this tag stripping routine can be bypassed.",
      objective: "Bypass the tag stripping filter and persistently execute JavaScript when recipe notes are viewed.",
      hints: [
        "Submit `<script>alert(1)</script>` and observe the resulting stored text. Notice that the `<script>` tag disappeared.",
        "What happens if a filter removes `<script>` in a single pass without recursing?",
        "Consider what `<scr<script>ipt>` becomes after the inner `<script>` is removed.",
        "Alternatively, does the filter remove other executable tags like `<img>` or `<svg>`?"
      ],
      solution: {
        location: "Recipe note submission form.",
        context: "Stored HTML body context.",
        whyVulnerable: "The filter executes `input.replace(/<script>/gi, '')` once. When the inner `<script>` is stripped from `<scr<script>ipt>`, the outer characters collapse into `<script>`, reconstituting the tag.",
        filterAnalysis: "Only literal `<script>` and `</script>` are stripped in a single pass. Nested tags or alternative tags (`<img>`) bypass the filter completely.",
        examplePayload: "<scr<script>ipt>alert(1)</script>",
        alternativePayload: "<img src=x onerror=alert(1)>",
        steps: [
          "Submit `<script>alert(1)</script>`. Notice the rendered note shows `alert(1)` as plain text.",
          "Submit `<scr<script>ipt>alert(1)</script>` as a new note.",
          "The server strips the inner `<script>`, leaving `<script>alert(1)</script>`.",
          "The browser renders the reconstructed script tag and executes the payload."
        ],
        defense: "Never attempt to sanitize HTML using naive string replacements or regular expressions. Use an industry-standard HTML sanitizer like DOMPurify or HTML entity encoding.",
        secureCodeSnippet: "// Secure Implementation\nconst safeNote = escapeHtml(req.body.note || '');"
      }
    },
    {
      id: "SXSS-03",
      number: 3,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Stored Attribute Context",
      appName: "Skyline Agent Directory",
      appTagline: "Premier Commercial & Residential Real Estate",
      difficulty: "Easy",
      technique: "Persistent Attribute Injection",
      description: "User profile website URL is stored and rendered inside an href attribute and tooltip attribute.",
      story: "Skyline Real Estate provides directory profiles for real estate agents. Agents can update their professional bio and link to their personal agency website. The website URL is rendered as a clickable link and inside an image preview attribute on their public listing.",
      objective: "Inject a payload into the agent's profile website link that triggers JavaScript execution when viewed or clicked.",
      hints: [
        "Update the agent's website URL in the profile editor and observe how it is rendered on the public card.",
        "Inspect the link element: `<a href=\"...\" target=\"_blank\">Visit Website</a>`.",
        "Can you inject a `javascript:` URL scheme?",
        "Can you break out of the attribute using quotes (`\" onmouseover=\"...`)?"
      ],
      solution: {
        location: "Profile website link field on `/SXSS/lab3`.",
        context: "Attribute context (`href` and `title` attributes).",
        whyVulnerable: "The stored URL is directly inserted into the `<a href=\"...\">` tag without verifying that the protocol is HTTP or HTTPS, and without escaping attribute delimiters.",
        filterAnalysis: "No protocol or quote validation.",
        examplePayload: "javascript:alert(1)",
        alternativePayload: "\" onfocus=\"alert(1)\" autofocus=\"",
        steps: [
          "Navigate to the profile editor form.",
          "Set the 'Website URL' to `javascript:alert(1)` and save changes.",
          "Click the 'Visit Website' button on the rendered agent profile card.",
          "The browser executes the JavaScript pseudo-protocol."
        ],
        defense: "Validate that URLs strictly match `^https?:\\/\\/` and HTML-encode all dynamic values rendered in HTML attributes.",
        secureCodeSnippet: "// Secure Implementation\nfunction sanitizeUrl(url) {\n  return /^https?:\\/\\//i.test(url) ? escapeHtml(url) : '#';\n}"
      }
    },
    {
      id: "SXSS-04",
      number: 4,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Stored XSS With Filtering",
      appName: "ShopNest Product Reviews",
      appTagline: "Consumer Electronics & Gadget Marketplace",
      difficulty: "Intermediate",
      technique: "Case Sensitivity & Event Handler Bypass",
      description: "A server filter strips specific lowercase keywords, but fails against case variations and alternative handlers.",
      story: "ShopNest enables verified buyers to write reviews for electronics. To mitigate XSS, the backend checks for `<script>` and `onerror` in reviews and strips them. Evaluate whether this blacklist adequately secures the review section.",
      objective: "Bypass the review filter and trigger persistent JavaScript execution on the product page.",
      hints: [
        "Submit a review with `<script>` or `onerror` and inspect what was stripped from your text.",
        "Notice whether the filter is case-sensitive (does it check `<SCRIPT>` or `ONERROR`?).",
        "Test alternative event handlers such as `onload`, `onfocus`, or `ontoggle`.",
        "Try an `<svg onload=alert(1)>` or `<body onload=alert(1)>` vector."
      ],
      solution: {
        location: "Product review submission form (`review` field).",
        context: "HTML Context in the product reviews list.",
        whyVulnerable: "The filter uses a case-sensitive search for lowercase words `script` and `onerror`, allowing uppercase tags (`<SCRIPT>`) or alternate event handlers (`onload`, `onfocus`).",
        filterAnalysis: "Filter: `text.replace(/<script>/g, '').replace(/onerror/g, '')` (missing `/i` flag and incomplete blacklist).",
        examplePayload: "<SCRIPT>alert(1)</SCRIPT>",
        alternativePayload: "<svg onload=alert(1)>",
        steps: [
          "Submit `<script>alert(1)</script>`. Observe that `<script>` was stripped.",
          "Submit `<SCRIPT>alert(1)</SCRIPT>` or `<svg onload=alert(1)>`.",
          "The review is stored and rendered on the product page.",
          "The browser executes the unblocked uppercase tag or SVG onload handler."
        ],
        defense: "Never rely on blacklist string replacement. Encode all output using contextual HTML entity encoding.",
        secureCodeSnippet: "// Secure Implementation\nconst safeReview = escapeHtml(req.body.review || '');"
      }
    },
    {
      id: "SXSS-05",
      number: 5,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Multiple Rendering Locations",
      appName: "Nexus CRM & Lead Manager",
      appTagline: "Enterprise Sales Pipeline & Client Relationship Management",
      difficulty: "Intermediate",
      technique: "Context Inconsistency (Safe Profile vs. Unsafe Audit Log)",
      description: "Data is safely sanitized in the primary profile view, but rendered raw in an administrative audit log.",
      story: "Nexus CRM allows sales reps to manage client accounts and update company status notes. The primary client detail view properly escapes all user input. However, enterprise applications often display data across multiple views, reports, and administrative logs. Audit the application to find where input is handled unsafely.",
      objective: "Submit a status note, navigate to the internal Audit Log view, and trigger stored XSS where output escaping was omitted.",
      hints: [
        "Update the client status note on the main CRM dashboard and check the profile card.",
        "Notice that the status on the main card is safely HTML-encoded (e.g., &lt;b&gt; appears as text).",
        "Explore other tabs in the application, such as 'Recent Activity' or 'Internal Audit Log'.",
        "Inspect the HTML in the Audit Log view to see if the same encoding was applied there."
      ],
      solution: {
        location: "Client status update field; rendered in `/SXSS/lab5/audit-log`.",
        context: "Public view is encoded; internal Audit Log table view renders raw HTML.",
        whyVulnerable: "A classic enterprise vulnerability where developers secure the primary UI but forget to encode data in secondary views such as export previews, internal dashboards, and administrative audit trails.",
        filterAnalysis: "Primary view uses `escapeHtml(status)`, while the Audit Log directly injects `row.status` into table rows.",
        examplePayload: "<img src=x onerror=alert(1)>",
        alternativePayload: "<script>alert(1)</script>",
        steps: [
          "Go to client edit form and enter `<img src=x onerror=alert(1)>` as the Status Note.",
          "View the main client card: observe the tag is rendered as harmless text.",
          "Click the 'Audit Log / Activity Stream' tab.",
          "The Audit Log renders the stored payload raw into a `<tr><td>` cell, triggering the XSS."
        ],
        defense: "Ensure defensive encoding is applied universally across all views, reports, and administrative logs, or sanitize data using an allowlist at the storage boundary.",
        secureCodeSnippet: "// Secure Implementation in Audit Log\nconst safeAuditRow = `<tr><td>${escapeHtml(log.status)}</td></tr>`;"
      }
    },
    {
      id: "SXSS-06",
      number: 6,
      category: "SXSS",
      categoryName: "Stored XSS",
      title: "Privileged Viewer",
      appName: "CarePulse Telehealth Desk",
      appTagline: "Confidential Clinical Patient Helpdesk & Triage",
      difficulty: "Advanced",
      technique: "Administrative Bot Context Execution",
      description: "A simulated privileged compliance officer automatically reviews submitted tickets with administrative credentials.",
      story: "CarePulse is a telehealth platform where patients submit priority medical tickets. Due to healthcare regulations, an automated compliance officer bot (Dr. Sarah Jenkins) reviews submitted tickets every few seconds using an administrative session token. Your goal is to demonstrate stored XSS that executes within this privileged context.",
      objective: "Submit a ticket containing an XSS payload and observe execution when the simulated compliance officer reviews the ticket.",
      hints: [
        "Submit a new ticket and observe the ticket review status and the 'Request Priority Staff Review' button.",
        "The compliance officer views tickets with an administrative cookie `admin_session_token`.",
        "When the simulated officer reviews the ticket, any scripts in the ticket body execute in the administrative context.",
        "Submit a payload like `<script>alert('Admin Token: ' + document.cookie)</script>`."
      ],
      solution: {
        location: "Ticket description field on `/SXSS/lab6`.",
        context: "Stored HTML rendered in the compliance officer's review queue.",
        whyVulnerable: "The patient ticket body is rendered directly in the compliance officer's administrative console without escaping or sanitization.",
        filterAnalysis: "No sanitization on ticket body.",
        examplePayload: "<script>alert('Admin Session Accessed: ' + document.cookie)</script>",
        alternativePayload: "<img src=x onerror=alert(1)>",
        steps: [
          "Fill out the ticket form with an urgent title and payload `<script>alert(1)</script>` in the description.",
          "Click 'Submit & Request Priority Staff Review'.",
          "The simulated compliance bot opens the ticket in the administrative triage environment.",
          "The payload executes, confirming privilege context execution and displaying the administrative token."
        ],
        defense: "Always sanitize ticket bodies with an allowlist sanitizer, use strict Content-Security-Policy (CSP), and set the `HttpOnly` flag on session cookies so JavaScript cannot read session tokens.",
        secureCodeSnippet: "// Secure Implementation\nres.cookie('admin_session_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });\nconst cleanDescription = sanitizeHtml(req.body.description);"
      }
    }
  ],

  // ==========================================
  // DOM-BASED XSS (7 LABS)
  // ==========================================
  DOMXSS: [
    {
      id: "DOMXSS-01",
      number: 1,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Location Source",
      appName: "AeroRoute Travel Planner",
      appTagline: "Flight Itineraries & Dynamic Route Mapping",
      difficulty: "Beginner",
      technique: "DOM Source: window.location.href → Sink: innerHTML",
      description: "The application reads the current location.href and dynamically writes breadcrumb navigation using innerHTML.",
      story: "AeroRoute is an itinerary booking planner. To enhance user navigation, the page dynamically constructs a breadcrumb path using client-side JavaScript by reading `window.location.href` and writing it directly to the document. Discover the DOM source and sink.",
      objective: "Manipulate the browser URL to inject an XSS payload that executes via the client-side breadcrumb script.",
      hints: [
        "Open Developer Tools (F12) and inspect the page's `<script>` section or Sources tab.",
        "Look for where the breadcrumb navigation is generated in JavaScript.",
        "Identify the source: `window.location.href` or `location.search`.",
        "Identify the sink: `document.getElementById('breadcrumb').innerHTML = ...`.",
        "Append an HTML vector such as `?<img src=x onerror=alert(1)>` or `?test#<svg onload=alert(1)>` to the URL."
      ],
      solution: {
        location: "URL path/query string; processed client-side by `travel-router.js`.",
        context: "DOM sink `element.innerHTML`.",
        whyVulnerable: "Client-side JavaScript takes untrusted input from `location.href` (the source) and assigns it directly to `element.innerHTML` (the sink) without sanitization.",
        filterAnalysis: "No client-side sanitization.",
        examplePayload: "/DOMXSS/lab1?<img src=x onerror=alert(1)>",
        alternativePayload: "/DOMXSS/lab1#<svg onload=alert(1)>",
        steps: [
          "Inspect the page script: `document.getElementById('breadcrumb').innerHTML = 'Path: ' + location.href;`.",
          "Notice that whatever is in `location.href` is rendered directly into HTML.",
          "Append `?<img src=x onerror=alert(1)>` to the browser URL and press Enter.",
          "The script reads the URL and injects the image element into the DOM, triggering the `onerror` handler."
        ],
        defense: "Avoid assigning untrusted data to execution sinks like `innerHTML`, `outerHTML`, or `document.write()`. Use safe text sinks such as `textContent` or `innerText`.",
        secureCodeSnippet: "// Secure Client-Side Implementation\ndocument.getElementById('breadcrumb').textContent = 'Path: ' + location.pathname;"
      }
    },
    {
      id: "DOMXSS-02",
      number: 2,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Query Parameter",
      appName: "DocsFlow Knowledge Base",
      appTagline: "Developer API Reference & Documentation",
      difficulty: "Easy",
      technique: "DOM Source: location.search / URLSearchParams → Sink: innerHTML",
      description: "The search script parses the URL query parameter `q` with URLSearchParams and injects it into innerHTML.",
      story: "DocsFlow provides documentation for software libraries. When users search for an API function, client-side JavaScript reads the query parameter `q` from the URL, creates a search summary notice, and inserts it into the DOM. Identify the source-to-sink flow.",
      objective: "Pass a payload through the `q` query parameter that executes via the client-side search script.",
      hints: [
        "Search for a term in the documentation search box and observe the URL: `?q=searchterm`.",
        "Inspect the JavaScript handling the search event.",
        "Look for `new URLSearchParams(window.location.search).get('q')`.",
        "Notice where the extracted query is placed: `resultsSummary.innerHTML = 'Results for: <b>' + query + '</b>'`."
      ],
      solution: {
        location: "URL query parameter `q`.",
        context: "Client-side DOM sink: `innerHTML`.",
        whyVulnerable: "The script extracts the query parameter with `URLSearchParams.get()` (which automatically URL-decodes the string) and passes it directly to `innerHTML` without encoding.",
        filterAnalysis: "No client-side encoding or filtering is performed.",
        examplePayload: "/DOMXSS/lab2?q=<img src=x onerror=alert(1)>",
        alternativePayload: "/DOMXSS/lab2?q=<svg onload=alert(1)>",
        steps: [
          "Navigate to `/DOMXSS/lab2?q=auth` and view the page.",
          "Inspect the script: `document.getElementById('search-status').innerHTML = 'Showing results for: <strong>' + q + '</strong>';`.",
          "Change the URL to `/DOMXSS/lab2?q=<img src=x onerror=alert(1)>`.",
          "The browser parses the query parameter, assigns it to `innerHTML`, and executes the image error handler."
        ],
        defense: "Use safe DOM manipulation properties such as `element.textContent` instead of `element.innerHTML`.",
        secureCodeSnippet: "// Secure Client-Side Implementation\nconst statusEl = document.getElementById('search-status');\nstatusEl.textContent = `Showing results for: ${q}`;"
      }
    },
    {
      id: "DOMXSS-03",
      number: 3,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Hash Fragment",
      appName: "Zenith Crypto Portfolio",
      appTagline: "Multi-Asset Wealth & Portfolio Tracker",
      difficulty: "Easy",
      technique: "DOM Source: location.hash → Sink: innerHTML",
      description: "The application parses window.location.hash for tab navigation and injects it into a tab title container.",
      story: "Zenith Portfolio lets cryptocurrency investors switch between asset tabs ('Overview', 'Holdings', 'Analytics'). The application uses the URL hash fragment (`#holdings`) to maintain client-side routing state. Investigate how the hash is extracted and rendered.",
      objective: "Craft a URL with a fragment identifier that executes arbitrary JavaScript when the page loads or hash changes.",
      hints: [
        "Click on different tabs and observe how the URL hash changes (e.g. `#overview`, `#holdings`).",
        "Inspect the `window.onhashchange` or tab initialization script in Developer Tools.",
        "Notice how `window.location.hash` is read and decoded.",
        "Payloads in the URL hash are never sent to the backend server — exploitation happens entirely in the browser."
      ],
      solution: {
        location: "URL hash fragment (`window.location.hash`).",
        context: "DOM sink: `document.getElementById('active-tab-display').innerHTML`.",
        whyVulnerable: "The client script takes `decodeURIComponent(window.location.hash.substring(1))` and passes it straight into `innerHTML`.",
        filterAnalysis: "No validation against an allowlist of valid tab names.",
        examplePayload: "/DOMXSS/lab3#<img src=x onerror=alert(1)>",
        alternativePayload: "/DOMXSS/lab3#<svg onload=alert(1)>",
        steps: [
          "Inspect the tab router script: `let currentTab = decodeURIComponent(location.hash.slice(1)); ... activeTabDisplay.innerHTML = 'Section: ' + currentTab;`.",
          "Navigate to `/DOMXSS/lab3#<img src=x onerror=alert(1)>`.",
          "The hash change handler extracts the string after `#`, passes it to `innerHTML`, and executes the payload."
        ],
        defense: "Validate the hash against a strict allowlist of recognized tabs (e.g. `['overview', 'holdings', 'analytics']`), and set textual content using `textContent`.",
        secureCodeSnippet: "// Secure Client-Side Implementation\nconst VALID_TABS = ['overview', 'holdings', 'analytics'];\nconst tab = location.hash.slice(1);\nif (VALID_TABS.includes(tab)) {\n  displayEl.textContent = tab;\n}"
      }
    },
    {
      id: "DOMXSS-04",
      number: 4,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "JavaScript Transformation",
      appName: "GlobalFx Currency Calc",
      appTagline: "Real-Time Foreign Exchange Rates",
      difficulty: "Intermediate",
      technique: "JSON Config Transformation & DOM Sink",
      description: "User input is passed as a JSON or encoded string, unpacked by client JavaScript, and assigned to a DOM sink.",
      story: "GlobalFx provides real-time foreign exchange conversions. The site supports custom promotional widgets configured via a URL parameter `config`. The client-side script parses this configuration object and injects promotional notices. Analyze the data transformation.",
      objective: "Craft a configuration object in the URL that unpacks into a malicious payload and reaches the DOM sink.",
      hints: [
        "Inspect the URL parameter: notice `?config={...}` or encoded JSON.",
        "Review the script `currency-widget.js` to see how `config` is parsed.",
        "Look for `JSON.parse()` or custom string splitting operations.",
        "Identify which property of the configuration object is rendered into `banner.innerHTML`."
      ],
      solution: {
        location: "URL parameter `config` containing serialized JSON.",
        context: "JSON parsing followed by `element.innerHTML = config.notice`.",
        whyVulnerable: "Developers often mistakenly believe that structured data formats like JSON protect against XSS. While JSON prevents string breakout during serialization, if a parsed property is later sent to an HTML sink, XSS occurs.",
        filterAnalysis: "Valid JSON syntax is required, but string values inside the JSON object are not sanitized.",
        examplePayload: '/DOMXSS/lab4?config={"notice":"<img src=x onerror=alert(1)>"}',
        alternativePayload: '/DOMXSS/lab4?config={"notice":"<svg onload=alert(1)>"}',
        steps: [
          "Inspect `currency-widget.js`: find `let cfg = JSON.parse(decodeURIComponent(params.get('config'))); document.getElementById('promo-notice').innerHTML = cfg.notice;`.",
          "Construct a valid JSON string: `{\"notice\":\"<img src=x onerror=alert(1)>\"}`.",
          "Pass it in the query parameter: `/DOMXSS/lab4?config={\"notice\":\"<img src=x onerror=alert(1)>\"}`.",
          "The script parses the JSON object and renders `cfg.notice` into `innerHTML`, executing the script."
        ],
        defense: "Always treat properties of parsed JSON objects as untrusted data. Use `textContent` or DOMPurify before inserting into DOM elements.",
        secureCodeSnippet: "// Secure Client-Side Implementation\nconst notice = cfg.notice || '';\npromoEl.textContent = notice;"
      }
    },
    {
      id: "DOMXSS-05",
      number: 5,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Source-to-Sink Analysis",
      appName: "TaskPilot Agile Board",
      appTagline: "Sprint Planning & Kanban Workflow",
      difficulty: "Intermediate",
      technique: "Multi-Function Data Flow Tracing",
      description: "Data flows through a multi-function processing pipeline (extraction → normalization → templating → render).",
      story: "TaskPilot is a sprint planning board where teams organize user stories. Filtering active cards passes data through a multi-function pipeline in `board-pipeline.js`. Follow the execution trace through each helper function to locate where sanitization is missed.",
      objective: "Perform source-to-sink data-flow analysis, identify where data enters the template, and achieve execution.",
      hints: [
        "Open `board-pipeline.js` in the Sources tab.",
        "Trace the entry point `initFilterPipeline()` and look at the helper functions called in sequence.",
        "Notice the pipeline: `readFilterQuery()` → `normalizeState()` → `compileFilterBadge()` → `renderHeader()`.",
        "Check each transformation: does any step properly encode HTML special characters before the template string is assigned to `innerHTML`?"
      ],
      solution: {
        location: "Query parameter `tag` through `board-pipeline.js`.",
        context: "Template literal concatenation inside `compileFilterBadge()` reaching `innerHTML`.",
        whyVulnerable: "Complex codebases often obscure vulnerabilities across multiple modular functions. Even if data passes through validation and normalization functions, the lack of an encoding step before the final DOM sink leaves the pipeline vulnerable.",
        filterAnalysis: "Functions trim whitespace and convert to lowercase or capitalize, but do not encode HTML.",
        examplePayload: "/DOMXSS/lab5?tag=<img src=x onerror=alert(1)>",
        alternativePayload: "/DOMXSS/lab5?tag=<svg onload=alert(1)>",
        steps: [
          "Trace `board-pipeline.js` from `readFilterQuery()` to `renderHeader()`.",
          "Confirm that `compileFilterBadge(tag)` constructs `<span class='badge'>${tag}</span>` and returns it directly to `header.innerHTML`.",
          "Supply `/DOMXSS/lab5?tag=<img src=x onerror=alert(1)>`.",
          "The pipeline processes the string and injects it into the header container, executing the payload."
        ],
        defense: "Implement context-aware encoding at the sink level, or use safe DOM node creation (`document.createElement()`, `element.textContent`).",
        secureCodeSnippet: "// Secure Implementation\nfunction compileFilterBadge(tag) {\n  const span = document.createElement('span');\n  span.className = 'badge';\n  span.textContent = tag;\n  return span;\n}"
      }
    },
    {
      id: "DOMXSS-06",
      number: 6,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Client-Side Filtering",
      appName: "SanitizePro Markdown & Preview",
      appTagline: "Collaborative Documentation & Rich Notes",
      difficulty: "Advanced",
      technique: "Flawed Client-Side Regex Sanitizer Bypass",
      description: "A client-side regex filter attempts to sanitize input before passing it to innerHTML, but contains critical flaws.",
      story: "SanitizePro provides a live text and note preview engine. To protect against DOM XSS, the developer wrote a custom client-side sanitization function in `preview-sanitizer.js` that strips `<script>` tags and `javascript:` strings using regex replace. Audit the regex logic to discover its bypass.",
      objective: "Inspect the client-side regex filter, craft a payload that circumvents the replacement rules, and trigger XSS.",
      hints: [
        "Open `preview-sanitizer.js` in Developer Tools.",
        "Inspect the regular expressions used in `cleanseInput(str)`.",
        "Notice `str.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')`.",
        "Does the regex strip HTML elements like `<img>`, `<svg>`, or `<details>` with event handlers?",
        "Notice also how `replace('javascript:', '')` without a regex only strips the first occurrence."
      ],
      solution: {
        location: "Preview input parameter `content` or live preview input box.",
        context: "Client-side `innerHTML` assignment after flawed sanitization.",
        whyVulnerable: "Writing custom HTML sanitizers using regular expressions is notoriously error-prone. The filter attempts to match `<script>` tags, completely ignoring other executable elements like `<img>` or `<svg>`.",
        filterAnalysis: "The filter specifically targets `<script>...</script>` and single instances of `javascript:`, but leaves event handlers like `onerror` and `onload` on other tags completely untouched.",
        examplePayload: "<img src=x onerror=alert(1)>",
        alternativePayload: "<svg onload=alert(1)>",
        steps: [
          "Enter `<script>alert(1)</script>` and observe that it is stripped.",
          "Inspect `preview-sanitizer.js` to confirm the regex only targets `<script>` tags.",
          "Enter `<img src=x onerror=alert(1)>` or `<svg onload=alert(1)>`.",
          "The custom sanitizer passes the tag untouched, and the preview container executes the handler."
        ],
        defense: "Never write custom regex sanitizers. Use trusted, battle-tested libraries such as DOMPurify: `DOMPurify.sanitize(userInput)`.",
        secureCodeSnippet: "// Secure Client-Side Implementation\n// Use DOMPurify\nconst clean = DOMPurify.sanitize(rawInput);\npreviewContainer.innerHTML = clean;"
      }
    },
    {
      id: "DOMXSS-07",
      number: 7,
      category: "DOMXSS",
      categoryName: "DOM-Based XSS",
      title: "Advanced DOM XSS",
      appName: "HyperApp Cloud Orchestrator",
      appTagline: "Kubernetes Cluster Management & Microservices",
      difficulty: "Expert",
      technique: "Dynamic Plugin Hook & State Store Injection",
      description: "A complex SPA with state store and dynamic plugin registry executes dynamic hooks from URL configuration.",
      story: "HyperApp is an enterprise cloud orchestrator dashboard. The application implements a modern client-side architecture with a reactive state store and a modular plugin loader. Plugin configurations can be initialized via deep URL parameters for automated reporting integrations. Analyze the state dispatch and plugin execution lifecycle.",
      objective: "Trace the state store action handlers in `hyper-orchestrator.js`, locate the dynamic execution hook sink, and exploit it.",
      hints: [
        "Examine `hyper-orchestrator.js` and trace how `state.pluginConfig` is initialized.",
        "Look for the plugin initialization function `HyperStore.dispatch('LOAD_PLUGIN', ...)`.",
        "Identify how the plugin renders: look for `new Function()` or dynamic evaluation of template hooks.",
        "Check parameter `?plugin_config=` or `?render_hook=` and craft a payload that triggers the execution callback."
      ],
      solution: {
        location: "Query parameter `plugin_config` parsed into state store.",
        context: "Dynamic execution sink `new Function(...)` or template evaluation.",
        whyVulnerable: "The state store allows arbitrary plugin configurations from the URL to define dynamic execution hooks or template callbacks, which are evaluated by the plugin manager using `new Function('context', plugin.hook)(state)`.",
        filterAnalysis: "No validation that the hook is registered in an allowlist of approved enterprise plugins.",
        examplePayload: '/DOMXSS/lab7?plugin_config={"name":"custom","hook":"alert(1)"}',
        alternativePayload: '/DOMXSS/lab7?plugin_config={"name":"telemetry","hook":"confirm(1)"}',
        steps: [
          "Open `hyper-orchestrator.js` in Developer Tools.",
          "Trace `LOAD_PLUGIN`: `if (plugin.hook) { new Function('ctx', plugin.hook)(state); }`.",
          "Notice `plugin_config` is read from `URLSearchParams` and passed to `LOAD_PLUGIN`.",
          "Construct URL: `/DOMXSS/lab7?plugin_config={\"name\":\"debug\",\"hook\":\"alert(1)\"}`.",
          "Navigate to the URL: the state store dispatches the action, and the plugin manager executes `new Function` with `alert(1)`."
        ],
        defense: "Never evaluate code dynamically from untrusted input using `eval()`, `new Function()`, or `setTimeout(string)`. Use declarative data configurations and static function mappings.",
        secureCodeSnippet: "// Secure Client-Side Implementation\nconst APPROVED_HOOKS = {\n  telemetry: () => logTelemetry(),\n  status: () => updateStatus()\n};\nconst hook = APPROVED_HOOKS[plugin.name];\nif (hook) hook();"
      }
    }
  ]
};

module.exports = labsData;
