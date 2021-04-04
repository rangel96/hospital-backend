// Import packs installs
const { response } = require('express');
const encrypt = require('bcryptjs');

// Import packs creates
const UsuarioI = require('../models/usuario');
const { generateJWT } = require("../helpers/jwt");


const getUsuarios = async(req, res) => {

    const usuarios = await UsuarioI.find({}, 'uid nombre email password role');

    res.json({
        status: true,
        msg: 'Lista de usuarios',
        data: usuarios
    })
};

const createUsuario = async(req, res = response) => {

    const { password, email } = req.body;

    try {
        const existeEmail = await UsuarioI.findOne({ email });
        if (existeEmail) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'Email ya fue registrado'
            });
        }

        const usuario = new UsuarioI(req.body);

        // Encriptar contraseña
        const salt = encrypt.genSaltSync();
        usuario.password = encrypt.hashSync(password, salt);

        // Guardar usuario en la BD
        await usuario.save();

        // Generate JWT
        const token = await generateJWT(usuario._id);

        // Mensaje tipo JSON
        res.json({
            status:true,
            msg: 'Crear usuario',
            data: usuario,
            token
        });
    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status:false,
            msg: 'Ocurrió un error al registrar al usuario',
        });
    }


};

const updateUsuario = async(req, res = response) => {

    // Extraemos el parametro id
    const uid = req.params.id;

    try {

        // Verificar que el usuario existe en la BD por busqueda del id
        const usuarioExiste = await UsuarioI.findById(uid);
        if (!usuarioExiste) {
        return res.json({
            status:false,
            msg: 'El id no se encuentra en la BD',
        });
        }

        // TODO: Validar token y comprobar si es el usuario correcto


        // Limpiar el body, verificar que el email no se repita en la BD
        const { password, google, email, ...campos } = new UsuarioI(req.body);
        if (usuarioExiste.email !== email) {
            // Verificar si el email nuevo existe en la BD
            const existeEmail = await UsuarioI.findOne({ email });
            if (existeEmail) {
                // Mensaje de error tipo JSON
                return res.json({
                    status: false,
                    msg: 'Existe un registro con ese correo'
                });
            }
        }

        // Eliminar _id, password y google del objeto campos
        delete campos._doc._id;
        delete campos._doc.password;
        delete campos._doc.google;

        // Actualizar usuario en la BD
        const updateUsuario = await UsuarioI.findByIdAndUpdate(uid, campos, { new: true });


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Usuario actualizado correctamente',
            data: updateUsuario
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
         return res.json({
            status:false,
            msg: 'Ocurrió un error al actualizar el usuario',
        });
    }


};

const deleteUsuario = async(req, res = response) => {

    // Obtener el id del parametro
    const uid = req.params.id;

    try {

        // Verificar que el usuario existe en la BD por busqueda del id
        const usuarioExiste = await UsuarioI.findById(uid);
        if (!usuarioExiste) {
            return res.json({
                status:false,
                msg: 'El id no se encuentra en la BD',
            });
        }

        // Borrar el usuario de la BD
        await UsuarioI.findByIdAndDelete(uid);


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Usuario borrado correctamente'
        });


    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Error al borrar el usuario'
        })
    }


};





// Export methods
module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
};
