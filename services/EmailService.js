const { EmailVModel } = require("../DbConfig");
const { logger } = require("../util/Logging");
const Constants = require("../util/Constants");
const { publishMessage } = require("./PubService");


async function isEmailVerified(email) {
    if (process.env.ENV === undefined || process.env.ENV != Constants.prodEnv) {
        logger.info("Values for not sending message" + (process.env.ENV === undefined) + " " + (process.env.ENV != Constants.prodEnv));
        return true;
    }
    logger.info("checking if email is verified or not : " + email);
    const result = await EmailVModel.findOne({where: {email: email}, order:[["verification_link_creation_time", "DESC"]]});

    return result != null && result.status === Constants.emailVerified;
}

async function sendEmailForVerification(email) {
    if (process.env.ENV === undefined || process.env.ENV != Constants.prodEnv) {
        logger.info("Values for not sending message" + (process.env.ENV === undefined) + " " + (process.env.ENV != Constants.prodEnv));
        return;
    }
    logger.info("Sending mail for email verification : " + email);
    publishMessage(Constants.emailVerificationTopic, email);
}

const saveEmailVerificationStatus = async (email, verficationStatus) => {
    try {
        const uniqueValue = "LOLOLOLO";
        const emailVerificationData = await EmailVModel.create({email: email, status: verficationStatus, 
            verificationCode: uniqueValue
        });
        logger.info("Saved jane object : " + emailVerificationData.toString());
    } catch (err) {
        logger.error("Error while saving : " + email + " : " + verficationStatus);
        throw err;
    }
}


const getEmailVerificationObject = async (verficationCodeValue) => {
    try {
        const emailVerificationData = await EmailVModel.findOne({where: {verificationCode: verficationCodeValue}});
        logger.info("fetched email verification Object : " + emailVerificationData.toJSON());
        return emailVerificationData;
    } catch (err) {
        logger.error("Error while saving : " + email + " : " + verficationStatus);
        throw err;
    }
}

module.exports = {
    isEmailVerified,
    sendEmailForVerification,
    saveEmailVerificationStatus,
    getEmailVerificationObject
}