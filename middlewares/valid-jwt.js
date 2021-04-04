// Import packs
const jwt = require("jsonwebtoken");
const { response } = require('express');


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


module.exports = {
    validJWT
}

