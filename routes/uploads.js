/*
* Ruta: /api/upload
* */
// Paquetes
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

// Validators
const { validJWT } = require("../middlewares/valid-jwt");

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

router.get('/:tipo/:img', getFile);


// Export routs
module.exports = router;
