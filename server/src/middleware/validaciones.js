const { validationResult } = require('express-validator');

// Este middleware revisa si las reglas que pondremos en la ruta se cumplieron o no
const revisarErrores = (req, res, next) => {
    const errores = validationResult(req);
    // Si hay errores, frenamos la petición acá mismo y le avisamos al frontend
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    // Si todo está perfecto, le decimos "pasa al siguiente" (que será tu controlador)
    next();
};

module.exports = { revisarErrores };