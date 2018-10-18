/*
 * Receive request, choose routing handler and route
 * 
 */

// Dependencies
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('../services/helpers');

const bufferPayload = function(req,callback){
    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();
        callback(buffer)
    })
}

const listenerMethod   = function(router,req,res){
     
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url,true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the http method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Construct the data-object to send to the handler
    const data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method': method,
        'headers': headers
    };

    // Choose the handler the request should go to. If one is not found, use the notFound handler.
    const chosenHandler = typeof(router[trimmedPath])!= 'undefined'? router[trimmedPath]:router['notFound'];

    bufferPayload(req,function(buffer){
        
        data.payload = helpers.parseJsonToObject(buffer)
        // Route the request to the chosen handler  
        chosenHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler or default to 200
            statusCode= typeof(statusCode) == 'number'? statusCode:200;

            // Use the payload called back by the handler or default to empty object
            payload= typeof(payload) == 'object' || typeof(payload) == 'string'? payload:data.buffer;

            // Convert the payload to a string
            payloadString = JSON.stringify(payload);

            // Write response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString)


        })
    });
}

module.exports = listenerMethod;