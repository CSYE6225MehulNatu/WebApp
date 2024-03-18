const {db} = require("../DbConfig");
const { logger } = require("../util/Logging");



const isDbConnecting = async (req, resp, next) => {
    try {
        db
        .authenticate()
        .then(() => {
            logger.debug('Database connection successful!');
            resp.status(200).setHeader("cache-control", "no-cache").send();
        }).catch((err) => {
            logger.error('Unable to connect to the database:', err);
            resp.status(503).setHeader("cache-control", "no-cache").send();
        });
    } catch (error) {
        logger.error("Health check failed:", error);
        resp.status(503).setHeader("cache-control", "no-cache").send();
    }
}

module.exports = {
    isDbConnecting
}