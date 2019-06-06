const axios = require("axios");
const pathHandler = require("./remote/pathHandler");
const asyncPathHandler = require("./remote/asyncPathHandler")(() => {
  axios
    .post("http://query.cityoflewisville.com/v2/", {
      webservice: "ITS/Get Github Deployment URLs"
    })
    .then(response => {
      pathHandler(response);
      //asyncPathHandler(response)
    })
    .catch(function(err) {
      console.log(err);
    });
})();
