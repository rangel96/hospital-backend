/*
* Ruta: api/usuarios
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuarios');


const router = Router();


// Controllers
router.get('/', validJWT, getUsuarios);

router.post('/', [
        validJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El password es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty().isEmail(),
        validCampos,

    ],
    createUsuario);

router.put('/:id', [
        validJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty().isEmail(),
        check('role', 'El role es obligatorio').notEmpty(),
        validCampos
    ],
    updateUsuario);

router.delete('/:id', validJWT, deleteUsuario);


// Export routs
module.exports = router;
