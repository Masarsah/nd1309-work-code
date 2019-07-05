/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

class LevelSandbox {

    constructor() {
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        // let self = this;
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            db.get(key, function (err, value) {
                if (err) {
                    console.log(`${key} Error !`, err);

                    reject('Error!');
                }
                resolve(value, 'GET successed !!');
            });

        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        console.log(value)
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject() 
            db.put(key, JSON.stringify(value), function (success, err) {
                if (err) {
                    console.log('Error with Put!', err);
                    reject(`(${key},${value}) Error with Put!`);
                }
                resolve(` ${JSON.stringify(value)}`);
            });
        });
    }

    // Method that return the height
    getBlocksCount() {
        const dataArray = [];
        return new Promise(function (resolve, reject) {
            let height = 0;

            // Add your code here, remember in Promises you need to resolve() or reject()
            db.createReadStream()
                .on('data', function (data) {
                    height++;
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    resolve(height + 1);
                });
        });
    }

    addDataToLevelDB(data) {
        let self = this;
        let i = 0;
        console.log(data)
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            db.createReadStream()
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

    getBlock(height) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.getLevelDBData(height).then((result) => {
                resolve(JSON.parse(JSON.stringify(result)));
            }).catch((err) => {
                console.log(err);
                reject(`get block failed ${err}`);
            });

        });
    }



    // Get Address
    getAddress(address) {
        const blocks = []
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            db.createReadStream()
                .on('data', function (data) {
                    const block = JSON.parse(data.value)
                    if (block.body.address === address) {
                        block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'base64').toString('ascii')
                        blocks.push(block)
                    }
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    resolve(blocks);
                });
        });
    }

    // Get HAsh
    getHash(hash) {
        let block = null;
        return new Promise(function (resolve, reject) {
            // Add your code here, remember in Promises you need to resolve() or reject()
            db.createReadStream()
                .on('data', function (data) {
                    const block = JSON.parse(data.value);
                    if (block.hash === hash) {

                        block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'base64').toString('ascii')
                        return resolve(block)

                    }
                })
                .on('error', function (err) {
                    reject(err, 'block not found ')
                })
                .on('close', function () {
                    resolve(block);
                });
        });
    }


}


module.exports.LevelSandbox = LevelSandbox;
