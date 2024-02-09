const express = require("express");
const {authenticate} = require("../authenticator/Authentication");
const {createUser, updateUser, getUser} = require("../controller/userController");
const {createUserApiValidator, updateUserApiValidator,
    getUserApiValidator} = require("../payloadValidators/userValidator/userApiValidator");
const userRouter = express.Router(); 


userRouter.route("/")
.post(createUserApiValidator, createUser)
.all((req, res) => {
    res.status(405).send();
})
.options((req, res) => {
    res.status(405).send();
})
.head((req, res) => {
    res.status(405).send();
});


userRouter.route("/self")
.get(authenticate, getUserApiValidator, getUser)
.put(authenticate, updateUserApiValidator, updateUser)
.all((req, res) => {
    res.status(405).send();
})
.options((req, res) => {
    res.status(405).send();
})
.head((req, res) => {
    res.status(405).send();
});


module.exports = userRouter;