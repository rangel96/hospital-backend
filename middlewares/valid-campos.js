const { response } = require('express');
const { validationResult } = require("express-validator");


const validCampos = (req, res = response, next) => {

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.json({
            status: false,
            Errors: errores.mapped()
        })
    }

    next();
};

module.exports = { validCampos };
