const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// verifica credenciales y devuelve token
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        // buscamos al usuario por su nombre
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const usuario = rows[0];

        // comparamos la contraseña enviada con el hash guardado
        const passwordValido = await bcrypt.compare(password, usuario.password_hash);
        
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        // generamos el token con validez de 8 horas
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Autenticacion exitosa',
            token
        });

    } catch (error) {
        console.error('Fallo en el login:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = {
    login
};