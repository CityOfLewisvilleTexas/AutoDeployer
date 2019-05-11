const fs = require('fs');
const { exec } = require('child_process')
const { getDirName } = require( '../helpers')

module.exports = (payload, response) => {
    let items = payload['data'][0]
    let scripts = []

    items.forEach(item => {
        item.deploymentURL = item.deploymentURL.replace(
            "https://apps.cityoflewisville.com/",
            "/Users/cadeholmes/prj/"
          )
          if(item.buildScripts) {
            scripts.push(item.buildScripts)
            console.log(scripts)
        }

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
                scripts ? 
                exec(...scripts, { cwd: item.deploymentURL}, (stdout, stderr) => { stderr ? console.log(stderr) : stdout === null ? console.log('script executed') : console.log(stdout)}) 
                : console.log('script error!')
            }
            else if (!fs.existsSync(item.deploymentURL)) {
                item.deploymentURL = '/Users/cadeholmes/prj/'
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
                scripts ? 
                exec(...scripts, { cwd: item.deploymentURL}, (stdout, stderr) => { stderr ? console.log(stderr) : stdout === null ? console.log('script executed') : console.log(stdout)}) 
                : console.log('script error!')
            }
        }).catch((err) => {
            console.log('Error in Promise: ',err)
        })
    response.send(payload)
}