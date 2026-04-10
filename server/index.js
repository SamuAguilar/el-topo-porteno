require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de El Topo Porteño funcionando al 100%' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
