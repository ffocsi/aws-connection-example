const AccountService = require("../services/AccountService");

class AccountController {

    static getSignup(_request, response) {
        return response.render("account/signup");
    }

    static async postSignup(request, response) {

        const { email, password, confirmPassword } = request.body;

        if (password !== confirmPassword) {
            return response.render("account/signup");
        }

        try {

            const user = await AccountService.signUp(email, password);

            return response.send(user);

        }
        catch (error) {
            return response.send(error);
        }
    }

    static getLogin(_request, response) {
        return response.render("account/login");
    }

    static async postLogin(request, response) {

        const { email, password } = request.body;

        try {
            const data = await AccountService.logIn(email, password);

            request.session.sub = data.idToken.payload.sub;

            return response.redirect("/");

        } catch (error) {
            return response.render("account/login");
        }
    }

    static getChangePassword(request, response) {

        if (!request.session.sub) {
            return response.redirect("/account/login");
        }

        return response.render("account/change-password");
    }

    static async postChangePassword(request, response) {

        const { password, confirmPassword, oldPassword } = request.body;

        if (password !== confirmPassword) {
            return response.render("account/change-password");
        }

        try {

            await AccountService.changePassword(request.session.sub, oldPassword, password);

            return response.redirect("/");

        } catch (error) {
            return response.redirect("/account/change-password");
        }
    }

    static getResetPassword(request, response) {

        return response.render("account/reset-password", {
            status: request.session["reset-password-status"],
            message: request.session["reset-password-message"]
        });
    }

    static async postResetPassword(request, response) {

        if (request.body.email) {

            try {

                const data = await AccountService.startResetPassword(request.body.email);

                request.session["reset-password-email"] = request.body.email;
                request.session["reset-password-status"] = "Email Sent";
                request.session["reset-password-message"] = `Check your email at ${data.CodeDeliveryDetails.Destination}`;

                return response.redirect("/account/reset-password");

            } catch (error) {

                return response.redirect("/account/reset-password");
            }

        } else {

            try {

                await AccountService.confirmResetPassword(request.session["reset-password-email"], request.body.code, request.body.password);

                return response.redirect("/account/login");

            } catch (error) {

                return response.redirect("/account/reset-password");
            }
        }
    }

    static getChangeEmail(_request, response) {
        return response.render("account/change-email");
    }

    static async postChangeEmail(request, response) {

        try {

            await AccountService.changeEmail(request.body.oldEmail, request.body.password, request.body.email);

            return response.redirect("/account/login");

        } catch (error) {

            return response.redirect("/account/login");
        }
    }
}

module.exports = AccountController;
