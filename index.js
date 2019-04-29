const sql = require('mssql');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const { exec } = require('child_process')
const axios = require('axios')
const PORT = 3000
require('dotenv').config()
//files
const execute = require('./local/execute')
const pathHandler = require('./remote/pathHandler')

//Body Parser
app.use(bodyParser.json())

//CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});


//if cxn strings to DB
app.get('/', (req, res) => {
    let query = `select * from CACHE_githubDeployments`
    
    execute(res, query)
})

//else, hit api
app.get('/get', (req, res, next) => {
    axios.post('http://query.cityoflewisville.com/v2/', {
        webservice: 'ITS/Get Github Deployment URLs'
    }).then((response) => {

        pathHandler(response, res)
    }).catch((err) => err)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


