// server.js - Main Express Server for VulnXSS Training Laboratory

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple in-memory session shim via cookies for progress
app.use((req, res, next) => {
  req.session = req.session || {};
  next();
});

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public')));

// Mount Category & Page Routes
const indexRoutes = require('./routes/index');
const rxssRoutes = require('./routes/rxss');
const sxssRoutes = require('./routes/sxss');
const domxssRoutes = require('./routes/domxss');

app.use('/', indexRoutes);
app.use('/RXSS', rxssRoutes);
app.use('/SXSS', sxssRoutes);
app.use('/DOMXSS', domxssRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>404 Not Found — VulnXSS</title>
    <link rel="stylesheet" href="/css/main.css">
  </head>
  <body style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
    <div style="text-align: center; max-width: 480px; padding: 32px;">
      <h1 style="font-size: 48px; font-weight: 700; color: #111827; margin-bottom: 8px;">404</h1>
      <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">The requested lab or resource does not exist.</p>
      <a href="/" class="btn btn-primary">Return to VulnXSS Overview</a>
    </div>
  </body>
  </html>
  `);
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` VulnXSS Training Laboratory Server Active!`);
    console.log(` Access Platform: http://localhost:${PORT}`);
    console.log(` Reflected XSS:   http://localhost:${PORT}/RXSS`);
    console.log(` Stored XSS:      http://localhost:${PORT}/SXSS`);
    console.log(` DOM XSS:         http://localhost:${PORT}/DOMXSS`);
    console.log(`====================================================`);
  });
}

module.exports = app;
