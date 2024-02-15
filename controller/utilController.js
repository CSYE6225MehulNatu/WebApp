const {db} = require("../DbConfig");


const isDbConnecting = async (req, resp, next) => {
    try {
        db
        .authenticate()
        .then(() => {
            console.log('Database connection successful!');
            resp.status(200).setHeader("cache-control", "no-cache").send();
        }).catch((err) => {
            console.error('Unable to connect to the database:', err);
            resp.status(503).setHeader("cache-control", "no-cache").send();
        });
    } catch (error) {
        console.error("Health check failed:", error);
        resp.status(503).setHeader("cache-control", "no-cache").send();
    }
}

module.exports = {
    isDbConnecting
}