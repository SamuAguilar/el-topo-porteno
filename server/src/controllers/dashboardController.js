const pool = require('../config/db');

// Obtiene los contadores principales para la pantalla de inicio
const getDashboardStats = async (req, res) => {
    try {
        // Ejecutamos las tres consultas en paralelo para que sea super rapido
        const [leads] = await pool.query("SELECT COUNT(*) AS total FROM leads WHERE estado = 'Nuevo'");
        const [clientes] = await pool.query("SELECT COUNT(*) AS total FROM clientes");
        const [trabajos] = await pool.query("SELECT COUNT(*) AS total FROM trabajos WHERE estado IN ('Presupuestado', 'Aceptado', 'En ejecucion')");

        // Devolvemos un objeto armado con los tres numeros
        res.json({
            leads_nuevos: leads[0].total,
            clientes_totales: clientes[0].total,
            trabajos_activos: trabajos[0].total
        });

    } catch (error) {
        console.error('Fallo al obtener las estadisticas del dashboard:', error);
        res.status(500).json({ error: 'Fallo interno del servidor' });
    }
};

module.exports = {
    getDashboardStats
};