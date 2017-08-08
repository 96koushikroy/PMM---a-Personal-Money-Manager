var mysql = require('mysql');
var dbConfig = require('../config/db.js');
var db;

function connectDB() {
    if(!db){
        db = mysql.createConnection(dbConfig.connection);
        db.connect(function (err) {
            if(err){
                console.log(err.reason);
            }
        });

    }
    return db;
}

module.exports = connectDB();