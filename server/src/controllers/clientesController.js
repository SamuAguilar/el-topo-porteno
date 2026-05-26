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

// Obtiene la lista de clientes, con opción de búsqueda por nombre o teléfono
const getClientes = async (req, res) => {
    try {
        const buscar = req.query.buscar; // Capturamos lo que el usuario quiere buscar
        
        let query = 'SELECT id, lead_id, nombre, whatsapp, email, fecha_alta FROM clientes';
        const queryParams = [];

        // Si viene el parámetro "buscar", agregamos la condición LIKE a la consulta
        if (buscar) {
            query += ' WHERE nombre LIKE ? OR whatsapp LIKE ?';
            // Los % indican que puede haber texto antes o después de la palabra buscada
            const terminoBusqueda = `%${buscar}%`; 
            queryParams.push(terminoBusqueda, terminoBusqueda);
        }

        query += ' ORDER BY fecha_alta DESC';

        const [clientes] = await pool.query(query, queryParams);
        
        res.json(clientes);
    } catch (error) {
        console.error('Fallo al obtener la lista de clientes:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Actualiza los datos generales de un cliente
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, whatsapp, email } = req.body;

        // Usamos COALESCE: si un valor llega indefinido (null), mantiene el valor actual de la tabla
        const [result] = await pool.query(
            'UPDATE clientes SET nombre = COALESCE(?, nombre), whatsapp = COALESCE(?, whatsapp), email = COALESCE(?, email) WHERE id = ?',
            [nombre || null, whatsapp || null, email || null, id]
        );

        // Si affectedRows es 0, significa que el ID no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Datos del cliente actualizados exitosamente' });

    } catch (error) {
        console.error('Fallo al actualizar el cliente:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};


module.exports = {
    createCliente,
    getClientes,
    updateCliente 
};