/*
* Ruta: /api/upload
* */
// Paquetes
const { Router } = require('express');
const { check } = require('express-validator');
const FileUpload = require('express-fileupload');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");
const { validCampos } = require('../middlewares/valid-campos');

// Import Controllers
const { fileUpload } = require('../controllers/uploads');


const router = Router();

// default options
router.use(FileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


// Controllers
router.put('/:tipo/:id', validJWT, fileUpload);






// Export routs
module.exports = router;
