const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos en milisegundos
    max: 5, // Límite de 5 intentos fallidos por IP
    message: { error: 'Demasiados intentos fallidos. Intente más tarde.' },
    statusCode: 429, // El código clave que espera React
    standardHeaders: true, 
    legacyHeaders: false,
});

module.exports = { loginLimiter };