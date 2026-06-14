const express = require('express');
const router = express.Router();
const { createTrabajo, updateTrabajoStatus, getTrabajos, getHistorialTrabajo, updateTrabajo, deleteTrabajo, deleteHistorialItem } = require('../controllers/trabajosController');
const verificarToken = require('../middleware/auth');

router.get('/', verificarToken, getTrabajos);
router.post('/', verificarToken, createTrabajo);
router.put('/:id/estado', verificarToken, updateTrabajoStatus);
router.get('/:id/historial', verificarToken, getHistorialTrabajo);
router.put('/:id', verificarToken, updateTrabajo);

// ✅ Ruta específica ANTES de la genérica
router.delete('/historial/:id_historial', verificarToken, deleteHistorialItem);
router.delete('/:id', verificarToken, deleteTrabajo);

module.exports = router;