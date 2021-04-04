/*
* Ruta: api/usuarios
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validarCampos } = require('../middlewares/validar-campos');

// Controllers
const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuarios');


const router = Router();

router.get('/', getUsuarios);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El password es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty().isEmail(),
        validarCampos
    ],
    createUsuario);

router.put('/:id',
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty().isEmail(),
        check('role', 'El role es obligatorio').notEmpty(),
        validarCampos
    ],
    updateUsuario);

router.delete('/:id', deleteUsuario);


module.exports = router;
