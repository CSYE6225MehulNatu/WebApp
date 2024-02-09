const express = require("express");
const {db, sync} = require("./DbConfig"); 
const userRouter  = require("./routes/UserRoutes");


const app = express();

app.use(express.json());

app.use("/v1/user/", userRouter)

const port = process.env.PORT || 3001;

app.listen(port, () => {
    sync()
    console.log("Listening on port  3001....")
}); 