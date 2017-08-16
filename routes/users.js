var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.showHome = function(req, res){
    getBanks(function(res){
        BankList = res;
    });
    res.render('index', { title: 'PMM - a minimalistic Personal Money Manager',pageTitle:'Home',message:req.flash('message')});
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
        bankname    : bankName
    };
    var query = db.query("INSERT INTO banks set ? ",data, function(err, rows)
    {
        if (err)
            console.log("Error inserting : %s ",err );
    });
    res.render('addBanks',{message:'Data Added Successfully!'});
};

router.showMyBanks = function (req, res) {
    var uid = req.user.uid;
    db.query('select * from banks where id not in (select bid from mybanks where uid = ?); select my.bid,my.currentbalance,b.bankname from mybanks my join banks b on b.id = my.bid where my.uid = ?',[uid,uid], function (error, results, fields) {
        if (error) throw error;
        res.render('addMyBank',{pageTitle: 'My Banks', bank: results[0],myBank:results[1],message: req.flash('message')});
    });
};


router.addMyBanks = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.balance;
    var bid = req.body.bank;

    db.query('INSERT INTO mybanks values (?,?,?);',[uid,bid,amount], function (error, results, fields) {
        if (error) throw error;//res.render('addMyBank',{pageTitle: 'My Banks',message:error});
        req.flash('message', 'Your Bank was Added Successfully!');
        res.redirect('/mybanks');
    });
};

router.deleteMyBanks = function (req, res) {
    var uid = req.user.uid;
    var bid = req.params.bid;
    db.query('delete from mybanks where uid = ? and bid = ?;',[uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        req.flash('message', 'Your Bank was Deleted Successfully!');
        res.redirect('/mybanks');
    });
};

router.processDeposit = function (req, res) {
    var uid = req.user.uid;
    var bid = req.body.bid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;

    db.query('insert into deposit values (?,?,?,?,?); update mybanks set currentbalance = currentbalance + ? where uid = ? and bid = ?;',[uid,bid,amount,description,date,parseInt(amount),uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        req.flash('message', 'The amount was Deposited Successfully!');
        res.redirect('/mybanks');
    });
};


router.processWithdraw = function (req, res) {
    var uid = req.user.uid;
    var bid = req.body.bid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;
    var wallet = req.body.wall;


    db.query('select currentbalance from mybanks where uid = ? and bid = ?',[uid,bid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        //console.log('data' + results[0].currentbalance);
        var currentBalance = results[0].currentbalance - parseInt(amount);
        if(currentBalance >= 0){
            if(wallet){
                db.query('insert into withdraw values (?,?,?,?,?,?); update mybanks set currentbalance = currentbalance - ? where uid = ? and bid = ?; update users set wallet = wallet + ? where uid = ?',[uid,bid,amount,description,1,date,parseInt(amount),uid,bid,parseInt(amount),uid],function (err, resultss) {
                    if(err) throw err;
                    req.flash('message','The amount was Withdrawn Successfully!');
                    res.redirect('/mybanks');
                });
            }
            else{
                db.query('insert into withdraw values (?,?,?,?,?,?); update mybanks set currentbalance = currentbalance - ? where uid = ? and bid = ?;',[uid,bid,amount,description,0,date,parseInt(amount),uid,bid],function (err, resultss) {
                    if(err) throw err;
                    req.flash('message','The amount was Withdrawn Successfully!');
                    res.redirect('/mybanks');
                });
            }
        }
        else{
            req.flash('message', 'Insufficient amount! Withdrawal Failed.');
            res.redirect('/mybanks');
        }
    });

};

router.processWalletAdd = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;

    db.query('insert into wallet_add values (?,?,?,?); update users set wallet = wallet + ? where uid = ?;',[uid,amount,description,date,parseInt(amount),uid], function (error, results, fields) {
        if (error) throw error;
        req.flash('message', 'The amount was added to the Wallet Successfully!');
        res.redirect('back');
    });
};


router.processWalletSpent = function (req, res) {
    var uid = req.user.uid;
    var amount = req.body.amount;
    var description = req.body.desc;
    var date = req.body.date;


    db.query('select wallet from users where uid = ?',[uid], function (error, results, fields) {
        if (error) throw error;//es.render('addMyBank',{pageTitle: 'My Banks',message:error});
        //console.log('data' + results[0].currentbalance);
        var currentBalance = results[0].wallet - parseInt(amount);
        if(currentBalance >= 0){
            db.query('insert into wallet_spent values (?,?,?,?); update users set wallet = wallet - ? where uid = ?;',[uid,amount,description,date,parseInt(amount),uid],function (err, resultss) {
                if(err) throw err;
                req.flash('message','The amount was deducted Successfully!');
                res.redirect('back');
            });
        }
        else{
            req.flash('message', 'Insufficient amount! You are ' + (currentBalance*-1).toString() + ' Taka short.');
            res.redirect('back');
        }
    });

};



module.exports = router;
