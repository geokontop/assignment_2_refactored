/*
 * Post order
 * 
 */

// Dependencies
const _data = require('../../../models/data');
const _userData = require('../../../models/user/userData');
const _shoppingCartData = require('../../../models/shoppingCart/shoppingCartData');
const stripe = require('../../../services/stripe');
const mailgun = require('../../../services/mailgun');
const validator = require('../../../services/validators');
const _orderData = require('../../../models/orders/orderData');


// Post
// Required data : none
// Optional data : none
// Required header : token
const post = function(data,callback){
        
    // Get the token from the headers
    const token = validator.validateToken(data.headers.token) ? data.headers.token:false;
    // Retrieve token object        
    _data.read('tokens',token,function(err,tokenData){
        // Check authentication
        if(!err && tokenData){
            // Check if the token has not expired
            if(tokenData.expires > Date.now()){ 
                // Retrieve user 
                _userData.getUserByEmail(tokenData.email,(user)=>{
                    if(user){
                        // Retrieve cart
                        _shoppingCartData.getCartDetailsByToken(token,(cartDetails)=>{
                            if(cartDetails){
                                stripe.checkOut(cartDetails.total,user.email,(status)=>{                                        
                                    if(!status){   
                                        console.log({'Message': 'Payment received .. sending message'});
                                        //If the payment is successful. Send the mail
                                        mailgun.sendEmail(user.email, user.name, 'Your order details '+ user.name, 'some template populated with .... '+JSON.stringify(cartDetails),(res)=>{
                                            if(!res){
                                                _orderData.saveOrder(token,cartDetails,user,(saved)=>{
                                                    if(saved){
                                                        callback(200,{'Message': 'Payment received, message has been sent and order has been logged'})
                                                    }else{
                                                        callback(400, {'Error': 'Could not log order'})
                                                    }
                                                });
                                            }else{
                                                callback(400, {'Error': res});
                                            }
                                        });
                                    }
                                    else{
                                        callback(400, {'Error': 'There was some error receiving the payment,Please try again.'});
                                    }
                                });
                            }else{
                                callback(400, {'Error':'Cart record not found'});
                            }
                        });
                    }else{
                        callback(400, {'Error':'User record not found'})
                    }
                });
            }else{
                // Token too old
                callback(400,{'Error':'Time expired. Token not valid'});
            }
        }else{
            // Not authenticated
            callback(400,{'Error':'Authentication error'});
        }
    });  
}

// Export post function
module.exports= post ;