const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const verificarToken = require('../middleware/auth');

// endpoint protegido para traer las estadisticas
router.get('/stats', verificarToken, getDashboardStats);

module.exports = router;