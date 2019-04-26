const os = require('os')

//detect OS of file server
module.exports = () => {
    let _os = os.platform(),
        platform

    if (os == 'win32') {
        platform = 'windows'
    }
    else if (os == 'Linux') {
        platform == 'mac'
    }
    return platform
}

