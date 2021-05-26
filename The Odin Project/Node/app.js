const http = require('http');
const time = require('./module');
const url = require('url');

http.createServer((req, res) => {
    //add a header to response
    res.writeHead(200, {'content-type': 'text/html'}); 
   
    //write a response to the client
    res.write(req.url); 

    //URL & query string parsing
    const qs = url.parse(req.url, true);

    /**
     * You can only send back responses as a strings
     * so whenever you want to send back an object
     * you have to make it a string with JSON.stringify()
     */
    res.write(JSON.stringify(qs))

    res.end(); // end the response
}).listen(5000); // listen to server on port 5000

