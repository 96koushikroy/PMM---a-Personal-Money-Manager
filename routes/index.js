var dataController = require('./users.js');

module.exports = function (app,passport) {


    app.get('/',dataController.showHome);
    app.get('/login',dataController.showLogin);
    app.get('/signup',dataController.showSignup);


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin/addbank',dataController.showAddBankAdmin);
    app.post('/admin/addbank',dataController.postAddBankAdmin);

    app.get('/mybanks',isLoggedIn,dataController.showMyBanks);
};


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}