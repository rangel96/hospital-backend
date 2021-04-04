// Import packs
const jwt = require('jsonwebtoken');


const generateJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {

            // Si hay un error al generar el token
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            }

            // Retorna el token generado
            resolve(token);

        });
    });

}

module.exports = {
    generateJWT
}
