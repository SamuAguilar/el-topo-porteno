const express = require('express');
const router = express.Router();
const { createCliente } = require('../controllers/clientesController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para crear un cliente a partir de un lead
router.post('/', verificarToken, createCliente);

module.exports = router;