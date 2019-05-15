const os = require("os");
const axios = require("axios");

getDirName = path => {
  return path.replace("git@github.com:CityOfLewisvilleTexas/", "");
};

detectOS = () => {
  const platform = os.platform();
  return platform;
};

statusHandler = (status, deploymentURL, githubURL, user) => {
  axios
    .post("http://query.cityoflewisville.com/v2/", {
      webservice: "ITS/AutoDeployer/Update Status",
      Subject: `Status Notification`,
      Status: status,
      DeploymentURL: deploymentURL,
      GithubURL: githubURL,
      User: user
    })
    .catch(function(err) {
      console.log(err);
    });
};

module.exports = {
  getDirName: getDirName,
  detectOS: detectOS,
  statusHandler: statusHandler
};
