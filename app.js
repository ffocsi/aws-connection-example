const express = require("express");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const AccountRouter = require("./routers/AccountRouter");

global.fetch = require("node-fetch");

const app = express();

app.set("view engine", "pug");

app.use(expressSession({
    secret: "change this",
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", (_request, response) => response.render("index"));

app.use("/account", AccountRouter.createRouter());

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});
