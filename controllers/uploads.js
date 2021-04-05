// Import packs installs
const { response } = require('express');

// Import packs creates
const UsuarioI = require('../models/usuario');


// Methods
const fileUpload = async (req, res = response) => {

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

    // Validad ID
    console.log(req.files);

    // Validar archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({
            status: false,
            msg: 'Archivo vacio'
        });
    }


    res.json({
        status: true,
        msg: 'Upload file',
        data: {tipo, id}
    })


};








// Export methods
module.exports = {
    fileUpload,
};
