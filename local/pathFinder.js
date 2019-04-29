const fs = require('fs');
const sql = require('mssql');
const { exec } = require('child_process')
const { getDirName } = require( '../helpers')

module.exports = (payload, response) => {
    let items = payload.recordset
<<<<<<< HEAD:local/pathFinder.js
   
=======

>>>>>>> cfddee3db84e953e6f0c8d9be1c1519ad91ba585:local/pathFinder.js
    items.forEach(item => {
        item.deploymentURL = item.deploymentURL.replace(
            "https://apps.cityoflewisville.com/",
            "C:\\inetpub\\wwwroot\\"
          )
       
            if (fs.existsSync(item.deploymentURL)) {
                exec(`git init`, { cwd: item.deploymentURL }, (stdout, stderr) => {
                    if (stderr) {
                        if (stderr.includes('fatal: not a git repository')) {
                            console.log('No Git Repo Associated with this Directory. Please execute "git init" and pull from a valid remote.')
                            return
                        }
                    }
                    else {
                    stdout === null
                        ? console.log(`Git initialized repository in ${item.deploymentURL}`)
                        : console.log(stdout)
                    }
                })
                exec(
                    `git pull ${item.gitURL} master`,
                    { cwd: item.deploymentURL },
                    (stdout, stderr) => {
                        if (stderr) {
                            console.log(stderr)
                        }
                        else {
                        stdout === null
                            ? console.log(`From ${item.gitURL} * branch master -> FETCH_HEAD`)
                            : console.log(stdout)
                        }
                    }
                )
            }
            else if (!fs.existsSync(item.deploymentURL)) {
<<<<<<< HEAD:local/pathFinder.js
=======
                //@OTODO: \\\\ax1viis1\\c$\\inetpub\\wwwroot Does not work
                //"UNC paths are not supported.  Defaulting to Windows directory."
>>>>>>> cfddee3db84e953e6f0c8d9be1c1519ad91ba585:local/pathFinder.js
                item.deploymentURL = 'C:\\Users\\cholmes\\Desktop'
                exec(`mkdir ${getDirName(item.gitURL)}`, { cwd: item.deploymentURL }, (stdout, stderr) => {
                    if (stderr) {
                        console.log(stderr)
                    }
                    else {
                    stdout === null
                        ? console.log(`Directory ${getDirName(item.gitURL)} created on ${item.deploymentURL}`)
                        : console.log(stdout)
                    }
                })
                exec(`git clone ${item.gitURL}`, { cwd: item.deploymentURL }, (stdout, stderr) => {
                    if (stderr) {
                        console.log(stderr)
                    }
                    else {
                    stdout === null
                        ? console.log(`Successfully Cloned ${getDirName(item.gitURL)} into ${item.deploymentURL}`)
                        : console.log(stdout)
                    }
                })
            }
    })
    sql.close()
    response.send(payload.recordset)
}