// Import packs
const jwt = require("jsonwebtoken");
const { response } = require('express');

// Import packs creates
const UsuarioI = require('../models/usuario');


const validJWT = (req, res = response, next) => {

    // Read headers
    const token = req.headers['x-token'];

    // if don't found token
    if (!token) {
        return res.json({
            status: false,
            msg: 'Tokenless token not found'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch (err) {
        // Mensajes de error en consola y por JSON
        console.log(err);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al validar el token',
        });
    }

};


const validRole = async (req, res = response, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        // Buscar el uid en la base de datod
        const usuario = await UsuarioI.findById({ _id: uid } );

        // Comprobar si el usuario existe
        if (!usuario) {
            res.json({
                status: false,
                msg: 'El usuario no se encontró en la base de datos',
            });
        }

        // Comprobar el role del usuario
        (usuario.role === 'ADMIN_ROLE' || uid === id)
            ? next()
            : res.json({
                status: false,
                msg: 'No cuentas con los privilegios necesarios',
            });

    } catch (err) {
        // Mensajes de error en consola y por JSON
        console.log(err);
        return res.json({
            status: false,
            msg: 'Necesita ser un administrator',
        });
    }

};


module.exports = {
    validJWT,
    validRole
}

