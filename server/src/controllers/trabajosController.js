const pool = require('../config/db');

// registra un trabajo asociado a un cliente en el sistema
const createTrabajo = async (req, res) => {
    try {
        const { cliente_id, tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio } = req.body;

        // validacion de campos obligatorios
        if (!cliente_id || !tipo_servicio || !ubicacion) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para el registro del trabajo' });
        }

        // insertamos el registro en la base de datos (ahora incluye precio)
        const [result] = await pool.query(
            'INSERT INTO trabajos (cliente_id, tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio) VALUES (?, ?, ?, ?, ?, ?)',
            [cliente_id, tipo_servicio, ubicacion, profundidad_estimada || null, observaciones || null, precio || null]
        );

        res.status(201).json({
            mensaje: 'Trabajo registrado exitosamente',
            trabajo_id: result.insertId
        });

    } catch (error) {
        console.error('Fallo al crear el trabajo:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// actualiza el estado de un trabajo y deja registro en historial
const updateTrabajoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_nuevo, notas } = req.body;
        const usuario_id = req.usuario.id; 

        if (!estado_nuevo) {
            return res.status(400).json({ error: 'El nuevo estado es obligatorio' });
        }

        const [trabajo] = await pool.query('SELECT estado FROM trabajos WHERE id = ?', [id]);
        
        if (trabajo.length === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        
        const estado_anterior = trabajo[0].estado;

        await pool.query('UPDATE trabajos SET estado = ? WHERE id = ?', [estado_nuevo, id]);

        await pool.query(
            'INSERT INTO historial_trabajos (trabajo_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES (?, ?, ?, ?, ?)',
            [id, estado_anterior, estado_nuevo, usuario_id, notas || null]
        );

        res.json({ 
            mensaje: 'Estado actualizado y registrado en historial correctamente' 
        });

    } catch (error) {
        console.error('Fallo al actualizar estado del trabajo:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Obtiene la lista de trabajos con soporte para filtros y paginación
const getTrabajos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const estado = req.query.estado; 

        const offset = (page - 1) * limit;

        // Agregamos t.precio a la consulta SELECT
        let query = `
            SELECT 
                t.id, 
                t.cliente_id, 
                c.nombre AS cliente_nombre, 
                t.tipo_servicio, 
                t.ubicacion, 
                t.profundidad_estimada,
                t.precio,
                t.estado, 
                t.fecha_inicio, 
                t.fecha_fin, 
                t.created_at
            FROM trabajos t
            JOIN clientes c ON t.cliente_id = c.id
        `;
        
        const queryParams = [];

        if (estado) {
            query += ` WHERE t.estado = ?`;
            queryParams.push(estado);
        }

        query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        const [trabajos] = await pool.query(query, queryParams);
        
        let countQuery = 'SELECT COUNT(*) as total FROM trabajos';
        const countParams = [];
        if (estado) {
            countQuery += ' WHERE estado = ?';
            countParams.push(estado);
        }
        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        res.json({
            data: trabajos,
            paginacion: {
                total_registros: total,
                pagina_actual: page,
                total_paginas: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Fallo al obtener la lista de trabajos:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Obtiene el historial de cambios de estado de un trabajo especifico
const getHistorialTrabajo = async (req, res) => {
    try {
        const { id } = req.params; 

        const [historial] = await pool.query(`
            SELECT 
                h.id, 
                h.estado_anterior, 
                h.estado_nuevo, 
                h.comentario, 
                h.fecha_cambio, 
                u.username AS modificado_por
            FROM historial_trabajos h
            JOIN usuarios u ON h.usuario_id = u.id
            WHERE h.trabajo_id = ?
            ORDER BY h.fecha_cambio DESC
        `, [id]);

        res.json(historial);
    } catch (error) {
        console.error('Fallo al obtener el historial del trabajo:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Actualiza los datos generales de un trabajo
const updateTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio } = req.body;

        // Actualizamos todos los campos, permitiendo actualizar el precio
        const [result] = await pool.query(
            'UPDATE trabajos SET tipo_servicio = COALESCE(?, tipo_servicio), ubicacion = COALESCE(?, ubicacion), profundidad_estimada = COALESCE(?, profundidad_estimada), observaciones = COALESCE(?, observaciones), precio = COALESCE(?, precio) WHERE id = ?',
            [tipo_servicio || null, ubicacion || null, profundidad_estimada || null, observaciones || null, precio || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }

        res.json({ mensaje: 'Datos del trabajo actualizados exitosamente' });

    } catch (error) {
        console.error('Fallo al actualizar el trabajo:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

// Elimina un trabajo y su historial asociado
const deleteTrabajo = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM historial_trabajos WHERE trabajo_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM trabajos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }

        res.json({ mensaje: 'Trabajo y su historial eliminados exitosamente' });

    } catch (error) {
        console.error('Fallo al eliminar el trabajo:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = {
    createTrabajo,
    updateTrabajoStatus,
    getTrabajos,
    getHistorialTrabajo,
    updateTrabajo,
    deleteTrabajo
};