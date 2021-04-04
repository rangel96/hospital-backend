// Import packs installs
const { response } = require('express');
const encrypt = require('bcryptjs');

// Import packs generates
const UsuarioI = require('../models/usuario');
const { generateJWT } = require("../helpers/jwt");


const login = async(req, res= response) => {

    // Body extraction
    const { email, password } = req.body;

    try {

        // Comprobar que el usuario exista en la BD con el email
        const usuario = await UsuarioI.findOne({ email });
        if (!usuario) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'Email not found'
            });
        }

        // Comparar contraseñas
        const validPassword = encrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.json({
                status: false,
                msg: 'Password invalid'
            })
        }

        // Generate JWT
        const token = await generateJWT(usuario.id);

        // Mensaje de satisfacción tipo JSON
        res.json({
            status: true,
            msg: 'Inicio de sesión correcto',
            data: usuario,
            token
        })

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Error al autenticar al usuario',
            data: e.error
        })
    }
};






// Export methods
module.exports = {
    login
};
