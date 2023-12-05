'use strict';

const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const poolData = {    
    UserPoolId : process.env.poolId, // Your user pool id here    
    ClientId : process.env.clientId 
    }; 
    const pool_region = 'us-east-1';
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


exports.ForgetPasswordMethod = (event, context, callback) => {
    
            
              switch (event.httpMethod) {
        case 'POST':
            ForgetPassword(event, callback);
            break;
        case 'PUT':
            resetpassword(event, callback);
            break;
        default:
            sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
    }
      
}
function ForgetPassword(event, callback){
    const userParams = JSON.parse(event.body);



    var userData = {
        Username : userParams["Username"],
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.forgotPassword({
        onSuccess: function (result) {
        
			sendResponse(200, JSON.stringify(result), callback);
        },
        onFailure: function(err) {
            console.log(err);
            sendResponse(400, JSON.stringify(err), callback) 
        },

    });
}
function resetpassword(event, callback){
        const userParams = JSON.parse(event.body);



    var userData = {
        Username : userParams["Username"],
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.confirmPassword(userParams["verificationCode"],userParams["newPassword"],{
        onSuccess: function (result) {
        
			sendResponse(200, JSON.stringify(result), callback);
        },
        onFailure: function(err) {
            console.log(err);
            sendResponse(400, JSON.stringify(err), callback) 
        },

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