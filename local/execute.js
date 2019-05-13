const sql = require("mssql");
const pathFinder = require("./pathFinder");
require("dotenv").config();

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
};

module.exports = (res, query) => {
  let response = res;
  sql.connect(sqlConfig, function(err) {
    if (err) {
      console.log("Error while connecting database :- " + err);
      res.redirect("/get");
    } else {
      // create Request object
      var request = new sql.Request();
      // query to the database
      request.query(query, function(err, res) {
        if (err) {
          console.log("Error while querying database :- " + err);
          res.send(err);
        } else {
          pathFinder(res);
        }
      });
    }
  });
};
