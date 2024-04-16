const express = require("express");
const {db, sync} = require("./DbConfig"); 
const userRouter  = require("./routes/UserRoutes");
const utilRouter = require("./routes/UtilRoutes");
const { logger } = require("./util/Logging");
const {emailVerified, emailVerificationPending, emailVerificationFailed} = require("./util/Constants")


const app = express();

app.use(express.json());

app.use("/v8/user/", userRouter);
app.use("/", utilRouter);

const port = process.env.PORT || 3001;


const server = app.listen(port, async() => {
    await sync();
    logger.info("Listening on port  3001....");
}); 



module.exports = {app, server};
