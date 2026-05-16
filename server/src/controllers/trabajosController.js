const pool = require('../config/db');

// registra un trabajo asociado a un cliente en el sistema
const createTrabajo = async (req, res) => {
    try {
        const { cliente_id, tipo_servicio, ubicacion, profundidad_estimada, observaciones } = req.body;

        // validacion de campos obligatorios
        if (!cliente_id || !tipo_servicio || !ubicacion) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para el registro del trabajo' });
        }

        // insertamos el registro en la base de datos
        // nota: el estado inicial se setea automaticamente en 'Presupuestado' por la bd
        const [result] = await pool.query(
            'INSERT INTO trabajos (cliente_id, tipo_servicio, ubicacion, profundidad_estimada, observaciones) VALUES (?, ?, ?, ?, ?)',
            [cliente_id, tipo_servicio, ubicacion, profundidad_estimada || null, observaciones || null]
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
        const { id } = req.params; // ID del trabajo desde la URL
        const { estado_nuevo, notas } = req.body;
        const usuario_id = req.usuario.id; // Lo obtenemos magicamente del Token JWT

        if (!estado_nuevo) {
            return res.status(400).json({ error: 'El nuevo estado es obligatorio' });
        }

        // 1. Buscamos el estado actual antes de cambiarlo
        const [trabajo] = await pool.query('SELECT estado FROM trabajos WHERE id = ?', [id]);
        
        if (trabajo.length === 0) {
            return res.status(404).json({ error: 'Trabajo no encontrado' });
        }
        
        const estado_anterior = trabajo[0].estado;

        // 2. Actualizamos el estado en la tabla del trabajo
        await pool.query('UPDATE trabajos SET estado = ? WHERE id = ?', [estado_nuevo, id]);

        // 3. Registramos el movimiento en el historial
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
        // 1. Capturamos los parámetros de la URL (si no vienen, ponemos valores por defecto)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const estado = req.query.estado; 

        // Calculamos desde qué registro empezar a traer (OFFSET)
        const offset = (page - 1) * limit;

        // 2. Armamos la consulta base
        let query = `
            SELECT 
                t.id, 
                t.cliente_id, 
                c.nombre AS cliente_nombre, 
                t.tipo_servicio, 
                t.ubicacion, 
                t.estado, 
                t.fecha_inicio, 
                t.fecha_fin, 
                t.created_at
            FROM trabajos t
            JOIN clientes c ON t.cliente_id = c.id
        `;
        
        const queryParams = [];

        // 3. Si el frontend envió un estado para filtrar, lo agregamos a la consulta
        if (estado) {
            query += ` WHERE t.estado = ?`;
            queryParams.push(estado);
        }

        // 4. Agregamos el ordenamiento y la paginación (LIMIT y OFFSET)
        query += ` ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        // Ejecutamos la consulta principal
        const [trabajos] = await pool.query(query, queryParams);
        
        // 5. Contamos el total real de registros para que el frontend pueda armar los botones de "Página 1, 2, 3..."
        let countQuery = 'SELECT COUNT(*) as total FROM trabajos';
        const countParams = [];
        if (estado) {
            countQuery += ' WHERE estado = ?';
            countParams.push(estado);
        }
        const [totalRows] = await pool.query(countQuery, countParams);
        const total = totalRows[0].total;

        // 6. Devolvemos una respuesta enriquecida
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
        const { id } = req.params; // Obtenemos el ID del trabajo desde la URL

        // Hacemos un JOIN con la tabla de usuarios para saber el 'username' de quien hizo el cambio
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

// Actualiza los datos generales de un trabajo pero sin tocar el estado
const updateTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_servicio, ubicacion, profundidad_estimada, observaciones } = req.body;

        const [result] = await pool.query(
            'UPDATE trabajos SET tipo_servicio = COALESCE(?, tipo_servicio), ubicacion = COALESCE(?, ubicacion), profundidad_estimada = COALESCE(?, profundidad_estimada), observaciones = COALESCE(?, observaciones) WHERE id = ?',
            [tipo_servicio || null, ubicacion || null, profundidad_estimada || null, observaciones || null, id]
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

        // 1. Primero eliminamos la "higiene" (el historial) para evitar el error de MySQL
        await pool.query('DELETE FROM historial_trabajos WHERE trabajo_id = ?', [id]);

        // 2. Ahora sí, eliminamos el trabajo principal
        const [result] = await pool.query('DELETE FROM trabajos WHERE id = ?', [id]);

        // Verificamos si realmente se borró algo
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