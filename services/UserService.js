const { UserModel } = require("../DbConfig")
const { logger } = require("../util/Logging");


async function createUser(firstName, lastName, emailToBeSaved, password) {
    console.log("up above");
    const userExist = await doesUserExistIfSoGetUser(emailToBeSaved);
    
    if (!userExist[0]) {
        //console.log("In here2 + " + User);
        const newUser = await UserModel.create({"firstname" : firstName, "lastname" : lastName, "email" : emailToBeSaved, 
        "password" : password
        });
        //console.log("In here");
        logger.info("Created User successfully : " + emailToBeSaved.toString());
        return newUser;
    } else {
        logger.info("User already exists : " + emailToBeSaved.toString());
    }
}

async function updateUser(firstName, lastName, email, password) {
    const userExist = await doesUserExistIfSoGetUser(email);
    if (userExist[0]) {
        const result = userExist[1].update({"firstname" : firstName, "lastname" : lastName, "password" : password});
        logger.info("Updated User successfully : " + email);
        return result;
    } else {
        //throw exception that user does not exist
    }
}

async function getUser(email, password) {
    const userExist = await doesUserExistIfSoGetUserMetaData(email);
    if (userExist[0]) {
        logger.info("for fetching user - " + userExist[1]);
        return {"First Name" : userExist[1].firstname, "Last Name" : userExist[1].lastname, "Email" : userExist[1].email};
    } else {
        //throw exception that user does not exist
    }
}

async function doesUserExistIfSoGetUser(emailToCheck) {
    
    const result = await UserModel.findOne({where: {email: emailToCheck}});
    if (result === null) {
        return [false,  null]; 
    } else {
        return [true, result];
    }
}

async function doesUserExistIfSoGetUserMetaData(emailToCheck) {
    
    const result = await UserModel.findOne({where: {email: emailToCheck}, attributes : {exclude: ["id", "password"]}});
    if (result === null) {
        return [false,  null]; 
    } else {
        return [true, result];
    }
}

async function doesUserExist(emailToCheck) {

    const result = await UserModel.findOne({where: {email: emailToCheck}});
    if (result === null) {
        return false; 
    } else {
        return true;
    }
}




module.exports = {
    createUser,
    updateUser,
    getUser,
    doesUserExist,
    doesUserExistIfSoGetUser
  };
