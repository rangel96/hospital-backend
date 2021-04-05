const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true,
    }
}, {
    // Personalizar el nombre de la tabla en la bd
    collection: 'hospitales'
});

HospitalSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.hid = _id;
    return object;
});

module.exports = model('Hospital', HospitalSchema);
