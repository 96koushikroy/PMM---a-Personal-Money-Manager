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
    var uid = req.user.id;
    db.query('select * from banks where id not in (select bid from mybanks where uid = ?); select my.bid,my.currentbalance,b.bankname from mybanks my join banks b on b.id = my.bid where my.uid = ?',[uid,uid], function (error, results, fields) {
        if (error) throw error;
        res.render('addMyBank',{pageTitle: 'My Banks', bank: results[0],myBank:results[1],message: req.flash('message')});
    });
    //res.render('addMyBank',{pageTitle: 'My Banks', bank: BankList});
};


router.addMyBanks = function (req, res) {

    var uid = req.user.id;
    var amount = req.body.balance;
    var bid = req.body.bank;


    db.query('INSERT INTO mybanks values (?,?,?);',[uid,bid,amount], function (error, results, fields) {
        if (error) throw error;//res.render('addMyBank',{pageTitle: 'My Banks',message:error});
        req.flash('message', 'Your Bank was Added Successfully!');
        res.redirect('/mybanks');
    });




};

router.deleteMyBanks = function (req, res) {
    var uid = req.user.id;
    var bid = req.params.bid;
    db.query('delete from mybanks where uid = ? and bid = ?;',[uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        req.flash('message', 'Your Bank was Deleted Successfully!');
        res.redirect('/mybanks');

        //else res.render('addMyBank',{pageTitle: 'My Banks', bank: results[0],myBank:results[1],message:'Your Bank Added Successfully!'});
    });
};

router.processDeposit = function (req, res) {
    var uid = req.user.id;

    /*db.query('select my.bid,my.currentbalance,b.bankname from mybanks my join banks b on b.id = my.bid where my.uid = ?',[uid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        res.render('bankDeposit',{pageTitle:'Deposit',banks:});
    });*/
};


router.processWithdraw = function (req, res) {
    var uid = req.user.id;
    var bid = req.body.bid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;


    /*db.query('select currentbalance from mybanks where uid = ? and bid = ?',[uid,2], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        //console.log('data' + results[0].currentbalance);
        var currentBalance = results[0].currentbalance;
        if(currentBalance == 0){
            db.query('select * from banks;',function (err, resultss) {
                res.send(resultss);
            })
        }
        else{
            res.send('okkkk');
        }
    });*/

};



module.exports = router;
