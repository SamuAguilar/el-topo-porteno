const express = require('express');
const router = express.Router();
const { createCliente, getClientes, updateCliente } = require('../controllers/clientesController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para listar todos los clientes
router.get('/', verificarToken, getClientes);

// endpoint protegido para crear un cliente a partir de un lead
router.post('/', verificarToken, createCliente);

// endpoint protegido para editar un cliente específico
router.put('/:id', verificarToken, updateCliente);

module.exports = router;