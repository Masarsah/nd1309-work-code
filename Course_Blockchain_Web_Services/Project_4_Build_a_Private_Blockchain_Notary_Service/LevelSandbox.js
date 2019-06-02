/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.get(key, function (err, value) {
                if (err) {
                    reject('Error!');
                    console.log(`${key} Error !`, err);

                }
                resolve(value, 'GET successed !!');
            });

        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        console.log(value)
        console.log(key)

        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject() 
            self.db.put(key, JSON.stringify(value), function (success, err) {
                if (err) {
                    console.log('Error with Put!', err);
                    reject(`(${key},${value}) Error with Put!`);
                }
                resolve(` ${JSON.stringify(value)}`);
                console.log(value)
            });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        const dataArray = [];
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
          self.db.createReadStream()
                .on('data', function (data) {
                    console.log(data)
                    dataArray.push(data);
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    resolve(dataArray.length);
                    console.log(dataArray.length)

                });
        });
    }

    addDataToLevelDB(data) {
        let self = this;
        let i = 0;
        console.log(data)
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            self.db.createReadStream()
                .on('data', function (data) {
                    i++;
                })
                .on('error', function (err) {
                    console.log('Failed to read stream!', err)
                    reject(`Error addDataToLevelDB  !! ${data}`);
                })
                .on('close', function () {
                    console.log(`Adding Block....${i}`, data);
                    self.addLevelDBData(i, data).then((result) => {
                        resolve(result)
                    }).catch((err) => {
                        console.log(`${err} try`)
                    });
        });
    });
}

// Get block by height

getBlock(height) {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.getLevelDBData(height)
            .then((result) => {
                resolve(result);
            });
    });
}

// Get block by hash
getBlockByHash(hash) {
    let self = this;
    let block = null;
    return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function (data) {
            if(data.hash === hash){
                block = data;
            }
        })
        .on('error', function (err) {
            reject(err)
        })
        .on('close', function () {
            resolve(block);
        });
    });
}

// Get Address

getAddress(address) {
    let self = this;
    return new Promise((resolve, reject) => {
        self.db.get(address, function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(value)));
          console.log(JSON.parse(JSON.stringify(value)), 'lol')
        }
      });
    })
  }



}


module.exports.LevelSandbox = LevelSandbox;
