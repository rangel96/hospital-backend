// Acceder al archivo .env de forma GLOBAL ('process.env')
require('dotenv').config();
// Importar ExpressJS
const express = require('express');
//Configuración del CORS
const cors = require('cors');
// Importar la configuración de la BD
const { dbConnection } = require('./database/config');


// Crear el servidor de express
const app = express();

// Configurar del CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Coneción a la base de datos
dbConnection();


// Rutas
app.use('/api/usuarios', require('./routes/usuarios.js'));
app.use('/api/auth', require('./routes/auth.js'));

// Controlar el puerto donde se corre el servidor
app.listen(process.env.port, () => {
    console.log('Server ON. Port: ' + process.env.port);
});
