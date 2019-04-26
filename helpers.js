const os = require('os')

getDirName = (path) => {
    return path.replace('git@github.com:CityOfLewisvilleTexas/', '')
}

detectOS = () => {
    const platform = os.platform()
    return platform
}

module.exports = {
    getDirName: getDirName,
    detectOS: detectOS
}