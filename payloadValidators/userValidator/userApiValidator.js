const {genericValidator, hasBody, hasQueryParam, isEmail} = require("../validatorHelper"); 
const { logger } = require("../../util/Logging");


const createUserApiValidator = async (req, res, next) => {
    const requiredFields = ["first_name", "last_name", "password", "username"];
    if (genericValidator(requiredFields, [], req) != true || hasQueryParam(req)) {
        res.status(400).send();
        return;
    }
    if (!isEmail(req.body["username"])) {
        res.status(400).send();
        return;
    }
    logger.info("CREATE USER VALIDATION COMPLETED : ");
    next();
}


const updateUserApiValidator = async (req, res, next) => {
    const requiredFields = ["first_name", "last_name", "password"];
    if (genericValidator(requiredFields, [], req) != true || hasQueryParam(req)) {
        res.status(400).send();
        return;
    }
    next();
}


const getUserApiValidator = async (req, res, next) => {
    if (hasBody(req) || hasQueryParam(req)) {
        res.status(400).send();
        return;
    }
    next();
}


module.exports = {
    createUserApiValidator,
    updateUserApiValidator,
    getUserApiValidator
}


/*
    req.firstName = req.body["first_Name"];
    req.lastName = req.body["last_Name"];
    req.password = req.body["password"];
    req.username = req.body["username"];
*/