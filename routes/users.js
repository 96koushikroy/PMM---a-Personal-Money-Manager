var express = require('express');
var gravatar = require('gravatar');
var router = express.Router();
var db = require('./db.js');
var bcrypt = require('bcrypt-nodejs');

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
                db.query('insert into wallet_add values (?,?,?,?);insert into withdraw values (?,?,?,?,?,?); update mybanks set currentbalance = currentbalance - ? where uid = ? and bid = ?; update users set wallet = wallet + ? where uid = ?',[uid,amount,description + ' #FromBank',date,uid,bid,amount,description,1,date,parseInt(amount),uid,bid,parseInt(amount),uid],function (err, resultss) {
                    if(err) throw err;
                    req.flash('message','The amount was Withdrawn and added to your Wallet Successfully!');
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


router.showMyProfile = function (req, res) {
    var unsecureUrl = gravatar.url(req.user.email, {s: '100', r: 'x', d: 'retro'}, false);
    res.render('myProfile',{message: req.flash('message'),pageTitle:'My Profile',profilePic:unsecureUrl});
};

router.processChangePass = function (req,res) {
    db.query("SELECT password FROM users WHERE email = ?",[req.user.email], function(err, rows){
        if (err) throw err;

        if (!bcrypt.compareSync(req.body.curpassword, rows[0].password)){
            req.flash('message', 'Oops! Wrong password.');
            res.redirect('/profile');
        }
        else{
            var newPass = bcrypt.hashSync(req.body.newpassword, null, null);
            var insertQuery = "update users set password = ? where email = ?";
            db.query(insertQuery,[newPass,req.user.email],function(err, rows) {
                req.flash('message', 'Password Updated Successfully!');
                res.redirect('/profile');
            });
        }
    });
};


router.showSearchWallet = function (req, res) {
    res.render('walletStats',{message: req.flash('message'),pageTitle:'Wallet Statistics',addData:req.flash('addData'),addSum:req.flash('addSum'),expData:req.flash('expData'),expSum:req.flash('expSum')});
};


router.processSearchWallet = function (req, res) {
    var sd = req.body.sd;
    var ed = req.body.ed;
    var desc = req.body.desc;
    var add = req.body.add;
    var exp = req.body.exp;
    var uid = req.user.uid;

    if(!sd || !ed){
        req.flash('message','Error! You need to put in dates for your search!');
        res.redirect('back');
    }


    if(add && !exp){
        var dataQuery = 'select * from wallet_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery = 'select sum(amount) as ss from wallet_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery + sumQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('walletStats',{message: req.flash('message'),pageTitle:'Wallet Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:req.flash('expData'),expSum:req.flash('expSum')});
        });


    }
    else if(!add && exp){
        var dataQuery = 'select * from wallet_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery = 'select sum(amount) as ss from wallet_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery + sumQuery;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('walletStats',{message: req.flash('message'),pageTitle:'Wallet Statistics',addData:0,addSum:0,expData:rows[0],expSum:rows[1][0].ss});
        });
    }
    else if(add && exp){
        var dataQuery1 = 'select * from wallet_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery1 = 'select sum(amount) as ss from wallet_add where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var dataQuery2 = 'select * from wallet_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';
        var sumQuery2 = 'select sum(amount) as ss from wallet_spent where uid = '+uid+' and (dtime between "'+sd+'" and "'+ed+'") and description like "%'+desc+'%";';

        var FinalQry = dataQuery1 + sumQuery1 + dataQuery2 + sumQuery2;

        db.query(FinalQry,function(err, rows, fields) {
            if(err) throw err;
            res.render('walletStats',{message: req.flash('message'),pageTitle:'Wallet Statistics',addData:rows[0],addSum:rows[1][0].ss,expData:rows[2],expSum:rows[3][0].ss});
        });

    }
    else{
        req.flash('message','Error! You need to select at least one of the checkboxes!');
        res.redirect('back');
    }


};




module.exports = router;
