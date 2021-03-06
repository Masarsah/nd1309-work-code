const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const LevelSandbox = require('./LevelSandbox.js');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const bitcoinMessage = require('bitcoinjs-message');



const TimeoutRequestsWindowTime = 3000000;
const ValidTimeoutRequestsWindowTime = 180000;
/**
 * Controller Definition to encapsulate routes to work with blocks
 */

class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize all your endpoints here
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.db = new LevelSandbox.LevelSandbox();
        this.blockChain = new BlockChain.Blockchain();
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        this.timeoutRequests = [];
        this.memPool = [];
        this.requestValidation();
        this.addRequestValidation();
        this.getBlockByHash();
        this.getBlockByAddress();
    }

    /**
    * Implement a POST Endpoint to validate , url: "/requestValidation"
    */


    requestValidation() {
        let self = this;

        self.app.post("/requestValidation", (req, res) => {
            // Add your code here
            if (req.body) {
                const walletAddress = req.body.address;
                const requestTimeStamp = Date.now();
                let response = {
                    "walletAddress": req.body.address,
                    "requestTimeStamp": requestTimeStamp,
                    "message": `${req.body.address}:${requestTimeStamp}:StarRegistry`,
                    "validationWindow": 300,
                }
                if (this.timeoutRequests[walletAddress]) { // Request is already in mempool.
                    console.log(this.timeoutRequests[walletAddress])
                    const TimeoutRequestsWindowTime = this.timeoutRequests[walletAddress];
                    console.log(TimeoutRequestsWindowTime)

                    const timeElapse = (TimeoutRequestsWindowTime.requestTimeStamp - requestTimeStamp);
                    console.log(timeElapse)
                    TimeoutRequestsWindowTime.validationWindow = TimeoutRequestsWindowTime.validationWindow - timeElapse;
                    TimeoutRequestsWindowTime.requestTimeStamp = requestTimeStamp;
                    // Re-created this message since the timestamp is changed.
                    TimeoutRequestsWindowTime.message = `${walletAddress}:${requestTimeStamp}:StarRegistry`
                    response = TimeoutRequestsWindowTime;
                } else {
                    this.timeoutRequests[walletAddress] = response;
                    console.log(this.timeoutRequests[walletAddress], 'else')

                    this.timeoutRequests[`${walletAddress} `] = setTimeout(() => {
                        //Mempool clear 
                        if (this.timeoutRequests[walletAddress]) {
                            delete this.timeoutRequests[walletAddress];
                            delete this.timeoutRequests[`${walletAddress} `];

                        }
                    }, TimeoutRequestsWindowTime); // 5 Minute window ( time in milliseconds)  

                }
                res.send(response);
            } else {
                res.send(' Make sure to write data');
            }
        });
    }

    /**
     * Implement a POST Endpoint to allow User to send a validation request, url: "/message-signature/validate "
     */
    addRequestValidation() {
        this.app.post("/message-signature/validate", (req, res) => {
            const walletAddress = req.body.address;
            const signature = req.body.signature;
            const requestTimeStamp = Date.now();
            let validRequest = false
            if (this.memPool[`${walletAddress}`]) {
                const isValidRequest = {
                    ...this.memPool[walletAddress]
                };
                console.log(isValidRequest.status, 'lol')
                const timeElapse = (requestTimeStamp - isValidRequest.status.requestTimeStamp);
                isValidRequest.status.validationWindow = isValidRequest.status.validationWindow - timeElapse;
                isValidRequest.status.requestTimeStamp = requestTimeStamp;
                isValidRequest.status.message = `[${signature}]:[${requestTimeStamp}]:starRegistry`;
                res.json(isValidRequest);
            } else {
                console.log(walletAddress)
                console.log(this.timeoutRequests[walletAddress], 'try before the function')
                validRequest = this.validateRequestByWallet(walletAddress, signature);
                console.log(validRequest)
                if (validRequest) {
                    const isValidRequest = {
                        "registerStar": true,
                        "status": {
                            "address": walletAddress,
                            "requestTimeStamp": requestTimeStamp,
                            "message": `${signature}:${requestTimeStamp}:starRegistry`,
                            "validationWindow": this.timeoutRequests[walletAddress].validationWindow,
                            "messageSignature": validRequest
                        }
                    }

                    this.memPool[walletAddress] = {
                        ...isValidRequest
                    };
                    // Remove in valid req after 30 Minutes 
                    this.memPool[walletAddress] = setTimeout(() => {
                        if (this.memPool[walletAddress]) {
                            delete this.memPool[walletAddress];
                        }
                    }, ValidTimeoutRequestsWindowTime);

                    // Remove it from timeout request 
                    if (this.timeoutRequests[walletAddress]) {
                        delete this.timeoutRequests[walletAddress];
                    }
                    res.json(isValidRequest);
                    // return isValidRequest
                    // console.log(isvalidRequest)
                    console.log(JSON.parse(JSON.stringify(isValidRequest)))
                } else {
                    console.log('error ');
                    res.status(404).end()
                    console.log("error not valid ")
                }
                console.log("else in validateRequestByWallet ")
            }

        });
    }

    /**
    * Implement a function to validate Req by wallet
    */
    validateRequestByWallet(walletAddress, signature) {
        console.log(walletAddress)
        console.log(signature)
        let validRequest = false
        console.log(this.timeoutRequests[walletAddress].validationWindow, 'validateRequestByWallet')

        // console.log(Object.keys(this.timeoutRequests.walletAddress[validationWindow]), 'walletAddress');
        // console.log(this.timeoutRequests.walletAddress[validationWindow], 'timeoutRequests');

        if (this.timeoutRequests[walletAddress].validationWindow > 0) {
            const message = this.timeoutRequests[walletAddress].message;
            console.log('Message validate Request By Wallet :', message);
            validRequest = bitcoinMessage.verify(message, walletAddress, signature);
            console.log('Type of Request validate Request By Wallet :', validRequest);
        } else {
            validRequest = false;
            console.log('', validRequest);

        }
        return validRequest;
    }


    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     */

    getBlockByIndex() {
        let self = this;

        self.app.get("/block/:index", (req, res) => {
            // Add your code here
            let key = req.params.index
            // console.log(req.params.index)
            self.blockChain.getBlock(key).then((result) => {
                // to opject
                const block = JSON.parse(result);
                // Decoding ascii To hex  
                block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'base64').toString('ascii')
                res.json(block)
            }).catch((err) => {
                console.log('error ', err);
                res.json('block not found ')
                throw res.status(404).end()
            });
        });
    }

    

    /**
         * Implement a GET Endpoint to retrieve a block by hash, url: "/block/hash:{HASH}"
         */
    getBlockByHash() {
        let self = this;

        self.app.get("/stars/hash::HASH", (req, res) => {
            // Add your code here
            let hash = req.params.HASH
            // console.log(req.params.hash)
            self.blockChain.getBlockByHash(hash).then((result) => {
                res.json(result)
            }).catch((err) => {
                console.log('error ', err);

                throw res.status(404).end()
            });
        });
    }

    /**
         * Implement a GET Endpoint to retrieve a block by address, url: "/block/address:{address}"
         */
    getBlockByAddress() {
        let self = this;

        self.app.get("/stars/address::address", (req, res) => {
            // Add your code here
            let walletAddress = req.params.address
            console.log(req.params.address)
            if (walletAddress) {
                self.blockChain.getBlockByAddress(walletAddress).then((result) => {
                    res.json(result)
                }).catch((err) => {
                    console.log('error ', err);
                    res.send(`Invalid Address ${walletAddress}`)
                    throw res.status(404).end()
                });
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */

    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            if (req.body) {
                console.log(req.body);
                console.log(this.memPool && this.memPool[req.body.address]);
                // to opject 
                if (this.memPool && this.memPool[req.body.address]) {
                    if (Array.isArray(req.body.star)) {
                        console.log(req.body.star, 'Array');
                        console.log('error Array');
                        res.status(406).end();
                    } else {
                        //  Encoding hex To ascii for
                        req.body.star.story = Buffer.from(req.body.star.story).toString('base64');
                        let newBlock = new Block.Block(req.body);
                        console.log(newBlock, 'Before');
                        this.blockChain.addBlock(newBlock).then((block) => {
                            // return block
                            res.send(`Adding block sucssed' ,${block}`)
                            // res.send(newBlock)
                            delete this.memPool[req.body.address];
                            delete this.timeoutRequests[req.body.address];

                            console.log(block)
                        }).catch((err) => {
                            console.log(err);
                            // res.send(`Adding block failed ${err}`);
                        });
                    }

                } else {
                    console.log('error');
                    res.send('Request Validation again on http://localhost:8000/requestValidation')
                    res.status(400).end();
                }
            } else {
                console.log('error');
                res.send('Make sure to write some data')
                res.status(400).end();
            }
        })
    }

    /**
     * Helper method to initialize a Mock dataset. It adds 10 test blocks to the blocks array.
     */
    initializeMockData() {
        if (this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }