const pool = require('../config/db');

// recibe datos del cliente desde form o webhook
const createLead = async (req, res) => {
    try {
        const { nombre, whatsapp, email, servicio, descripcion } = req.body;

        // chequeo de campos obligatorios
        if (!nombre || !whatsapp || !email || !servicio || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios en la peticion' });
        }

        // insertamos registro en bd
        const [result] = await pool.query(
            'INSERT INTO leads (nombre, whatsapp, email, servicio, descripcion) VALUES (?, ?, ?, ?, ?)',
            [nombre, whatsapp, email, servicio, descripcion]
        );

        // respuesta de exito con id insertado
        res.status(201).json({
            mensaje: 'Lead registrado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Fallo al insertar lead:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

const getLeads = async (req, res) => {
    try {
        // consultamos los leads ordenados por fecha mas reciente
        const [rows] = await pool.query('SELECT * FROM leads ORDER BY fecha_creacion DESC');
        res.json(rows);
    } catch (error) {
        console.error('Fallo al obtener leads:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = {
    createLead,
    getLeads
};