const homedir = require('os').homedir()
const home = process.env.Home || homedir
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.todo')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { flat: 'a+' }, (error, data) => {
                if (error) return reject(error)
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error) {
                    list = []
                }
                resolve(list)

            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string + '\n', (error) => {
                if (error) return reject(error)
                resolve(list)
            })

        })

    }
}
module.exports = db