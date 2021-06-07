/*
* Ruta: api/hospitales
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { getMedicos, getByIdMedico, createMedico, updateMedico, deleteMedico } = require('../controllers/medicos');


const router = Router();


// Controllers
router.get('/', validJWT, getMedicos);

router.get('/:id', validJWT, getByIdMedico);

router.post('/', [
    validJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('hid', 'El id del hospital debe ser válido').isMongoId(),
    validCampos
], createMedico);

router.put('/:id', [
    validJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('hid', 'El id del hospital debe ser válido').isMongoId(),
    validCampos
], updateMedico);

router.delete('/:id', validJWT, deleteMedico);


// Export routs
module.exports = router;
