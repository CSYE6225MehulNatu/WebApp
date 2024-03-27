const {genericValidator, hasBody, hasQueryParam, isEmail} = require("../validatorHelper"); 
const { logger } = require("../../util/Logging");


const createUserApiValidator = async (req, res, next) => {
    const requiredFields = ["first_name", "last_name", "password", "username"];
    if (genericValidator(requiredFields, [], req) != true || hasQueryParam(req)) {
        res.status(400).send();
        return;
    }
    if (!isEmail(req.body["username"])) {
        logger.error("Not a valid email : " + req.body["username"]);
        res.status(400).send();
        return;
    }
    //req.decipheredEmail = req.body["username"];
    logger.info("create user validation completed");
    next();
}


const updateUserApiValidator = async (req, res, next) => {
    const requiredFields = ["first_name", "last_name", "password"];
    if (genericValidator(requiredFields, [], req) != true || hasQueryParam(req)) {
        logger.error("Field validation failed for user updation");
        res.status(400).send();
        return;
    }
    next();
}


const getUserApiValidator = async (req, res, next) => {
    if (hasBody(req) || hasQueryParam(req)) {
        logger.error("Field validation failed for user get");
        res.status(400).send();
        return;
    }
    next();
}

const isEmailVerified = async (req, res, next) => {
    try {
        const email = req.decipheredEmail;
        

    } catch(error) {
        logger.error("Error while checking if email is valid")
    }
}


const checkQueryParamCode = (req, res, next) => {
    const codeParam = req.query.code;
    if (codeParam) {
      logger.info("Query parameter 'code' is present:", codeParam);
      next(); // Proceed to the next middleware
    } else {
      logger.error("Query parameter 'code' is not present:");
      res.status(400).send();
    }
  };


module.exports = {
    createUserApiValidator,
    updateUserApiValidator,
    getUserApiValidator,
    checkQueryParamCode
}


/*
    req.firstName = req.body["first_Name"];
    req.lastName = req.body["last_Name"];
    req.password = req.body["password"];
    req.username = req.body["username"];
*/