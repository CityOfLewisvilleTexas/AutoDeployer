const sql = require('mssql');
const windowsHandler = require('./windowsHandler')
const macHandler = require('./macHandler')
const detectOS = require('../os/detect')
require('dotenv').config()

const sqlConfig = {
    //see .env file
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    requestTimeout: 6000,
    options: {
        encrypt: false
    }
}

module.exports = (res, query) => {
    let response = res
    sql.connect(sqlConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, res) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    console.log(detectOS)
                    if(detectOS == 'windows') {
                        windowsHandler(res, response)
                    }
                    else if(detectOS == 'mac') {
                        macHandler(res, response)
                    }
                    else {
                        console.log('Could not determine OS')
                    }
                }
            });
        }
    });
}