const jwt = require('jsonwebtoken');

// middleware para proteger rutas del panel
const verificarToken = (req, res, next) => {
    // capturamos el token del header de la peticion
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token faltante' });
    }

    try {
        // decodificamos el token con la clave secreta
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // inyectamos los datos del usuario en la request para uso posterior
        req.usuario = decodificado; 
        
        // cedemos el control a la siguiente funcion (el controlador)
        next(); 
    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado' });
    }
};

module.exports = verificarToken;