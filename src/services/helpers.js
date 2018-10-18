/*
 * Helpers for various tasks
 * 
 */

 // Dependencies
 const crypto = require('crypto');
 const config = require('../config')

 // Container
 const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str){
    if(typeof(str)== 'string' && str.length>0){
        const hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

// Parse a JSON string to an obhect in all cases, without throwing
helpers.parseJsonToObject =function(str){
    try{
        const obj = JSON.parse(str)
        return obj;
    }catch(e){
        return {};
    }
}

// Create a string of random characters
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // Define all the possible characters that could go intoa string
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Construct random string
        let str = '';
        for(i = 1; i <= strLength; i++){
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));
            str += randomChar;
        }
        return str;
    }else{
        return false;
    }
}

 // Export module
 module.exports = helpers;

