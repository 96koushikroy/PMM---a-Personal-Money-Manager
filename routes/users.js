var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.showHome = function(req, res){
    /*db.query('SELECT * From student', function (error, results, fields) {
        if (error) throw error;
        res.render('index', { title: 'PMM - a minimalistic Personal Money Manager',data:results });
    });*/

    res.render('index', { title: 'PMM - a minimalistic Personal Money Manager',pageTitle:'Home', currentUser: req.user});
};

router.showLogin = function (req, res) {
    res.render('login',{pageTitle:'Login',currentUser: req.user});
};

router.showSignup = function (req, res) {
    res.render('signup',{pageTitle:'Sign Up',currentUser: req.user});
};


module.exports = router;
