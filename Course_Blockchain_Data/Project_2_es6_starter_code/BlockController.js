const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const LevelSandbox = require('./LevelSandbox.js');

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
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        this.db = new LevelSandbox.LevelSandbox();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code here
            let key = req.params.index
            // console.log(req.params.index)
            this.db.getBlock(key).then((res) =>{
            //  console.log(res)
              res.json(res)
            })
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock(newBlock) {
        this.app.post("/block", (req, res) => {
            // Add your code here
            let self = this;
            let hash = SHA256(JSON.stringify(newBlock)).toString();
            let height = req.params.index
            let body = req.body.data
            let time = new Date().getTime().toString().slice(0, -3);
            const previousBlock = JSON.parse(blockData);
            previousBlock.hash = body.previousBlockHash;
            body.hash = SHA256(JSON.stringify(body)).toString();
            res.json("Adding Block", ({
                hash,
                height,
                body,
                time,
                previousBlockHash

            }))


        });
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