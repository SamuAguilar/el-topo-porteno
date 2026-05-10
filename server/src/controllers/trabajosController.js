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

module.exports = {
    createTrabajo,
    updateTrabajoStatus
};