// Import packs installs
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Import packs creates
const UsuarioI = require('../models/usuario');
const HospitalI = require('../models/hospital');
const MedicoI = require('../models/medicos');



// Módulos a exportar
const imgUpload = async(tipo, _id, path, nameFile) => {

    let data;
    let pathOld;

    switch (tipo) {
        case 'usuarios':
            // Busqueda de la palabra en la BD
            data = await UsuarioI.findById({ _id });
            pathOld = `${ path }/${ data.img }`;
            await saveFile(data, nameFile, pathOld);
            break;

        case 'hospitales':
            // Busqueda de la palabra en la BD
            data = await HospitalI.findById({ _id });
            pathOld = `${ path }/${ data.img }`;
            await saveFile(data, nameFile, pathOld);
            break;

        case 'medicos':
            // Busqueda de la palabra en la BD
            data = await MedicoI.findById({ _id });
            pathOld = `${ path }/${ data.img }`;
            await saveFile(data, nameFile, pathOld);
            break;

        default:
            console.log('Tabla no reconocida');
            return false;
    }


}

const imgCloudinary = async(tipo, _id, url = '') => {

    let data;

    switch (tipo) {
        case 'usuarios':
            // Búsqueda de la palabra en la BD
            data = await UsuarioI.findById({ _id });

            // Borrar img en Cloudinary y actualizar img en BD
            return await saveCloudinary(data, url);
            break;

        case 'hospitales':
            // Búsqueda de la palabra en la BD
            data = await HospitalI.findById({ _id });

            // Borrar img en Cloudinary y actualizar img en BD
            return await saveCloudinary(data, url);
            break;

        case 'medicos':
            // Búsqueda de la palabra en la BD
            data = await MedicoI.findById({ _id });

            // Borrar img en Cloudinary y actualizar img en BD
            return await saveCloudinary(data, url);
            break;

        default:
            console.log('Tabla no reconocida');
            return false;
    }


}



// Funciones
async function saveFile(data, nameFile, pathOld) {

    // Verificar que exista algo en 'data'
    if (!data) {
        console.log('No se encontró ninguna coincidencia por id');
        return false;
    }

    // Verificar si hay una imagen almacenada
    if (fs.existsSync(pathOld)) {
        // Borrar la imagen anterior
        fs.unlinkSync(pathOld);
    }

    data.img = nameFile;
    await data.save();
    return true;

}

async function saveCloudinary(data, url) {
    // Verificar que exista algo en 'data'
    if (!data) {
        console.log('No se encontró ninguna coincidencia por id');
        return false;
    }

    // Si no hay archivo, guardalo directo en la BD
    if (!data.img) {
        data.img = url;
        await data.save();
        return true;
    }


    // Extraer el public_id de data.img
    let public_id = data.img.split('/')
    public_id = public_id[public_id.length -1];
    public_id = public_id.split('.');
    public_id = public_id[0];


    // Elimina el url viejo en Cloudinary
    await cloudinary.uploader.destroy(public_id);


    // Guardar el url nuevo en BD
    data.img = url;
    await data.save();

    return true;
}



module.exports = {
    imgUpload,
    imgCloudinary
}
