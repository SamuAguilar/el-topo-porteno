const pool = require('../config/db');

const createLead = async (req, res) => {
    try {
        const { nombre, whatsapp, email, servicio, descripcion } = req.body;
        const [result] = await pool.query(
            'INSERT INTO leads (nombre, whatsapp, email, servicio, descripcion) VALUES (?, ?, ?, ?, ?)',
            [nombre, whatsapp, email, servicio, descripcion]
        );
        res.status(201).json({ mensaje: 'Lead registrado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Fallo al insertar lead:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

const getLeads = async (req, res) => {
    try {
        const buscar = req.query.buscar; 
        // Agregamos es_cliente a la consulta
        let query = 'SELECT id, nombre, whatsapp, email, servicio, descripcion, estado, fecha_creacion, es_cliente FROM leads';
        const queryParams = [];

        if (buscar) {
            query += ' WHERE nombre LIKE ? OR whatsapp LIKE ?';
            const terminoBusqueda = `%${buscar}%`; 
            queryParams.push(terminoBusqueda, terminoBusqueda);
        }

        query += ' ORDER BY fecha_creacion DESC';
        const [leads] = await pool.query(query, queryParams);
        res.json(leads);
    } catch (error) {
        console.error('Fallo al obtener la lista de leads:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosValidos = ['Nuevo', 'Contactado', 'Cerrado exitoso', 'Cerrado no concretado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no valido' });
        }

        // MAGIA: Si el estado es "Cerrado exitoso", se convierte en cliente (true). Si lo revierten, vuelve a ser lead (false).
        const es_cliente = (estado === 'Cerrado exitoso') ? true : false;

        const [result] = await pool.query(
            'UPDATE leads SET estado = ?, es_cliente = ? WHERE id = ?',
            [estado, es_cliente, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error('Fallo al actualizar estado del lead:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = { createLead, getLeads, updateLeadStatus };