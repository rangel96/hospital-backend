// Import packs installs
const { response } = require('express');
const encrypt = require('bcryptjs');

// Import packs generates
const UsuarioI = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenu } = require('../helpers/menu-frontend');


// Methods
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

        // Mensaje de satisfacción tipo JYSON
        res.json({
            status: true,
            msg: 'Inicio de sesión correcto',
            data: usuario,
            token,
            menu: getMenu(usuario.role)
        })

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Error al autenticar al usuario'
        })
    }
};

const googleSignIn = async(req, res= response) => {

    // Body extraction
    const tokenGoogle = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(tokenGoogle);

        // Comprobar que el usuario exista en la BD con el email
        let usuario = await UsuarioI.findOne({ email });
        if (usuario) {

            // Validar si se registró con google
            if (!usuario.google) {
                return res.json({
                    status: false,
                    msg: 'Usuario registrado de forma local'
                });
            }

            // Generate JWT
            const token = await generateJWT(usuario.id);

            // Mensaje de error tipo JSON
            return res.json({
                status: true,
                msg: 'Google Sign-In',
                data: usuario,
                token,
                menu: getMenu(usuario.role)
            });
        }

        // Crear Usuario por Google
        usuario = new UsuarioI({
            nombre: name,
            email,
            img: picture,
            google: true
        } );

        // Guardar usuario en la BD
        await usuario.save();

        // Generate JWT
        const token = await generateJWT(usuario.id);

        // Mensaje de satisfacción tipo JSON
        res.json({
            status: true,
            msg: `Usuario ${name} creado con Google`,
            data: usuario,
            token,
            menu: getMenu(usuario.role)
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Token incorrecto'
        })
    }
};

const renewToken = async (req, res = response) => {

    // Extraer UID del token
    const uid = req.uid;

    // Generate JWT
    const token = await generateJWT(uid);

    // Busqueda del Usuario
    const usuario = await UsuarioI.findById({ _id: uid } )

    // Eliminación de UID
    delete usuario.uid;

    // Mensaje de satisfacción tipo JSON
    res.json({
        status: true,
        msg: 'Token renovado',
        data: usuario,
        token,
        menu: getMenu(usuario.role)
    });

};






// Export methods
module.exports = {
    login,
    googleSignIn,
    renewToken
};
