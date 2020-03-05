const express = require("express");
const AccountController = require("../controllers/AccountController");

class AccountRouter {

    static createRouter() {

        const router = express.Router();

        router.get("/signup", AccountController.getSignup);
        router.post("/signup", AccountController.postSignup);

        router.get("/login", AccountController.getLogin);
        router.post("/login", AccountController.postLogin);

        router.get("/change-password", AccountController.getChangePassword);
        router.post("/change-password", AccountController.postChangePassword);

        router.get("/reset-password", AccountController.getResetPassword);
        router.post("/reset-password", AccountController.postResetPassword);

        router.get("/change-email", AccountController.getChangeEmail);
        router.post("/change-email", AccountController.postChangeEmail);

        return router;
    }
}

module.exports = AccountRouter;
