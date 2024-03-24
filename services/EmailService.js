const { EmailVModel } = require("../DbConfig");
const { logger } = require("../util/Logging");
const Constants = require("../util/Constants");
const { publishMessage } = require("./PubService");


async function isEmailVerified(email) {
    if (process.env.ENV === undefined || process.env.ENV != Constants.prodEnv) {
        return;
    }
    logger.info("checking if email is verified or not : " + email);
    const result = await EmailVModel.findOne({where: {email: email}, order:[["verification_link_creation_time", "DESC"]]});
    return result.status === Constants.emailVerified;
}

async function sendEmailForVerification(email) {
    if (process.env.ENV === undefined || process.env.ENV != Constants.prodEnv) {
        return;
    }
    logger.info("Sending mail for email verification : " + email);
    publishMessage(Constants.emailVerificationTopic, email);
}


module.export = {
    isEmailVerified,
    sendEmailForVerification
}