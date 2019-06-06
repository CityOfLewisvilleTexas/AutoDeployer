const fs = require("fs");
const { exec } = require("child_process");
const { getDirName, detectOS, statusHandler } = require("../helpers");

module.exports = payload => {
  const items = payload["data"][0];
  const OS = detectOS();

  const deploy = () => {
    return new Promise((resolve, reject) => {
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
              return new Promise((resolve, reject) => {
                exec(`git init`, { cwd: projectPath }, (stdout, stderr) => {
                  if (stderr) {
                    if (stderr.includes("fatal: not a git repository")) {
                      statusHandler(
                        'No Git Repo Associated with this Directory. Please execute "git init" and pull from a valid remote.',
                        item.deploymentURL,
                        item.gitURL,
                        item.userEmail
                      );
                      return;
                    }
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
                          `Git initialized repository in ${item.deploymentURL}`
                        ) ||
                        statusHandler(
                          `Git initialized repository in ${item.deploymentURL}`,
                          item.deploymentURL,
                          item.gitURL,
                          item.userEmail
                        )
                      : console.log(stdout) ||
                        statusHandler(
                          'No Git Repo Associated with this Directory. Please execute "git init" and pull from a valid remote.',
                          item.deploymentURL,
                          item.gitURL,
                          item.userEmail
                        );
                  }
                  resolve(item);
                });
              });
            };
            const pull = item => {
              return new Promise((resolve, reject) => {
                exec(
                  `git pull ${item.gitURL} master`,
                  { cwd: projectPath },
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
                            `Git initialized repository in ${
                              item.deploymentURL
                            }`
                          ) ||
                          statusHandler(
                            `Git initialized repository in ${
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
                          );
                    }
                    resolve(item);
                  }
                );
              });
            };
            const scriptHandler = () => {
              return new Promise((resolve, reject) => {
                if (scripts.length > 0) {
                  exec(scripts, { cwd: projectPath }, (stdout, stderr) => {
                    stderr
                      ? console.log(stderr) ||
                        statusHandler(
                          stderr,
                          item.deploymentURL,
                          item.gitURL,
                          item.userEmail
                        )
                      : stdout === null
                      ? console.log("script executed") ||
                        statusHandler(
                          `${scripts} executed successfully`,
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
                  });
                } else {
                  console.log("script error!") &&
                    statusHandler(
                      "script error!",
                      item.deploymentURL,
                      item.gitURL,
                      item.userEmail
                    );
                }
                resolve();
              });
            };
            initialize(item)
              .then(pull)
              .then(scriptHandler);
            //@TODO: replace statusMessages.push with statusHandler()
          } else if (!fs.existsSync(projectPath)) {
            console.log(item.deploymentURL, "does not exist!");
            OS == "win32"
              ? (item.deploymentURL = "C:\\Users\\cholmes\\Desktop\\")
              : (item.deploymentURL = "/Users/cadeholmes/prj/");

            item.buildScripts
              ? (scripts = item.buildScripts.split(",").join(" && "))
              : (scripts = []);

            const createRepo = item => {
              return new Promise((resolve, reject) => {
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
                    resolve(item);
                  }
                );
              });
            };

            //mkdir should have done it's thing by now, repo should exist
            const clone = item => {
              return new Promise((resolve, reject) => {
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
                            `Successfully Cloned ${getDirName(
                              item.gitURL
                            )} into ${item.deploymentURL}`
                          ) ||
                          statusHandler(
                            `Successfully Cloned ${getDirName(
                              item.gitURL
                            )} into ${item.deploymentURL}`,
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
                    resolve(item);
                  }
                );
              });
            };
            const installModules = item => {
              return new Promise((resolve, reject) => {
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
                  resolve(item);
                });
              });
            };

            const scriptHandler = () => {
              return new Promise((resolve, reject) => {
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
                resolve();
              });
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
      resolve(); //resolve([statusMessages, items]);
    });
  };

  deploy();
  // .then(function([msg, items]) {
  //   let prjs = items.filter(item => item["HAS_BEEN_CLONED"] !== true);
  //   if (!prjs.length) {
  //     statusHandler(
  //       "There are no new repositories to clone or integrate!",
  //       "not provided",
  //       "not provided",
  //       "cholmes@cityoflewisville.com"
  //     );
  //   } else {
  //     prjs.forEach(prj => {
  //       statusHandler(
  //         msg.length < 1 ? "Process Complete" : msg,
  //         prj.deploymentURL,
  //         prj.gitURL,
  //         prj.userEmail
  //       );
  //     });
  //   }
  // });
};
