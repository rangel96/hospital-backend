// Import packs installs
const { response } = require('express');

// Import packs creates
const MedicoI = require('../models/medicos');
const HospitalI = require('../models/hospital');

// Methods
const getMedicos = async (req, res = response) => {

    const medicos = await MedicoI.find({}, 'mid nombre img usuario hospital')
                                 .populate('usuario', 'nombre img')
                                 .populate('hospital', 'nombre img');

    const total = await MedicoI.countDocuments();

    res.json({
        status: true,
        msg: 'Lista de medicos',
        data: medicos,
        total
    })

};

const getByIdMedico = async (req, res = response) => {

    // Catch el id de la url y el id del hospital en el body
    const _id = req.params.id;

    try {
        const medico = await MedicoI.findById({ _id }, 'mid nombre img usuario hospital')
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');


        res.json({
            status: true,
            msg: 'Medico obtenido correctamente',
            data: medico,
        })
    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al obtener el medico',
        });
    }



};

const createMedico = async (req, res = response) => {

    // Desestructuracion del body
    const { nombre, hid } = req.body;
    const uid = req.uid;

    try {

        // Verificar si existe un medico con ese nombre
        const existeMedico = await MedicoI.findOne({ nombre });
        if (existeMedico) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Medico ya fue registrado'
            });
        }

        // Verificar si existe un Hospital con ese hid
        const existeHospital = await HospitalI.findById(hid);
        if (!existeHospital) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Hospital no se encuentra en la BD'
            });
        }

        // Guardar medico en la BD
        const medico = new MedicoI({
            usuario: uid,
            hospital: hid,
            ...req.body
        });
        await medico.save();

        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Medico agregado',
            data: medico
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al registrar al medico',
        });
    }

};

const updateMedico = async (req, res = response) => {

    // Catch el id de la url y el id del hospital en el body
    const _id = req.params.id;
    const hid  = req.body.hid;

    try {

        // Verificar si existe un medico con ese id
        const existeMedico = await MedicoI.findById(_id);
        if (!existeMedico) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Medico No esta registrado'
            });
        }

        // Verificar si existe un hospital con ese id
        const existeHospital = await HospitalI.findById({ _id: hid });
        if (!existeHospital) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Hospital No esta registrado'
            });
        }

        // Verificar que el nombre del medico no se repita
        const { nombre, ...campos } = req.body;
        if (existeMedico.nombre !== nombre) {
            // Verificar si el nombre nuevo existe en la BD
            const replyName = await MedicoI.findOne({ nombre });
            if (replyName) {
                // Mensaje de error tipo JSON
                return res.json({
                    status: false,
                    msg: 'Existe un médico con ese nombre'
                });
            }
        }

        campos.hospital = hid;
        delete campos.hid;


        // Actualizar usuario en la BD
        const updateMedico = await MedicoI.findByIdAndUpdate(_id, campos, { new: true });


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Medico actualizado',
            data: updateMedico
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al actualizar al medico',
        });
    }

};

const deleteMedico = async (req, res = response) => {

    // catch de id de la url
    const mid = req.params.id;

    try {

        // Verificar si existe un medico con ese id
        const existeMedico = await MedicoI.findById({ _id: mid });
        if (!existeMedico) {
            // Mensaje de error tipo JSON
            return res.json({
                status: false,
                msg: 'El Medico No esta registrado'
            });
        }

        // Borrar el usuario de la BD
        await MedicoI.findByIdAndDelete(mid);


        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Medico borrado correctamente'
        });

    } catch (e) {
        // Mensajes de error en consola y por JSON
        console.log(e);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al eliminar el medico',
        });
    }

};


// Export methods
module.exports = {
    getMedicos,
    getByIdMedico,
    createMedico,
    updateMedico,
    deleteMedico
}
