const { logger } = require("../util/Logging");

function genericValidator(requiredParameters, optionalParameters, req) {
    const errors = {};

    requiredParameters.forEach((param) => {
        if (!req.body[param]) {
            errors[param] = 'Required parameter is missing.';
        }
    });

    //is this really needed?
    optionalParameters.forEach((param) => {
        if (req.body[param]) {
        }
    });

    if (Object.keys(errors).length > 0) {
        return { errors: errors };
    } else {
        return true;
    }
}


function hasQueryParam(req) {
    if (Object.keys(req.query).length != 0) {
        return true;
    }
    return false;
}


function hasBody(req) {
    if (req.headers["content-type"]) {
        return true;
    }
    return false;
}

const genericNoBodyNoParamValidator = async (req, res, next) => {
    if (hasBody(req) || hasQueryParam(req)) {
        logger.error("Generic no body or param validation failed");
        res.status(400).send();
        return;
    }
    next();
}




const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


function isEmail(userName) {
    return emailRegex.test(userName);
}


module.exports = {
    genericValidator,
    hasQueryParam,
    hasBody,
    isEmail,
    genericNoBodyNoParamValidator
};