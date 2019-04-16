const fs = require('fs');
const sql = require('mssql');
const { exec } = require('child_process')

module.exports = (payload, response) => {
    //@TODO: need to dynamically set each path
    // to make ajax call to git repo AND resolve git pull/clone
    return new Promise((resolve, reject) => {
        let testObj = payload.recordset[10] //use for testing instances, uses local env path (instead of https://apps.cityoflewisville.com/)
        if (fs.existsSync(testObj['deploymentURL'])) {
            exec(
                `git pull ${testObj['gitURL']}`,
                { cwd: 'C:\\Users\\cholmes\\Desktop\\abc2\\' },
                (err, stdout, stderr) => {
                    if (err) {
                        console.dir(`${stderr}`,)
                    }
                
                    console.log(stdout)
                    resolve()
                }
            )
        }
        // else {
        //     exec(
        //         `git clone ${testObj['gitURL']}`,
        //         { cwd: `../${testObj[deploymentURL]}`},

        //     )
        // }
        response.send(payload.recordset)
        sql.close()
    })
}