'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

const AWS = require('aws-sdk');

exports.AppContent = (event, context, callback) => {
    switch (event.httpMethod) {
        case 'DELETE':
            deleteItem(event, callback);
            break;
        case 'GET':
            getItem(event, callback);
            break;
        case 'POST':
            saveItem(event, callback);
            break;
        case 'PUT':
            updateItem(event, callback);
            break;
        case 'OPTIONS':
            sendResponse(200, JSON.stringify('OPTIONS'), callback);
            break;
        default:
            sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
    }
};
function saveItem(event, callback) {
 
     var item = JSON.parse(event.body);
		if(item.Screen){
       
     
        item.Id = item.Screen;
  
        item.CreatedTs = Date.now();
        item.lastUpdatedTs = Date.now();

        databaseManager.saveItem(item).then(response => {
            console.log(response);
            sendResponse(200, JSON.stringify(response), callback);
        });
		}else{
			sendResponse(400, JSON.stringify('Missing Required Attribure Screen'), callback);
			
		}
       

   


}


function getItem(event, callback) {




    if (event.pathParameters) {


    const itemId = event.pathParameters.Id;
        databaseManager.getItem(itemId).then(response => {
            console.log(response);
            if (response != null && response != undefined) {
                sendResponse(200, JSON.stringify(response), callback);
            } else {
                sendResponse(400, "No Data found", callback);

            }
        });



    } else {
        databaseManager.getAllItems().then(response => {
            console.log(response);
            
            sendResponse(200, JSON.stringify(response), callback);
        });
    }



}


function updateItem(event, callback) {

    const itemId = event.pathParameters.Id;
  
       
 const body = JSON.parse(event.body);
  
    delete body.CreatedTs
    delete body.Id
  


    body.lastUpdatedTs = Date.now();


    let updateExpression = 'set';
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    for (const property in body) {
        updateExpression += ` #${property} = :${property} ,`;
        ExpressionAttributeNames['#' + property] = property;
        ExpressionAttributeValues[':' + property] = body[property];
    }


    console.log(ExpressionAttributeNames);

    updateExpression = updateExpression.slice(0, -1);

    
    databaseManager.updateItem(itemId,
        updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues).then(response => {
        console.log(response);
        sendResponse(200, JSON.stringify(response), callback);

    });
   

   

}


function deleteItem(event, callback) {
    const itemId = event.pathParameters.Id;
  
        databaseManager.deleteItem(itemId).then(response => {
            sendResponse(200, 'DELETE ITEM', callback);
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