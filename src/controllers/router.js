/*
 * Routing handlers overview
 * 
 */

// Dependencies
const usersMethods = require('./_users/methods')
const tokensMethods = require('./_tokens/methods')
const pizzasMethods = require('./_pizzas/methods')
const menuMethods = require('./_menu/methods')
const cartsMethods = require('./_shoppingCarts/methods')
const orderMethods = require('./_order/methods')

// Define the handlers
const handlers = {};

/*--------- Users -----------*/
// Users handler
handlers.users =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Users submethods
handlers._users = usersMethods;

/*--------- Tokens -----------*/
// Tokens handler
handlers.tokens =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Tokens submethods
handlers._tokens = tokensMethods;

/*--------- Pizzas -----------*/
// Pizzas handler
handlers.pizzas =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._pizzas[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Pizzas submethods
handlers._pizzas = pizzasMethods;

/*--------- Menu -----------*/
// Menu handler
handlers.menu =function(data, callback){
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._menu[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Menu submethods
handlers._menu = menuMethods;

/*--------- Carts -----------*/
// Carts handler
handlers.carts =function(data, callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._shoppingCarts[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Carts submethods
handlers._shoppingCarts = cartsMethods;

/*--------- Carts -----------*/
// Order handler
handlers.order =function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._order[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Carts submethods
handlers._order = orderMethods;
//----------.....---------


// Ping handler
handlers.ping =function(data, callback){
    // Callback a http status code, and a payload object
    callback(200,'pong');
}

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

// Define a request router
const router = {
    'order' : handlers.order,
    'carts' : handlers.carts,
    'menu' : handlers.menu,
    'pizzas' : handlers.pizzas,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'ping' : handlers.ping,
    'notFound' : handlers.notFound
}

module.exports = router;