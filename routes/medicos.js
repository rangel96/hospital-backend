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
const { getMedicos, createMedico, updateMedico, deleteMedico } = require('../controllers/medicos');


const router = Router();


// Controllers
router.get('/', validJWT, getMedicos);

router.post('/', [
    validJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validCampos
], createMedico);

router.put('/:id', [
    validJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validCampos
], updateMedico);

router.delete('/:id', validJWT, deleteMedico);


// Export routs
module.exports = router;
