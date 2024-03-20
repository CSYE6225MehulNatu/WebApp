const bcrypt = require("bcrypt");
const atob = require("atob");
const {UserModel} = require("../DbConfig");
const { logger } = require("../util/Logging");
const { message } = require("statuses");

const basicAuth = async (req, res, next) => {

    
}


const authenticate = async (req, res, next) => {
    try {

        const encodedString = req.headers.authorization;
        //console.log(req.headers.authorization);

        const decodedCredentials = atob(encodedString.split(" ")[1]);
    
        const [username, password] = decodedCredentials.split(":");

        const fetchedUser = await UserModel.findOne({where : { email: username }});

        if (!fetchedUser) {
            logger.error({statusCode: 401, message: "no fetched user present", username: username});
            res.status(401).send();
            return;
        }

        const passwordMatch = await bcrypt.compare(password, fetchedUser.password);

        if (!passwordMatch) {
            logger.error({statusCode: 401, message: "password match failed", username: username});
            res.status(401).send();
            return;
        }
        req.decipheredEmail = username;
        req.userModel = fetchedUser;
        logger.info("User successfully Authenticated: " + username);
        next();
    } catch (err) {
        logger.error("Error while authenticating: " + err);
        res.status(401).send();
        return;
    }
    
};

module.exports = {
    authenticate
};
