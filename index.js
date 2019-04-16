const sql = require('mssql');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const { exec } = require('child_process')
const PORT = 3000
require('dotenv').config()
//files
const queryExecutor = require('./utils/queryExecutor')

//Body Parser
app.use(bodyParser.json())

//CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});


app.get('/', (req, res) => {
    let query = `select * from CACHE_githubDeployments`
   queryExecutor(res, query)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))


