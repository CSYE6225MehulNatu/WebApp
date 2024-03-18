const pino = require("pino");
const fileTransport = pino.transport({
    target: "pino/file",
    options: {
        destination: "/webapp/webapp.log"
    }
})

const logger = pino({
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    fileTransport
    );


module.exports = {
    logger
};