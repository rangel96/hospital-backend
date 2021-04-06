/*
* Ruta: /api/upload
* */
// Paquetes
const { Router } = require('express');
// const { check } = require('express-validator');
const expressFileUpload = require('express-fileupload');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
// const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { uploadFile, getFile } = require('../controllers/uploads');


const router = Router();

// Middleware
router.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


// Controllers
router.put('/:tipo/:id', validJWT, uploadFile);

router.get('/:tipo/:img', validJWT, getFile);


// Export routs
module.exports = router;
