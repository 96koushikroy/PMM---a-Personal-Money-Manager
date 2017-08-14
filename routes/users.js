var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.showHome = function(req, res){
    getBanks(function(res){
        BankList = res;
    });
    res.render('index', { title: 'PMM - a minimalistic Personal Money Manager',pageTitle:'Home'});
};

router.showLogin = function (req, res) {
    res.render('login',{pageTitle:'Login',currentUser: req.user, message: req.flash('loginMessage')});
};

router.showSignup = function (req, res) {
    res.render('signup',{pageTitle:'Sign Up',currentUser: req.user, message: req.flash('signupMessage')});
};

var BankList = [];

function getBanks(cb) {
    db.query('SELECT * From banks', function (error, results, fields) {
        if (error) throw error;
        cb(results);
    });
}

router.showAddBankAdmin = function (req, res) {

    getBanks(function(res){
        BankList = res;
    });
    res.render('addBanks',{pageTitle: 'Admin | Add Bank', data: BankList});

};


router.postAddBankAdmin = function (req, res) {
    var bankName = req.body.bname;
    var data = {
        bankname    : bankName,
    };

    var query = db.query("INSERT INTO banks set ? ",data, function(err, rows)
    {
        if (err)
            console.log("Error inserting : %s ",err );
    });

    res.render('addBanks',{message:'Data Added Successfully!'});

};

router.showMyBanks = function (req, res) {
    res.render('addMyBank',{pageTitle: 'My Banks', bank: BankList});
};



module.exports = router;
