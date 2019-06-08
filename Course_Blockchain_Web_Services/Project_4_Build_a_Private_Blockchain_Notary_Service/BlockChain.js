/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        // Add your code here
        this.getBlockHeight().then((blockHeight) => {
            if (blockHeight === 0) {
                this.addBlock(new Block.Block("1st block in the chain - Genesis block"));
            }
        });

    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        return new Promise((resolve, reject) => {
            console.log(this.bd.getBlocksCount().then((chainHeight) => {
                console.log(chainHeight)
                if (chainHeight - 1 <= 0) {
                    resolve(0);
                    console.log('chainHeight - 1 <= 0')
                } else {
                    resolve(chainHeight - 1);
                    console.log('chainHeight - 1')
                }
            }).catch((err) => {
                console.log(err);
                console.log(chainHeight)
                reject(chainHeight)
                res.send(`GETTING block Count failed ${err}`);
            }));
        });

    }
    // Add new block
    addBlock(block) {
        // Add your code here
        // let self = this;
        console.log(block, 'addBlock')

        console.log(new Promise((resolve, reject) => {
            console.log(this.getBlockHeight().then((chainLength) => {
                // Block chainLength
                block.height = chainLength + 1;
                block.time = Date.now();
                if (chainLength > 0) {
                    this.getBlock(chainLength - 1).then((blockData) => {
                        const previousBlock = JSON.parse(blockData);
                        block.previousBlockHash = previousBlock.hash;
                        // Block hash with SHA256 using newBlock and converting to a string
                        block.hash = SHA256(JSON.stringify(block)).toString();
                        // Adding block object to chain
                        this.bd.addDataToLevelDB(block);
                        resolve(block);
                    }, (error) => {
                        console.log('get block failed !!!!!', error);
                    });
                } else {
                    console.log('else');
                }
            }).catch((err) => {
                console.log(err);
                reject(`${err}Failed with Add block !!`);
            }));;
        }), 'addBlock Promise');
    }



    // Get Block By Height
    getBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function (resolve, reject) {
            self.getBlockHeight().then((blockHeight) => {
                if (height >= 0 && height <= blockHeight) {
                    resolve(self.bd.getBlock(height));
                } else {
                    reject(' Block height is invalid!');
                }
            });
        });

    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        return new Promise((resolve, reject) => {
            self.getBlock(height).then((blockData) => {
                let block = JSON.parse(blockData);
                let blockHash = block.hash;
                if (block.hash) {
                    block.hash = '';
                }
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (validBlockHash === blockHash) {
                    resolve(true);
                } else {
                    reject(true);
                }
            });
        });
    }

    // Validate Blockchain
    validateChain() {
        // Add your code here
        const ChainPD = [];
        const chainLinkValidations = [];
        this.bd.getBlocksCount().then((chainHeight) => {
            for (var i = 0; i < chainHeight - 1; i++) {
                ChainPD.push(this.validateBlock(i));
                const currentBlockData = this.getBlockOnHeight(i);
                const nextBlockData = this.getBlockOnHeight(i + 1);
                if (currentBlockData && nextBlockData) {
                    const currentBlock = currentBlockData;
                    const nextBlock = nextBlockData;
                    if (currentBlock.hash !== nextBlock.previousBlockHash) {
                        chainLinkValidations.push(i);
                    }
                }
            }
        }).catch((error) => {
            console.log(error);
        });
        console.log( new Promise(function (resolve, reject) {
            Promise.all(ChainPD).then(() => {
                resolve(chainLinkValidations);
            }, (error) => {
                console.log('Error with validation' + error);

                reject(`Error with validation'! ${error}`);

            });
        }));

    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        return new Promise((resolve, reject) => {
            this.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((error) => { console.log(error); reject(error) });
        });
    }

}

module.exports.Blockchain = Blockchain;
