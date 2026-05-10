const express = require('express');
const router = express.Router();
const { createLead, getLeads } = require('../controllers/leadsController');
const verificarToken = require('../middleware/auth');

// endpoint publico para recepcion de form o webhook
router.post('/', createLead);

// endpoint protegido para el dashboard del admin
router.get('/', verificarToken, getLeads);

module.exports = router;