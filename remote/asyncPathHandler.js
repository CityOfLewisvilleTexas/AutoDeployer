const fs = require("fs");
const { exec } = require("child_process");
const { getDirName, detectOS, statusHandler } = require("../helpers");

module.exports = payload => {
  const items = payload["data"][0];
  const OS = detectOS();
  let statusMessages = [];

  const deploy = async () => {
    items.forEach(item => {
      if (item["HAS_BEEN_CLONED"] !== true) {
        OS == "win32"
          ? (item.deploymentURL = "C:\\Users\\cholmes\\Desktop\\")
          : (item.deploymentURL = "/Users/cadeholmes/prj/");

        item.buildScripts
          ? (scripts = item.buildScripts.split(",").join(" && "))
          : (scripts = []);

        let projectPath = `${item.deploymentURL}${getDirName(item.gitURL)}`;

        if (fs.existsSync(projectPath)) {
          const initialize = item => {
            exec(`git init`, { cwd: projectPath }, (stdout, stderr) => {
              if (stderr) {
                if (stderr.includes("fatal: not a git repository")) {
                  statusMessages.push(
                    'No Git Repo Associated with this Directory. Please execute "git init" and pull from a valid remote.'
                  );
                  return;
                }
                console.log(stderr);
                statusMessages.push(stderr);
              } else {
                stdout === null
                  ? console.log(
                      `Git initialized repository in ${item.deploymentURL}`
                    ) ||
                    statusMessages.push(
                      `Git initialized repository in ${item.deploymentURL}`
                    )
                  : console.log(stdout) || statusMessages.push(stdout);
              }
            });
          };
          const pull = item => {
            exec(
              `git pull ${item.gitURL} master`,
              { cwd: projectPath },
              (stdout, stderr) => {
                if (stderr) {
                  console.log(stderr);
                  statusMessages.push(stderr);
                } else {
                  stdout === null
                    ? console.log(
                        `Git initialized repository in ${item.deploymentURL}`
                      ) ||
                      statusMessages.push(
                        `Git initialized repository in ${item.deploymentURL}`
                      )
                    : console.log(stdout) || statusMessages.push(stdout);
                }
              }
            );
          };
          const scriptHandler = () => {
            if (scripts.length > 0) {
              exec(scripts, { cwd: projectPath }, (stdout, stderr) => {
                stderr
                  ? console.log(stderr) || statusMessages.push(stderr)
                  : stdout === null
                  ? console.log("script executed") ||
                    statusMessages.push(`${scripts} executed successfully`)
                  : console.log(stdout) || statusMessages.push(stdout);
              });
            } else {
              console.log("script error!") ||
                statusMessages.push("script error!");
            }
          };
          initialize(item)
            .then(pull)
            .then(scriptHandler);
        } else if (!fs.existsSync(projectPath)) {
          console.log(item.deploymentURL, "does not exist!");
          OS == "win32"
            ? (item.deploymentURL = "C:\\Users\\cholmes\\Desktop\\")
            : (item.deploymentURL = "/Users/cadeholmes/prj/");

          item.buildScripts
            ? (scripts = item.buildScripts.split(",").join(" && "))
            : (scripts = []);

          const createRepo = item => {
            exec(
              `mkdir ${getDirName(item.gitURL)}`,
              { cwd: item.deploymentURL },
              (stdout, stderr) => {
                if (stderr) {
                  console.log(stderr);
                  statusHandler(
                    stderr,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  );
                } else {
                  stdout === null
                    ? console.log(
                        `Directory ${getDirName(item.gitURL)} created on ${
                          item.deploymentURL
                        }`
                      ) ||
                      statusHandler(
                        `Directory ${getDirName(item.gitURL)} created on ${
                          item.deploymentURL
                        }`,
                        item.deploymentURL,
                        item.gitURL,
                        item.userEmail
                      )
                    : // statusMessages.push(
                      //   `Directory ${getDirName(item.gitURL)} created on ${
                      //     item.deploymentURL
                      //   }`
                      // )
                      console.log(stdout) ||
                      statusHandler(
                        stdout,
                        item.deploymentURL,
                        item.gitURL,
                        item.userEmail
                      );
                }
              }
            );
          };

          //mkdir should have done it's thing by now, repo should exist
          const clone = item => {
            exec(
              `git clone ${item.gitURL}`,
              { cwd: `${item.deploymentURL}` }, //${getDirName(item.gitURL)}
              (stdout, stderr) => {
                if (stderr) {
                  console.log(stderr);
                  statusHandler(
                    stderr,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  );
                } else {
                  stdout === null
                    ? console.log(
                        `Successfully Cloned ${getDirName(item.gitURL)} into ${
                          item.deploymentURL
                        }`
                      ) ||
                      statusHandler(
                        `Successfully Cloned ${getDirName(item.gitURL)} into ${
                          item.deploymentURL
                        }`,
                        item.deploymentURL,
                        item.gitURL,
                        item.userEmail
                      )
                    : console.log(stdout) ||
                      statusHandler(
                        stdout,
                        item.deploymentURL,
                        item.gitURL,
                        item.userEmail
                      )(stdout);
                }
              }
            );
          };
          const installModules = item => {
            exec(`npm install`, { cwd: projectPath }, (stdout, stderr) => {
              if (stderr) {
                console.log("NEW PATH: ", projectPath, stderr);
                statusHandler(
                  stderr,
                  item.deploymentURL,
                  item.gitURL,
                  item.userEmail
                );
              } else {
                stdout === null
                  ? console.log(stdout) ||
                    statusHandler(
                      `npm install complete`,
                      item.deploymentURL,
                      item.gitURL,
                      item.userEmail
                    )
                  : console.log(stdout) ||
                    statusHandler(
                      stdout,
                      item.deploymentURL,
                      item.gitURL,
                      item.userEmail
                    );
              }
            });
          };

          const scriptHandler = () => {
            if (scripts.length > 0) {
              exec(scripts, { cwd: projectPath }, (stdout, stderr) => {
                stderr
                  ? console.log(stderr)
                  : stdout === null
                  ? console.log("script executed")
                  : console.log(stdout);
              });
            } else {
              console.log("script error!");
            }
          };
          createRepo(item)
            .then(clone)
            .then(installModules)
            .then(scriptHandler);
        }
      } else {
        return;
      }
    });
  };

  deploy().then(function([msg, items]) {
    let prjs = items.filter(item => item["HAS_BEEN_CLONED"] !== true);
    if (!prjs.length) {
      statusHandler(
        "There are no new repositories to clone or integrate!",
        "not provided",
        "not provided",
        "cholmes@cityoflewisville.com"
      );
    } else {
      prjs.forEach(prj => {
        statusHandler(
          msg.length < 1 ? "Process Complete" : msg,
          prj.deploymentURL,
          prj.gitURL,
          prj.userEmail
        );
      });
    }
  });
};
