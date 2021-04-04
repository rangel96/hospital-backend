/*
* Ruta: api/auth
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { login } = require('../controllers/auth');


const router = Router();


// Controllers
router.post('/login', [
    validJWT,
    check('email', 'El email es obligatorio').notEmpty().isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    validCampos
], login)


// Export Routes
module.exports = router;
