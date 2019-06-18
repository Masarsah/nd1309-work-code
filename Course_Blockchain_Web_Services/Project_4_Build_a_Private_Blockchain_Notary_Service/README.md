# Project #4. Build a Private Blockchain Notary Service

This is Project 4, In this project,I build a Star Registry Service that allows users to claim ownership of their favorite star in the night sky. .

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __nodemon or node index.js__ in the root directory.

## Testing the project

The file __index.js__ in the root directory has the server up and running in localhost
http://localhost:8000/  to be able to test the endpoint , you could use Postman:

*  to Test this routes in Postman:


 1.  Validate User Request
         
  Method  `POST `
    ```
    http://localhost:8000/requestValidation
    ```
    
    

```curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
}'
```
    
Sucsseful Responce :
   ``` 
   {
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1541605128",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
    "validationWindow": 300
}
```

2.  Validate Message Signature.
     
     Method    `POST `
     
 
 ```
http://localhost:8000/message-signature/validate
```

  ``` curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
"address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
 "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}'
```
Sucsseful Responce :
```{
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1541605128",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
        "validationWindow": 200,
        "messageSignature": true
    }
}
```

   3.  Adds a new block to the database.
     
  Method `POST `
     
```
http://localhost:8000/block
```

```
{
"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}
```
    
  4. returns a Block from the database by Height.
     
  Method  `GET `
     
```
http://localhost:8000/block/[height]
```

 5. returns a Block from the database by Wallet Address .
     
Method  `GET `

```
http://localhost:8000/stars/address:[ADDRESS]
```

     
 6.  returns a Block from the database by Star Block Hash .
               Method `GET `
     

```
http://localhost:8000/stars/hash:[HASH]
```





