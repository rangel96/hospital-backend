// Import packs installs
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Import packs creates
const { imgUpload, imgCloudinary } = require('../helpers/upload-file');


// Methods
const uploadFile = async (req, res = response) => {

    // Catch 'tipo' y 'id' de params (URL)
    const tipo = req.params.tipo;
    const id = req.params.id;


    // Validar el tipo
    const tipoValid = ['usuarios', 'hospitales', 'medicos'];
    if (!tipoValid.includes(tipo)) {
        return res.json({
            status: false,
            msg: 'Tipo no reconocido'
        });
    }


    // Validar archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            status: false,
            msg: 'Archivo vacio'
        });
    }


    // Procesar la imagen
    const file = req.files.img;


    // Obtener extensión del archivo
    const extraerNombre = file.name.split('.');
    const extensionArchivo = extraerNombre[extraerNombre.length - 1];


    // Validar extensión
    const extensionsValids = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionsValids.includes(extensionArchivo)) {
        return res.json({
            status: false,
            msg: 'Tipo de archivo no permitido'
        });
    }


    //* * Carga de archivo en Cloudinary * *//
    const { url, public_id, format } = await cloudinary.uploader.upload(file.tempFilePath, (error, result) => {

        if (error) {
            console.warn(error);
            return res.json({
                status: false,
                msg: 'Error al subir el archivo a Cloudinary',
                error
            });
        }

    });


    // Actualizar la BD
    (await imgCloudinary(tipo, id, url))
    ? res.json({
            status: true,
            msg: 'Archivo subido',
            data: `${ public_id }.${ format }`
      })
    : res.json({
            status: false,
            msg: 'Error al subir el archivo a Cloudinary'
      });




    //* * Carga de archivo en Servidor Local * *//
    // Generar el nombre del archivo
    // const nameFile = `${uuidv4()}.${extensionArchivo}`;


    // Path para guardar la imagen
    // const path = `./uploads/${tipo}`;


    // Mover la imagen
    /*await file.mv(`${path}/${nameFile}`, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: false,
                msg: 'Error al mover la imagen'
            });
        }


        // Actualizar la BD
        imgUpload(tipo, id, path, nameFile);


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Archivo subido',
            data: nameFile
        });
    });*/

};

const  getFile = async (req, res = response) => {

    // Catch 'tipo' y 'id' de params (URL)
    const tipo = req.params.tipo;
    const img = req.params.img;


    // Get path de la imagen
    let pathImg = path.join(__dirname, `../uploads/${tipo}/${img}`);


    // Validar que el nombre coincida
    if (fs.existsSync(pathImg)) {
        // Mandar archivo
        res.sendFile(pathImg);
    } else {
        // Send Img default
        pathImg = path.join(__dirname, '../assets/img/no-image.png');
        res.sendFile(pathImg);
    }


};



// Export methods
module.exports = {
    uploadFile,
    getFile
};
