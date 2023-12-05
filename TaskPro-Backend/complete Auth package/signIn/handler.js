'use strict';
const uuidv1 = require('uuid/v1');

const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const poolData = {    
    UserPoolId : process.env.poolId, // Your user pool id here    
    ClientId : process.env.clientId // Your client id here
    }; 
    const pool_region = 'us-east-1';
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.SignInMethod = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'POST':
            SignIn(event, callback);
            break;
        case 'PUT':
            RefreshToken(event, callback);
            break;
        default:
            sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
    }
	
}
function SignIn(event, callback){
    const userParams = JSON.parse(event.body);


    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(userParams);

    var userData = {
        Username : userParams["Username"],
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const tokens={
                accessToken:result.getAccessToken().getJwtToken(),
              //  payLoad:result.getAccessToken().getPayload(),
                idToken:result.getIdToken(),
                refreshToken:result.getRefreshToken().getToken()
            }
            
			sendResponse(200, JSON.stringify(tokens), callback);
        },
        onFailure: function(err) {
            console.log(err);
            sendResponse(400, JSON.stringify(err), callback) 
        },

    });
}
function RefreshToken(event, callback){
    const userParams = JSON.parse(event.body);
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: userParams.refreshToken});


    const userData = {
        Username: userParams["Username"],
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            sendResponse(400, JSON.stringify(err), callback) 
        } else {
            let retObj = {
                "accessToken": session.accessToken.jwtToken,
                "idToken": session.idToken,
                "refreshToken": session.refreshToken.token,
            }
			sendResponse(200, JSON.stringify(retObj), callback);
        }
    })

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