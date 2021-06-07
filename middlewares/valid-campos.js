const { response } = require('express');
const { validationResult } = require("express-validator");


const validCampos = (req, res = response, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.json({
            status: false,
            msg: 'Tienes campos por llenar o revisa que sean válidos',
            errors: errores.mapped()
        })
    }

    next();
};

module.exports = { validCampos };
