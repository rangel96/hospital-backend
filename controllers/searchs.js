// Import packs installs
const { response } = require('express');

// Import packs creates
const UsuarioI = require('../models/usuario');
const HospitalI = require('../models/hospital');
const MedicoI = require('../models/medicos');


// Methods
const findAll = async (req, res = response) => {

    // Catch 'name' de params
    const name = req.params.name;

    // Convertir la palabra en una Expresión Regular flexible para la busqueda
    const nombre = new RegExp(name, 'i');


    try {

        // Busqueda de la palabra en la BD
        const [usuarios, hospitales, medicos] = await Promise.all([

            UsuarioI.find({ nombre }),
            HospitalI.find({ nombre }),
            MedicoI.find({ nombre })

        ]);

        // Numero de resultados
        const total = usuarios.length + hospitales.length + medicos.length;

        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: 'Usuario encontrado',
            data: { usuarios, hospitales, medicos },
            total
        });


    } catch (err) {
        // Mensajes de error en consola y por JSON
        console.log(err);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al buscar al usuario',
        });
    }


};

const findColection = async (req, res = response) => {

    // Catch params 'tabla' y 'busqueda'
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;

    // Convertir la palabra en una Expresión Regular flexible para la busqueda
    const nombre = new RegExp(busqueda, 'i');

    // Declaracion de varible data
    let data = [];

    try {

        switch (tabla) {
            case 'usuarios':
                // Busqueda de la palabra en la BD
                data = await UsuarioI.find({ nombre });
                break;

            case 'hospitales':
                // Busqueda de la palabra en la BD
                data = await HospitalI.find({ nombre })
                    .populate('usuario', 'nombre img');
                break;

            case 'medicos':
                // Busqueda de la palabra en la BD
                data = await MedicoI.find({ nombre })
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img');
                break;

            default:
                return res.json({
                    status: false,
                    message: 'Tabla no reconocida'
                });
        }

        // Numero de resultados
        // console.log(data.length)
        const total = data.length;

        // Mensaje tipo JSON
        res.json({
            status: true,
            msg: `Resultados de la busqueda: ${ busqueda } en la tabla: ${ tabla }`,
            data,
            total
        });


    } catch (err) {
        // Mensajes de error en consola y por JSON
        console.log(err);
        return res.json({
            status: false,
            msg: 'Ocurrió un error al realizar la busqueda entre tablas',
        });
    }

};



// Export methods
module.exports = {
    findAll,
    findColection
};
