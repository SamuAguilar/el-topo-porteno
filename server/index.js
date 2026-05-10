const express = require('express');
const cors = require('cors');
require('dotenv').config();

// forzamos la ejecucion de la conexion para ver el log
require('./src/config/db');

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());

const leadsRoutes = require('./src/routes/leadsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const clientesRoutes = require('./src/routes/clientesRoutes');
const trabajosRoutes = require('./src/routes/trabajosRoutes');

app.use('/api/leads', leadsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/trabajos', trabajosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor levantado en puerto ${PORT}`);
});