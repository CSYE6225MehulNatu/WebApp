//const User = require("../models/user");
const bcrypt = require("bcrypt");
const atob = require("atob");
const {UserModel} = require("../DbConfig");
//const decodedString = buffer.from(encodedString, 'base64').toString();

const basicAuth = async (req, res, next) => {

    
}


const authenticate = async (req, res, next) => {
    try {

        const encodedString = req.headers.authorization;
        console.log(req.headers.authorization);

        const decodedCredentials = atob(encodedString.split(" ")[1]);
    
        const [username, password] = decodedCredentials.split(":");

        const fetchedUser = await UserModel.findOne({where : { email: username }});

        if (!fetchedUser) {
            console.log("In here")
            res.status(401).send();
            return;
        }

        const passwordMatch = await bcrypt.compare(password, fetchedUser.password);

        if (!passwordMatch) {
            res.status(401).send();
            return;
        }
        req.decipheredEmail = username;
        req.userModel = fetchedUser;
        next();
    } catch (err) {
        console.log("Error while authenticating: " + err);
        res.status(401).send();
        return;
    }
    
};

module.exports = {
    authenticate
};
