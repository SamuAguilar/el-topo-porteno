const pool = require('../config/db');

// --- createTrabajo y otros métodos se mantienen iguales ---
const createTrabajo = async (req, res) => {
    try {
        const contacto_id = req.body.lead_id || req.body.cliente_id;
        const { tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio } = req.body;
        if (!contacto_id || !tipo_servicio || !ubicacion) return res.status(400).json({ error: 'Faltan campos' });

        const [result] = await pool.query(
            'INSERT INTO trabajos (lead_id, tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio) VALUES (?, ?, ?, ?, ?, ?)',
            [contacto_id, tipo_servicio, ubicacion, profundidad_estimada || null, observaciones || null, precio || null]
        );
        res.status(201).json({ mensaje: 'Trabajo registrado', trabajo_id: result.insertId });
    } catch (error) {
        console.error(error); res.status(500).json({ error: 'Error interno' });
    }
};

const updateTrabajoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_nuevo, notas } = req.body;
        const usuario_id = req.usuario?.id || null; 

        // 1. Obtenemos estado actual ANTES de cambiarlo
        const [trabajo] = await pool.query('SELECT estado FROM trabajos WHERE id = ?', [id]);
        if (trabajo.length === 0) return res.status(404).json({ error: 'No encontrado' });
        
        const estado_anterior = trabajo[0].estado;

        // 2. Solo actualizamos si el estado es realmente diferente
        if (estado_anterior !== estado_nuevo) {
            
            // Lógica de fechas (solo actualizamos si es NULL)
            let updateQuery = 'UPDATE trabajos SET estado = ?';
            const params = [estado_nuevo];
            
            const estadoLimpio = String(estado_nuevo).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (estadoLimpio.includes('ejecucion')) {
                updateQuery += ", fecha_inicio = COALESCE(fecha_inicio, NOW())";
            } else if (estadoLimpio.includes('finalizado')) {
                updateQuery += ", fecha_fin = COALESCE(fecha_fin, NOW())";
            }
            
            updateQuery += ' WHERE id = ?';
            params.push(id);
            await pool.query(updateQuery, params);

            // 3. Insertamos el historial SOLO AQUÍ (evita duplicados)
            await pool.query(
                'INSERT INTO historial_trabajos (trabajo_id, estado_anterior, estado_nuevo, usuario_id, comentario) VALUES (?, ?, ?, ?, ?)',
                [id, estado_anterior, estado_nuevo, usuario_id, notas || null]
            );

            // 4. Guardamos observaciones si existen
            if (notas) {
                await pool.query(
                    'INSERT INTO observaciones_trabajo (trabajo_id, observacion, estado_trabajo) VALUES (?, ?, ?)',
                    [id, notas, estado_nuevo]
                );
            }
        }

        res.json({ mensaje: 'Actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
};

const getTrabajos = async (req, res) => {
    try {
        const query = `
            SELECT t.id, t.lead_id AS cliente_id, c.nombre AS cliente_nombre, t.tipo_servicio, 
                   t.ubicacion, t.profundidad_estimada, t.precio, t.observaciones, 
                   t.estado, t.fecha_inicio, t.fecha_fin
            FROM trabajos t
            JOIN leads c ON t.lead_id = c.id
            ORDER BY t.created_at DESC
        `;
        const [trabajos] = await pool.query(query);
        res.json({ data: trabajos });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

const getHistorialTrabajo = async (req, res) => {
    try {
        const { id } = req.params; 
        const [historial] = await pool.query(`
            SELECT h.id, h.estado_anterior, h.estado_nuevo, h.comentario, h.fecha_cambio, 
                   IFNULL(u.username, 'Sistema') AS modificado_por
            FROM historial_trabajos h
            LEFT JOIN usuarios u ON h.usuario_id = u.id
            WHERE h.trabajo_id = ?
            ORDER BY h.fecha_cambio DESC
        `, [id]);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

const updateTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_servicio, ubicacion, profundidad_estimada, observaciones, precio } = req.body;
        await pool.query(
            'UPDATE trabajos SET tipo_servicio = COALESCE(?, tipo_servicio), ubicacion = COALESCE(?, ubicacion), profundidad_estimada = COALESCE(?, profundidad_estimada), observaciones = COALESCE(?, observaciones), precio = COALESCE(?, precio) WHERE id = ?',
            [tipo_servicio || null, ubicacion || null, profundidad_estimada || null, observaciones || null, precio || null, id]
        );
        res.json({ mensaje: 'Datos actualizados' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

const deleteTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM historial_trabajos WHERE trabajo_id = ?', [id]);
        await pool.query('DELETE FROM observaciones_trabajo WHERE trabajo_id = ?', [id]);
        await pool.query('DELETE FROM trabajos WHERE id = ?', [id]);
        res.json({ mensaje: 'Trabajo eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

const deleteHistorialItem = async (req, res) => {
    try {
        const { id_historial } = req.params;
        await pool.query('DELETE FROM historial_trabajos WHERE id = ?', [id_historial]);
        res.json({ mensaje: 'Registro eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

module.exports = { createTrabajo, updateTrabajoStatus, getTrabajos, getHistorialTrabajo, updateTrabajo, deleteTrabajo, deleteHistorialItem };