const mongoose = require('mongoose');

// Variable a exportar de la cadena de conexión
const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Mensaje de Connection con la BD establecida
        console.log('DB Online')
    } catch (e) {
        console.log(e);
        throw new Error(`Error al iniciar la BD, favor de leer el/los LOG's`);
    }



    const Cat = mongoose.model('Cat', {
        name: String
    });
};

module.exports = {
    dbConnection
}
