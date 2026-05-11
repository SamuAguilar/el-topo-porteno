const pool = require('../config/db');

// convierte un lead existente en un cliente confirmado
const createCliente = async (req, res) => {
    try {
        const { lead_id } = req.body;

        if (!lead_id) {
            return res.status(400).json({ error: 'El ID del lead es obligatorio' });
        }

        // 1. Buscamos los datos del lead
        const [leads] = await pool.query('SELECT nombre, whatsapp, email FROM leads WHERE id = ?', [lead_id]);
        
        if (leads.length === 0) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        const { nombre, whatsapp, email } = leads[0];

        // 2. Insertamos el registro en la tabla clientes
        const [result] = await pool.query(
            'INSERT INTO clientes (lead_id, nombre, whatsapp, email) VALUES (?, ?, ?, ?)',
            [lead_id, nombre, whatsapp, email]
        );

        res.status(201).json({
            mensaje: 'Cliente registrado exitosamente',
            cliente_id: result.insertId
        });

    } catch (error) {
        // capturamos el error especifico si se intenta duplicar un lead
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este lead ya fue convertido a cliente previamente' });
        }
        
        console.error('Fallo al crear cliente:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Obtiene la lista de todos los clientes
const getClientes = async (req, res) => {
    try {
        // Seleccionamos los datos clave ordenados por fecha de alta (los mas nuevos primero)
        const [clientes] = await pool.query(
            'SELECT id, lead_id, nombre, whatsapp, email, fecha_alta FROM clientes ORDER BY fecha_alta DESC'
        );
        
        res.json(clientes);
    } catch (error) {
        console.error('Fallo al obtener la lista de clientes:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};


module.exports = {
    createCliente,
    getClientes 
};