/*var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var dd = require('./users.js');

// GET home page.
router.get('/', dd.work);
router.get('/test', dd.list);
router.get('/login',function (req,res) {
    res.render('error');
});
module.exports = router;
*/

var dataController = require('./users.js');

module.exports = function (app) {
    app.get('/',dataController.work);
    app.get('/login',dataController.showLogin);
}