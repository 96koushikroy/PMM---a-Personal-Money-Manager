var express = require('express');
var router = express.Router();
var db = require('./db.js');

router.work = function(req, res){
    /*db.query('SELECT * From student', function (error, results, fields) {
        if (error) throw error;
        res.render('index', { title: 'PMM - a minimalistic Personal Money Manager',data:results });
    });*/

    res.render('index', { title: 'PMM - a minimalistic Personal Money Manager' });
};

router.list = function(req, res){
    res.send("respond with a resource");
};

router.showLogin = function (req, res) {
    res.render('login');
};


module.exports = router;
