// Import packs installs
const { response } = require('express');

// Import packs creates
const HospitalI = require('../models/hospital');

// Methods
const getHospitales = async(req, res = response) => {

    const hospitales = await HospitalI
        .find({}, 'uid nombre img usuario')
        .populate('usuario', 'nombre img');

    const total = await HospitalI.countDocuments();

    res.json({
        status: true,
        msg: 'Lista de hospitales',
        data: hospitales,
        total
    })

};

const createHospital = async(req, res = response) => {

    // Desestructuracion del body
    const { nombre } = req.body;
    const uid = req.uid;

    try {

        // Verificar si existe un hospital con ese nombre
        const existeHospital = await HospitalI.findOne({ nombre });
        if (existeHospital) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Hospital ya fue registrado'
            });
        }

        // Guardar hospital en la BD
        const hospital = new HospitalI({
            usuario: uid,
            ...req.body
        });
        await hospital.save();

        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Hospital agregado',
            data: hospital
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al registrar al hospital',
        });
    }
};

const updateHospital = async(req, res = response) => {

    // Catch el id de la url
    const { hid } = req.params.id;

    try {

        // Verificar si existe un hospital con ese nombre
        const existeHospital = await HospitalI.findById({ _id: hid });
        if (!existeHospital) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Hospital No esta registrado'
            });
        }

        // Verificar que el nombre del hospital no se repita
        const { nombre, ...campos } = new HospitalI(req.body);
        if (existeHospital.nombre !== nombre) {
            // Verificar si el nombre nuevo existe en la BD
            const replyName = await HospitalI.findOne({ nombre });
            if (replyName) {
                // Mensaje de error tipo JSON
                return res.json({
                    status: false,
                    msg: 'Existe un registro con ese nombre'
                });
            }
        }

        // Eliminar _id, password y google del objeto campos
        delete campos._doc._id;
        delete campos._doc.usuario;

        // Actualizar usuario en la BD
        const updateHospital = await HospitalI.findByIdAndUpdate(hid, campos, { new: true });


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Hospital actualizado',
            data: updateHospital
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al registrar al hospital',
        });
    }

};

const deleteHospital = async(req, res = response) => {

    // catch de id de la url
    const hid = req.params.id;

    try {

        // Verificar si existe un hospital con ese id
        const existeHospital = await HospitalI.findById({ hid });
        if (!existeHospital) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Hospital No esta registrado'
            });
        }

        // Borrar el usuario de la BD
        await HospitalI.findByIdAndDelete(hid);


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Hospital borrado correctamente'
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al eliminar el hospital',
        });
    }

};

// Export methods
module.exports = {
    getHospitales,
    createHospital,
    updateHospital,
    deleteHospital
}
