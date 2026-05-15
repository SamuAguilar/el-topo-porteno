const express = require('express');
const router = express.Router();
const { createTrabajo, updateTrabajoStatus, getTrabajos, getHistorialTrabajo, updateTrabajo, deleteTrabajo } = require('../controllers/trabajosController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para listar todos los trabajos
router.get('/', verificarToken, getTrabajos);

// endpoint protegido para registrar trabajos de un cliente
router.post('/', verificarToken, createTrabajo);

// endpoint protegido para cambiar estado y auditar
router.put('/:id/estado', verificarToken, updateTrabajoStatus);

// endpoint protegido para ver el historial de un trabajo (usamos GET y pasamos el id)
router.get('/:id/historial', verificarToken, getHistorialTrabajo);

// endpoint protegido para editar datos generales de un trabajo
router.put('/:id', verificarToken, updateTrabajo);

// endpoint protegido para eliminar un trabajo
router.delete('/:id', verificarToken, deleteTrabajo);

module.exports = router;