var sql = require('mssql');
var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var https = require('https');
var http = require('http');
let bodyParser = require('body-parser')
require('dotenv').config()
const PORT = 3000

//Body Parser
app.use(bodyParser.json())

//CORS Middleware
app.use(function (req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

const sqlConfig = { 
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    requestTimeout: 6000,
    options: { 
        encrypt: false
        }
    }

let handleGithubQuery = function(payload, response) {
    //need to execute URLS, update table,
    // and set updated items to have flag so they are not retrieved further
    
    console.log(payload.recordset)
    response.send(payload.recordset)
    sql.close()
}

let executeQuery = function(res, query){
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
                                      handleGithubQuery(res, response)
                                         }
                              });
                      }
     });           
}


app.get('/', (req, res) => {
    let query = `select * from CACHE_githubDeployments`
    executeQuery(res, query)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


