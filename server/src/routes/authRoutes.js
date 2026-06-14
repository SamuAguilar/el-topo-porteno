const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimit');

// definimos el endpoint para login pasando primero por el limitador
router.post('/login', loginLimiter, login);

module.exports = router;