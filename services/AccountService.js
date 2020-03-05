const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const config = require("../config");
const async = require("async");

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.clientId
});

class AccountService {

    static signUp(email, password) {

        return new Promise((resolve, reject) => {

            const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "email",
                Value: email
            });

            return userPool.signUp(email, password, [emailAttribute], undefined, (error, data) => {

                if (error) {
                    console.error(error);
                    return reject(error);
                }

                return resolve(data.user);
            });
        });
    }

    static logIn(email, password) {

        return new Promise((resolve, reject) => {

            const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password
            });

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });

            return cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: data => {

                    console.log(data);

                    return resolve(data);
                },
                onFailure: error => {

                    console.error(error);

                    return reject(error);
                }
            });
        });
    }

    static changePassword(username, oldPassword, newPassword) {

        return new Promise((resolve, reject) => {

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: username,
                Pool: userPool
            });

            return async.waterfall([
                cognitoUser.getSession.bind(cognitoUser),
                (session, next) => {
                    if (!session.isValid()) {
                        return next("Session is invalid");
                    }

                    return next();
                },
                cognitoUser.changePassword.bind(cognitoUser, oldPassword, newPassword)
            ], (error, data) => {

                if (error) {

                    console.error(error);

                    return reject(error);
                }

                console.log(data);

                return resolve(data);
            });
        });
    }

    static startResetPassword(email) {

        return new Promise((resolve, reject) => {

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });

            return cognitoUser.forgotPassword({
                onSuccess: data => {

                    console.log(data);

                    return resolve(data);
                },
                onFailure: error => {

                    console.error(error);

                    return reject(error);
                }
            });
        });
    }

    static confirmResetPassword(email, code, newPassword) {

        return new Promise((resolve, reject) => {

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });

            return cognitoUser.confirmPassword(code, newPassword, {
                onSuccess: data => {

                    console.log(data);

                    return resolve(data);
                },
                onFailure: error => {

                    console.error(error);

                    return reject(error);
                }
            });
        });
    }

    static changeEmail(oldEmail, password, newEmail) {

        return new Promise((resolve, reject) => {

            const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: oldEmail,
                Password: password
            });

            const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: oldEmail,
                Pool: userPool
            });

            const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "email",
                Value: newEmail
            });

            return async.series([
                next => cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: () => next(),
                    onFailure: next
                }),
                cognitoUser.updateAttributes.bind(cognitoUser, [emailAttribute]),
                next => cognitoUser.globalSignOut({
                    onSuccess: () => next(),
                    onFailure: next
                })
            ], error => {

                if (error) {

                    console.error(error);

                    return reject(error);
                }

                return resolve();
            });

        });
    }
}

module.exports = AccountService;
