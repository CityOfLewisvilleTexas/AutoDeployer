const fs = require("fs");
const { exec } = require("child_process");
const { getDirName } = require("../helpers");
const { detectOS } = require("../helpers");
const { statusHandler } = require("../helpers");

module.exports = payload => {
  const OS = detectOS();
  let items = payload["data"][0];
  let scripts = [];

  items.forEach(item => {
    OS == "win32"
      ? (item.deploymentURL = "C:\\Users\\cholmes\\Desktop\\")
      : (item.deploymentURL = "/Users/cadeholmes/prj/");

    item.buildScripts
      ? (scripts = item.buildScripts.split(",").join(" && "))
      : (scripts = []);

    let projectPath = `${item.deploymentURL}${getDirName(item.gitURL)}`;

    if (fs.existsSync(projectPath)) {
      console.log(item.deploymentURL, "exists!");
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
                      `From ${item.gitURL} * branch master -> FETCH_HEAD`
                    ) ||
                    statusHandler(
                      `From ${item.gitURL} * branch master -> FETCH_HEAD`,
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
                    );
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
  });
};
