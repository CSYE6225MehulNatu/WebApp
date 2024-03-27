const userService = require("../services/UserService");
const { sendEmailForVerification, isEmailVerified, saveEmailVerificationStatus, 
    getEmailVerificationObject } = require("../services/EmailService");
const { publishMessage } = require("../services/PubService")
const { logger } = require("../util/Logging");
const { emailVerificationFailed, emailVerified, emailVerificationPending } = require("../util/Constants");



const createUser = async (req, resp, next) => {
    const email = req.body["username"];
    const firstName = req.body["first_name"];
    const lastName = req.body["last_name"];
    const password = req.body["password"];
    try {
        const isPresent = await userService.doesUserExist(email);

        if (isPresent) {
            logger.error("User already exists : " + email.toString());
            resp.status(400).send();
            return;
        }

        userService.createUser(firstName, lastName, email, password).then(result => {
            resp.status(201).send(filterFields(result.toJSON()));
        });

        sendEmailForVerification(email);
        //saveEmailVerificationStatus(email, "pending");

    } catch (err) {
        logger.error("Error while creatiung a new user " + err);
        resp.status(500).send();
    }
}

const updateUser = async (req, resp, next) => {
    //get Email from the token
    const email = req.decipheredEmail;
    logger.debug("Deciphere email: " + email);
    try {

        const emailVerificationDone = await isEmailVerified(email);
        if (!emailVerificationDone) {
            resp.status(400).send();
            return;
        }

        const isPresent = await userService.doesUserExist(email);

        if (!isPresent) {
            resp.status(400).send();
            return;
        }

        const firstName = req.body["first_name"];
        const lastName = req.body["last_name"];
        const password = req.body["password"];

        userService.updateUser(firstName, lastName, email, password).then(result => {
            resp.status(204).send();
        })

    } catch (err) {
        logger.error("Error while updatying user " + err);
        resp.status(500).send();
    }
}

const getUser = async (req, resp, next) => {
    const email = req.decipheredEmail;
    const emailVerificationDone = await isEmailVerified(email);
    if (!emailVerificationDone) {
        resp.status(400).send();
        return;
    }
    const result = await userService.doesUserExistIfSoGetUser(email);
    if (result[0]) {
        const filterFiledUser = filterFields(result[1].toJSON());
        logger.info("User fetched for email: " + email);
        resp.status(200).send(filterFiledUser);
        return;
    } else {
        resp.status(400).send();
        return;
    }
}

const verifyEmailForUser = async (req, resp, next) => {
    try {
        const currTimeMilliseconds = Date.now();
        //const normalString = atob(req.query.code).substring(1, str.length - 1);

        const emailVerificationObject = await getEmailVerificationObject(req.query.code);

        if (emailVerificationObject === undefined) {
            logger.info("No such object found for given code : " + req.query.code);
            resp.status(400).send("{\"message\" : \"Not able to verify\"}");
            return;
        }

        //logger.info("No such object found for given code :" + new Date(emailVerificationObject["verification_link_creation_time"]).getTime);
        const createdTime = emailVerificationObject["verification_link_creation_time"].getTime();
        logger.info("value of created time : " + createdTime);

        if (emailVerificationObject["status"] === emailVerificationPending) {
            if (createdTime + 2 * 60000 >= currTimeMilliseconds) {
                logger.info("Updating Status to verified");
                emailVerificationObject.update({"status" : emailVerified});
                resp.status(200).send("{\"message\" : \"Verified\"}");
            } else {
                logger.info("Updating Status to failed");
                await emailVerificationObject.update({"status" : emailVerificationFailed});
                resp.status(400).send("{\"message\" : \"Verification time is over\"}");
                return;
            }
        } else {
            resp.status(400).send("{\"message\" : \"Already used link\"}");
        }
        return;

    } catch (err) {
        logger.error("Error while verification of email link : " + err);
        resp.status(400).send("{\"message\" : \"Not able to verify\"}");
    }
}



function filterFields(data) {
    const fieldsToRemove = ["password"]
    const keysToRename = {"email" : "username"}
    const newData = {};
  
    for (const key in data) {
      if (!fieldsToRemove.includes(key)) {
        const newKey = keysToRename[key] || key;
        newData[newKey] = data[key];
      }
    }
  
    return newData;
}


module.exports = {
    createUser, 
    updateUser,
    getUser,
    verifyEmailForUser
}