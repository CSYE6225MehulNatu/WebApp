const express = require("express");
const userService = require("./services/UserService");
const db = require("./DbConfig"); 

const app = express();

app.use((req, res, next) => {

    console.log("URL : " + req.url);
    const val = req.headers["content-type"];
    console.log("body : " + val);
    console.log("Query Param size : " + Object.keys(req.query).length);

    if (req.method != 'GET' && req.url.startsWith('/healthz')) {
        return res.status(405).send();
    }

    if (req.method === 'GET' && req.url.startsWith('/healthz') && (req.headers["content-type"] || Object.keys(req.query).length != 0)) {
        console.log("body : " + req.body);
        console.log("Query Param size : " + Object.keys(req.query).length);
        return res.status(400).send();
    }

    next();
  });

app.get('/healthz', (req, res) => {
    try {
        db
        .authenticate()
        .then(() => {
            console.log('Database connection successful!');
            res.status(200).setHeader("cache-control", "no-cache").send();
        }).catch((err) => {
            console.error('Unable to connect to the database:', err);
            res.status(503).setHeader("cache-control", "no-cache").send();
        });
      } catch (error) {
        console.error("Health check failed:", error);
        res.status(503).setHeader("cache-control", "no-cache").send();
      }
});

app.get('/test', (req, res) => {
    try {
        const result = userService.createUser("mehul", "natu", "email", "lolyekyahai");
        result
        .then(result => {
            console.log(result);
            res.status(200).send(result);})
        .catch(error => {
            console.error("testing error:", error);
            res.status(503).send();
        });

        //res.status(200).send();
      } catch (error) {
        console.error("testing error:", error);
        res.status(503).send();
      }
});


const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on port  3001...."));