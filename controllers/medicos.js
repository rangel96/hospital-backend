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

const createMedico = async (req, res = response) => {

    // Desestructuracion del body
    const { nombre, hospital } = req.body;
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

        // Verificar si existe un medico con ese nombre
        const existeHospital = await HospitalI.findById(hospital);
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
    const hid  = req.body.hospital;

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
        const { nombre, ...campos } = new MedicoI(req.body);
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


        // Eliminar _id y usuario, agregar el nuevo id de hospital
        delete campos._doc._id;
        delete campos._doc.usuario;
        campos._doc.hospital = hid;


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
    createMedico,
    updateMedico,
    deleteMedico
}
