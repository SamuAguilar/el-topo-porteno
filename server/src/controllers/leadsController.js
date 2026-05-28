const pool = require('../config/db');

// recibe datos del cliente desde form o webhook
const createLead = async (req, res) => {
    try {
        const { nombre, whatsapp, email, servicio, descripcion } = req.body;

        // chequeo de campos obligatorios
        // if (!nombre || !whatsapp || !email || !servicio || !descripcion) {
        //     return res.status(400).json({ error: 'Faltan campos obligatorios en la peticion' });
        // }

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

// Obtiene la lista de leads, con opción de búsqueda por nombre o teléfono
const getLeads = async (req, res) => {
    try {
        const buscar = req.query.buscar; // Capturamos el texto a buscar
        
        let query = 'SELECT id, nombre, whatsapp, email, servicio, descripcion, estado, fecha_creacion FROM leads';
        const queryParams = [];

        // Si el frontend envía algo para buscar, filtramos con LIKE
        if (buscar) {
            query += ' WHERE nombre LIKE ? OR whatsapp LIKE ?';
            const terminoBusqueda = `%${buscar}%`; 
            queryParams.push(terminoBusqueda, terminoBusqueda);
        }

        // Ordenamos siempre por los más recientes primero
        query += ' ORDER BY fecha_creacion DESC';

        const [leads] = await pool.query(query, queryParams);
        
        res.json(leads);
    } catch (error) {
        console.error('Fallo al obtener la lista de leads:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// cambia el estado de un lead especifico
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params; // el id viene en la url
        const { estado } = req.body; // el estado viene en el json

        // validamos que el estado sea uno de los permitidos segun el der
        const estadosValidos = ['Nuevo', 'Contactado', 'Cerrado exitoso', 'Cerrado no concretado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no valido' });
        }

        // ejecutamos la actualizacion
        const [result] = await pool.query(
            'UPDATE leads SET estado = ? WHERE id = ?',
            [estado, id]
        );

        // si no afecto filas es porque el id no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lead no encontrado' });
        }

        res.json({ mensaje: 'Estado actualizado correctamente' });

    } catch (error) {
        console.error('Fallo al actualizar estado del lead:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = {
    createLead,
    getLeads,
    updateLeadStatus
};