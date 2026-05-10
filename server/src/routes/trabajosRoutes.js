const express = require('express');
const router = express.Router();
const { createTrabajo, updateTrabajoStatus } = require('../controllers/trabajosController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para registrar trabajos de un cliente
router.post('/', verificarToken, createTrabajo);

// endpoint protegido para cambiar estado y auditar
router.put('/:id/estado', verificarToken, updateTrabajoStatus);

module.exports = router;