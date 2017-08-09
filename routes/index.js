var dataController = require('./users.js');

module.exports = function (app) {
    app.get('/',dataController.showHome);
    app.get('/login',dataController.showLogin);
    app.get('/signup',dataController.showSignup);
}