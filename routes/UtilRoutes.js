const express = require("express");
const { genericNoBodyNoParamValidator } = require("../payloadValidators/validatorHelper");
const { isDbConnecting } = require("../controller/utilController");


const utilRouter = express.Router(); 


utilRouter.route("/healthz")
.get(genericNoBodyNoParamValidator, isDbConnecting)
.all((req, res) => {
    res.status(405).send();
}).options((req, res) => {
    res.status(405).send();
})
.head((req, res) => {
    res.status(405).send();
});

module.exports = utilRouter;