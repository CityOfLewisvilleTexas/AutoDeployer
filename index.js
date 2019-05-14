require("dotenv").config();
const { detectOS } = require("./helpers");
const axios = require("axios");
const pathHandler = require("./remote/pathHandler");

(() => {
  axios
    .post("http://query.cityoflewisville.com/v2/", {
      webservice: "ITS/Get Github Deployment URLs"
    })
    .then(response => {
      pathHandler(response);
    })
    .catch(function(err) {
      console.log(err);
    });
})();
