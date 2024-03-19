const pino = require("pino");
require('dotenv').config();
let tempLogger = null;

const levels = {
    emerg: 80,
    alert: 70,
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
};

if (process.env.LOG_PATH) {
    const fileTransport = pino.transport({
        target: "pino/file",
        options: {
            destination: process.env.LOG_PATH
        }
    })

    tempLogger = pino({
            timestamp: pino.stdTimeFunctions.isoTime,
            //level: process.env.PINO_LOG_LEVEL || 'info',
            formatters: {
                level: (label) => {
                    return { level: label };
                },
            }
        },
        fileTransport);
} else {

    tempLogger = pino({
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => {
                return { level: label };
            },
        }
    }
    );
}

const logger = tempLogger;


module.exports = {
    logger
};
