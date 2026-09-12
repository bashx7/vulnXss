// routes/index.js - Mounts Homepage, Lab Categories, and Progress Persistence APIs

const express = require('express');
const router = express.Router();
const { renderHomePage } = require('../views/platformPages');

// Homepage
router.get('/', (req, res) => {
  res.send(renderHomePage());
});

const labsData = require('../data/labs');

function findLabById(labId) {
  if (!labId) return null;
  const normalized = String(labId).toUpperCase().trim();
  for (const cat of ['RXSS', 'SXSS', 'DOMXSS']) {
    const list = labsData[cat] || [];
    const found = list.find(l => 
      l.id.toUpperCase() === normalized || 
      `${cat}-${l.number}` === normalized || 
      `${cat}${l.number}` === normalized ||
      `${cat}-0${l.number}` === normalized
    );
    if (found) return found;
  }
  return null;
}

// Lab Hints API (Loaded on demand to protect raw page source)
router.get('/api/lab-data/:labId/hints', (req, res) => {
  const lab = findLabById(req.params.labId);
  if (!lab) {
    return res.status(404).json({ success: false, error: 'Lab not found' });
  }
  res.json({ success: true, labId: lab.id, hints: lab.hints || [] });
});

// Lab Solution API (Loaded on demand to protect raw page source)
router.get('/api/lab-data/:labId/solution', (req, res) => {
  const lab = findLabById(req.params.labId);
  if (!lab) {
    return res.status(404).json({ success: false, error: 'Lab not found' });
  }
  res.json({ success: true, labId: lab.id, solution: lab.solution });
});

// Aliases for convenience
router.get('/api/lab-hints/:labId', (req, res) => {
  const lab = findLabById(req.params.labId);
  if (!lab) return res.status(404).json({ success: false, error: 'Lab not found' });
  res.json({ success: true, labId: lab.id, hints: lab.hints || [] });
});

router.get('/api/lab-solution/:labId', (req, res) => {
  const lab = findLabById(req.params.labId);
  if (!lab) return res.status(404).json({ success: false, error: 'Lab not found' });
  res.json({ success: true, labId: lab.id, solution: lab.solution });
});

// Progress API: Record completed lab
router.post('/api/progress/complete', (req, res) => {
  const { labId, source } = req.body;
  const lab = findLabById(labId);
  const normalizedId = lab ? lab.id : String(labId || '').toUpperCase().trim();

  if (!req.session) req.session = {};
  if (!req.session.solvedLabs) req.session.solvedLabs = [];

  if (normalizedId && !req.session.solvedLabs.includes(normalizedId)) {
    req.session.solvedLabs.push(normalizedId);
  }

  res.json({
    success: true,
    labId: normalizedId,
    source,
    solvedCount: req.session.solvedLabs ? req.session.solvedLabs.length : 1
  });
});

// Progress API: Get solved labs
router.get('/api/progress', (req, res) => {
  const solved = (req.session && req.session.solvedLabs) || [];
  res.json({ success: true, solved });
});

// Reset specific lab state
router.post('/api/reset-lab/:labId', (req, res) => {
  const rawId = req.params.labId;
  const lab = findLabById(rawId);
  const normalizedId = lab ? lab.id : String(rawId || '').toUpperCase().trim();

  if (req.session && req.session.solvedLabs) {
    req.session.solvedLabs = req.session.solvedLabs.filter(id => {
      const target = findLabById(id);
      const norm = target ? target.id : String(id).toUpperCase().trim();
      return norm !== normalizedId;
    });
  }

  // If Stored XSS, reset in-memory store
  if (lab && lab.category === 'SXSS') {
    const sxssRoutes = require('./sxss');
    if (sxssRoutes.resetLabStore) {
      sxssRoutes.resetLabStore(lab.number);
    }
  }

  res.json({ success: true, labId: normalizedId, message: `Lab ${normalizedId} reset successfully.` });
});

// Reset all platform progress
router.post('/api/reset-all', (req, res) => {
  if (req.session) {
    req.session.solvedLabs = [];
  }
  const sxssRoutes = require('./sxss');
  if (sxssRoutes.resetLabStore) {
    [1, 2, 3, 4, 5, 6].forEach(n => sxssRoutes.resetLabStore(n));
  }
  res.json({ success: true, message: 'All platform labs and progress reset successfully.' });
});

module.exports = router;
