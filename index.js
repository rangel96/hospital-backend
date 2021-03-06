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

// Directorio publico
app.use(express.static('public'));



// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/busquedas', require('./routes/searchs'));
app.use('/api/uploads', require('./routes/uploads'));



// Controlar el puerto donde se corre el servidor
app.listen(process.env.PORT || 3000, () => {
    console.log('Server ON. Port: ' + (process.env.PORT || 3000));
});
