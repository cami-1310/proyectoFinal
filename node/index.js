const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// archivo de rutas
const routes = require('./routes');

app.use(cors());
app.use(express.json());

// Usa todas las rutas definidas en routes.js
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});