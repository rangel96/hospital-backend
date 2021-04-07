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
const { login, googleSignIn } = require('../controllers/auth');


const router = Router();


// Controllers
router.post('/login', [
    check('email', 'El email es obligatorio').notEmpty().isEmail(),
    check('password', 'El password es obligatorio').notEmpty(),
    validCampos
], login)

router.post('/google', [
    check('token', 'El token de Google es obligatorio').notEmpty(),
    validCampos
], googleSignIn)


// Export Routes
module.exports = router;
