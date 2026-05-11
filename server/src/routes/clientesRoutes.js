const express = require('express');
const router = express.Router();
const { createCliente, getClientes } = require('../controllers/clientesController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para listar todos los clientes
router.get('/', verificarToken, getClientes);

// endpoint protegido para crear un cliente a partir de un lead
router.post('/', verificarToken, createCliente);

module.exports = router;