var Web3 = require('web3')
var EthereumTransaction = require("ethereumjs-tx")

var url = 'HTTP://127.0.0.1:8545' // 8545 if using ganache-cli

var web3 = new Web3(url)


web3.eth.getTransactionCount('0x934528b8fe8cf017ada739f823ad58a021ea949e').then(console.log);

















// var sendingAddress = '0xcc359128a71a4b1bb50e46175fc527c60e8a0f8f'
// var receivingAddress = '0x143fd442a79af4746b213a0b916d15fb4bf7b2d5';

// web3.eth.getBalance(sendingAddress).then(console.log)
// web3.eth.getBalance(receivingAddress).then(console.log)


// var rawTransaction = {
//     nonce: 1, 
//     to: receivingAddress,
//     gasPrice: 20000000,
//     gasLimit: 30000,
//     value: 100,
//     data: ""
// }

// var privateKeySender = 'c0cfffa063fe04ff435b1a9b80686c2c5327e6f17000cbeb8def790239f0addd' 
// var privateKeySenderHex = Buffer.from(privateKeySender, 'hex') 
// console.log(privateKeySenderHex)
// var transaction = new EthereumTransaction(rawTransaction) 
// transaction.sign(privateKeySenderHex)

// var serializedTransaction = transaction.serialize(); 
// web3.eth.sendSignedTransaction(serializedTransaction);
