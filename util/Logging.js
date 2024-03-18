const pino = require("pino");
require('dotenv').config();
let tempLogger = null;

if (process.env.LOG_PATH) {
    const fileTransport = pino.transport({
        target: "pino/file",
        options: {
            destination: process.env.LOG_PATH
        }
    })

    tempLogger = pino({
            timestamp: pino.stdTimeFunctions.isoTime,
        },
        fileTransport
        );
} else {

    tempLogger = pino({
        timestamp: pino.stdTimeFunctions.isoTime,
    }
    );
}

const logger = tempLogger;


module.exports = {
    logger
};