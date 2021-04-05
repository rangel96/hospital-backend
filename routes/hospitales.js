/*
* Ruta: api/medicos
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { getHospitales, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitales');


const router = Router();


// Controllers
router.get('/', validJWT, getHospitales);

router.post('/', [
        validJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('img', 'La imagen es obligatoria').notEmpty(),
        validCampos,

    ],
    createHospital);

router.put('/:id', [
        validJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('img', 'La imagen es obligatoria').notEmpty(),
        validCampos
    ],
    updateHospital);

router.delete('/:id', validJWT, deleteHospital);


// Export routs
module.exports = router;
