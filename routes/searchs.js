/*
* Ruta: api/searchs
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { findAll, findColection } = require('../controllers/searchs');


const router = Router();


// Controllers
router.get('/todo/:name', validJWT, findAll);
router.get('/coleccion/:tabla/:busqueda', validJWT, findColection);




// Export routs
module.exports = router;
