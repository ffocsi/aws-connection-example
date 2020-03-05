# Config
Create a `config.js` file with similar contents:
```javascript
const config = {
    cognito: {
        userPoolId: "<AWS user pool id here>",
        clientId: "<App integration client id here>"
    }
};

module.exports = config;

```