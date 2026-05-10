const express = require('express');
const router = express.Router();
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadsController');
const verificarToken = require('../middleware/auth');

// endpoint publico para recepcion de form o webhook
router.post('/', createLead);

// endpoint protegido para el dashboard del admin
router.get('/', verificarToken, getLeads);

// endpoint protegido para actualizar estado (usa put y recibe id por parametro)
router.put('/:id/estado', verificarToken, updateLeadStatus);

module.exports = router;