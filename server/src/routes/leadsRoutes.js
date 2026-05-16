const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadsController');
const { revisarErrores } = require('../middleware/validaciones');
const verificarToken = require('../middleware/auth');

// endpoint público para recibir leads (con validaciones)
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('whatsapp').notEmpty().withMessage('El número de WhatsApp es obligatorio'),
    body('servicio').notEmpty().withMessage('El tipo de servicio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    revisarErrores
], createLead);

// endpoint protegido para el dashboard del admin (lista y busca)
router.get('/', verificarToken, getLeads);

// endpoint protegido para actualizar estado
router.put('/:id/estado', verificarToken, updateLeadStatus);

module.exports = router;