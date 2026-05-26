const mysql = require('mysql2/promise');
require('dotenv').config();

// creamos pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// verificar conexion al arrancar
pool.getConnection()
    .then(connection => {
        console.log('BD conectada ok');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar BD:', err);
    });

module.exports = pool;