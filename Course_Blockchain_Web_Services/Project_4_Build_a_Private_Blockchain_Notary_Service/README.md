# Project #3. Connect Private Blockchain to Front-End Client via APIs

This is Project 3, Connect Private Blockchain to Front-End Client via APIs, in this project I created the GET and POST endpoint using node Express framework  .

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __nodemon or node index.js__ in the root directory.

## Testing the project

The file __index.js__ in the root directory has the server up and running in localhost
http://localhost:8000/  to be able to test the endpoint , you could use Postman:

*  to Test this routes in Postman:


     1.  `POST ` - Validate User Request
     
    ```
    http://localhost:8000/requestValidation
    ```
     
     2.  `POST ` -Validate Message Signature
         ```
http://localhost:8000/message-signature/validate
    ```

     3.  `POST ` - adds a new block to the database.
              ```
http://localhost:8000/block
    ```
     
     4.  `GET /block/0` - returns a Block from the database by Height .
     ```
http://localhost:8000/block/[height]
```


     5.  `GET /stars/address:[ADDRESS]` - returns a Block from the database by Wallet Address .
     ```
http://localhost:8000/stars/address:[ADDRESS]
```

     
     6.  `GET /stars/hash:[HASH]` - returns a Block from the database by Star Block Hash .
     ```
http://localhost:8000/stars/hash:[HASH]
```





