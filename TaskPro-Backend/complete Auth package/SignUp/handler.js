'use strict';

const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});
const cognitoClientId=process.env.clientId
exports.CognitoAuthMethod = (event, context, callback) => {
    	const userParams = JSON.parse(event.body);
    	    userParams.ClientId=cognitoClientId

if(userParams.type=='SignUp'){
    delete userParams['type']
    
    RegisterUser(userParams,callback);
}else if (userParams.type=='confirmSignUp'){
        delete userParams['type']
    console.log(JSON.stringify(userParams))
    confirmSignUp(userParams,callback);
   
}else if(userParams.type=='resendConfirmationCode'){
    delete userParams['type']
    resendConfirmationCode(userParams,callback)
}

}

function RegisterUser(userParams,callback){

        cognitoidentityserviceprovider.signUp(userParams, function(err, data) {
		if (err){ console.log(err, err.stack); 
			sendResponse(400, JSON.stringify(err.stack), callback);
		}
        else{
			sendResponse(200, JSON.stringify(data), callback);
			// resp200ok.body = JSON.stringify(data); callback(null, resp200ok);
			 }
    });
    
}
function confirmSignUp(userParams,callback){
//      var userParams = {
//   ConfirmationCode: 'STRING_VALUE', /* required */
//   Username: 'STRING_VALUE',
//     }
// }
        cognitoidentityserviceprovider.confirmSignUp(userParams, function(err, data) {
		if (err){ console.log(err, err.stack); 
			sendResponse(400, JSON.stringify(err.stack), callback);
		}
        else{
			sendResponse(200, JSON.stringify(data), callback);
			 }
    });
    
}
function resendConfirmationCode(userParams,callback){

  

      cognitoidentityserviceprovider.resendConfirmationCode(userParams, function(err, data) {
        if (err) {
           
            sendResponse(400, JSON.stringify(err.stack), callback);
        } else {
            sendResponse(200, JSON.stringify(data), callback);
        }
    });

}

function sendResponse(statusCode, message, callback) {
    const response = {
        statusCode: statusCode,
        body: message,
        isBase64Encoded: true,
        headers: {
            "X-Requested-With": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
        },
    };
    callback(null, response);
}