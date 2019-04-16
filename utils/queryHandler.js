const fs = require('fs');
const sql = require('mssql');
const { exec } = require('child_process')

module.exports = (payload, response) => {
    let testObj = payload.recordset[8]
    if (fs.existsSync(testObj['deploymentURL'])) {
        console.log('exists')
    }
    
    response.send(payload.recordset)
    sql.close()
}