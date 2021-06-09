/*
* Ruta: /api/upload
* */
// Paquetes
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

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

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Controllers
router.put('/:tipo/:id', validJWT, uploadFile);

router.get('/:tipo/:img', getFile);


// Export routs
module.exports = router;
