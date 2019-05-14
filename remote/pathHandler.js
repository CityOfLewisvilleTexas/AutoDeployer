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
      ? (item.deploymentURL = item.deploymentURL.replace(
          "https://apps.cityoflewisville.com/",
          "C:\\Users\\cholmes\\Desktop\\" // For prod, this will need to change: "C:\\inetpub\\wwwroot\\"
        ))
      : (item.deploymentURL = item.deploymentURL.replace(
          "https://apps.cityoflewisville.com/",
          "/Users/cadeholmes/prj/"
        ));

    item.buildScripts
      ? (scripts = item.buildScripts.split(",").join(" && "))
      : (scripts = []);

    if (fs.existsSync(item.deploymentURL)) {
      exec(`git init`, { cwd: item.deploymentURL }, (stdout, stderr) => {
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
              ) &&
              statusHandler(
                `Git initialized repository in ${item.deploymentURL}`,
                item.deploymentURL,
                item.gitURL,
                item.userEmail
              ) /*console.log(`Git initialized repository in ${item.deploymentURL}`)*/
            : console.log(stdout) &&
              statusHandler(
                stdout,
                item.deploymentURL,
                item.gitURL,
                item.userEmail
              ); /*console.log(stdout);*/
        }
      });
      exec(
        `git pull ${item.gitURL} master`,
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
                  `From ${item.gitURL} * branch master -> FETCH_HEAD`
                ) &&
                statusHandler(
                  `From ${item.gitURL} * branch master -> FETCH_HEAD`,
                  item.deploymentURL,
                  item.gitURL,
                  item.userEmail
                )
              : console.log(stdout) &&
                statusHandler(
                  stdout,
                  item.deploymentURL,
                  item.gitURL,
                  item.userEmail
                );
          }
        }
      );
      scripts.length > 0
        ? exec(scripts, { cwd: item.deploymentURL }, (stdout, stderr) => {
            stderr
              ? console.log(stderr)
              : stdout === null
              ? console.log("script executed")
              : console.log(stdout);
          })
        : console.log("script error!");
    } else if (!fs.existsSync(item.deploymentURL)) {
      OS == "win32"
        ? (item.deploymentURL = "C:\\Users\\cholmes\\Desktop\\")
        : (item.deploymentURL = "/Users/cadeholmes/prj/");
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
                ) &&
                statusHandler(
                  `Directory ${getDirName(item.gitURL)} created on ${
                    item.deploymentURL
                  }`,
                  item.deploymentURL,
                  item.gitURL,
                  item.userEmail
                )
              : console.log(stdout) &&
                statusHandler(
                  stdout,
                  item.deploymentURL,
                  item.gitURL,
                  item.userEmail
                );
          }
        }
      );
      //mkdir should have done it's thing by now, repo should exist
      if (fs.existsSync(`${item.deploymentURL}${getDirName(item.gitURL)}`)) {
        console.log(
          "ITS ALIVE",
          `${item.deploymentURL}${getDirName(item.gitURL)}`
        );
        exec(
          `git clone ${item.gitURL}`,
          { cwd: `${item.deploymentURL}\\${getDirName(item.gitURL)}` },
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
                ? console.log(stdout) &&
                  statusHandler(
                    `Successfully Cloned ${getDirName(item.gitURL)} into ${
                      item.deploymentURL
                    }`,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  )
                : console.log(stdout) &&
                  statusHandler(
                    stdout,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  );
            }
          }
        );
        exec(
          `npm install`,
          { cwd: `${item.deploymentURL}${getDirName(item.gitURL)}` },
          (stdout, stderr) => {
            if (stderr) {
              console.log(
                "NEW PATH: ",
                `${item.deploymentURL}\\${getDirName(item.gitURL)}`,
                stderr
              );
              statusHandler(
                stderr,
                item.deploymentURL,
                item.gitURL,
                item.userEmail
              );
            } else {
              stdout === null
                ? console.log(stdout) &&
                  statusHandler(
                    `npm install complete`,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  )
                : console.log(stdout) &&
                  statusHandler(
                    stdout,
                    item.deploymentURL,
                    item.gitURL,
                    item.userEmail
                  );
            }
          }
        );
        scripts.length > 0
          ? exec(
              scripts,
              { cwd: `${item.deploymentURL}${getDirName(item.gitURL)}` },
              (stdout, stderr) => {
                stderr
                  ? console.log(stderr)
                  : stdout === null
                  ? console.log("script executed")
                  : console.log(stdout);
              }
            )
          : console.log("script error!");
      } else {
        console.log(
          "IT DOESNT EXIST",
          `${item.deploymentURL}${getDirName(item.gitURL)}`
        );
      }
    }
  });
};
