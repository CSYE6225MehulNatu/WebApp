const userService = require("../services/UserService");
const { sendEmailForVerification } = require("../services/EmailService");
const { publishMessage } = require("../services/PubService")
const { logger } = require("../util/Logging");



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
    getUser
}