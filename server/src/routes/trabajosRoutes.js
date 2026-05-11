const express = require('express');
const router = express.Router();
const { createTrabajo, updateTrabajoStatus, getTrabajos, getHistorialTrabajo } = require('../controllers/trabajosController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para listar todos los trabajos
router.get('/', verificarToken, getTrabajos);

// endpoint protegido para registrar trabajos de un cliente
router.post('/', verificarToken, createTrabajo);

// endpoint protegido para cambiar estado y auditar
router.put('/:id/estado', verificarToken, updateTrabajoStatus);

// endpoint protegido para ver el historial de un trabajo (usamos GET y pasamos el id)
router.get('/:id/historial', verificarToken, getHistorialTrabajo);

module.exports = router;