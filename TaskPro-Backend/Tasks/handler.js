'use strict';
const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

exports.Tasks = (event, context, callback) => {
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
    const userObj = event.requestContext.authorizer.claims
  
   var item = JSON.parse(event.body);
           item.Id =  uuidv1();
           item.CreatedBy = userObj.sub;
           item.UpdatedBy = userObj.sub;
           item.CreatedTs = Date.now();
           item.LastUpdatedTs = Date.now();
        if(item.ContactId&&item.WorkStreamId&&item.OrgId){
           databaseManager.saveItem(item).then(response => {
             

                      sendResponse(200, JSON.stringify(response), callback); 
                   
           });
        }else{
            sendResponse(400, JSON.stringify('OrgId,ContactId and WorkStreamId are Required Fields'), callback); 

        }

   
}


function getItem(event, callback) {
const queryParam = event.queryStringParameters;
    const userObj = event.requestContext.authorizer.claims
    
            if (event.pathParameters) {


                const itemId = event.pathParameters.Id;

		databaseManager.getItem(itemId).then(response => {
			console.log(response);
			
			 if(response){
                
               sendResponse(200, JSON.stringify(response), callback);
          }else{
               sendResponse(400, JSON.stringify('No data found'), callback); 
          }
		});
    }else if(queryParam){
        if(queryParam['WorkStreamId']){
            	const params = {

		TableName: 'Tasks',

			FilterExpression:'CreatedBy = :CreatedBy And WorkStreamId=:WorkStreamId',
			ExpressionAttributeValues:{ 
			    ":CreatedBy" : userObj.sub,
			    ":WorkStreamId":queryParam['WorkStreamId']
			    }

            }
             databaseManager.getFilteredTasks(params).then(response => {
			
			
			 if(response){
                addWSName(response,userObj,callback)
                
          }else{
               sendResponse(400, JSON.stringify('No data found'), callback); 
          }
		});
            
        }
        
        
        
    }else{
        databaseManager.getAllItems(userObj.sub).then(response => {
			
			
			 if(response){
                addWSName(response,userObj,callback)
                
          }else{
               sendResponse(400, JSON.stringify('No data found'), callback); 
          }
		});

        }


		
           
        
     
    
}
async function addWSName(Tasks,UserObj,callback){
  
  
var arr=[];
   for  (const task of Tasks) {
            
 

const workstream =await databaseManager.getWorkStream(task.WorkStreamId)
const contact =await databaseManager.getContact(task.ContactId)
			     
			     task['WorkStreamName']=workstream.Item['Name']
			     task['ContactName']=contact.Item['FirstName']+' '+contact.Item['LastName']
			     arr.push(task)



			
    }
    sendResponse(200, JSON.stringify(arr), callback); 

}

function updateItem(event,callback){
    const userObj = event.requestContext.authorizer.claims
    const itemId = event.pathParameters.Id;

    databaseManager.getItem(itemId).then(response => {
        console.log(response);
        
         if(response){
             if(response.CreatedBy==userObj.sub){
                update(event, callback)
        }else{
            sendResponse(400, JSON.stringify('YOu are not Auhorized to Update this'), callback); 
        }
           
      }else{
           sendResponse(400, JSON.stringify('No data found'), callback); 
      }
    });
    
}
function update(event, callback) {

    const itemId = event.pathParameters.Id;
    const userObj = event.requestContext.authorizer.claims
  
   const body = JSON.parse(event.body);
    
    delete body.CreatedTs
    delete body.CreatedBy
  
    


    body.UpdatedBy = userObj.sub;
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
        ExpressionAttributeValues).then(resp => {
       
        sendResponse(200, JSON.stringify(resp), callback);

    });

      
      
 
}


function deleteItem(event, callback) {
       const userObj = event.requestContext.authorizer.claims
    const itemId = event.pathParameters.Id;

    databaseManager.getItem(itemId).then(response => {
        console.log(response);
        
         if(response){
             if(response.CreatedBy==userObj.sub){
            databaseManager.deleteItem(itemId).then(response => {
                sendResponse(200, 'Item Deleted', callback);
            });
        }else{
            sendResponse(400, JSON.stringify('YOu are not Auhorized to delete this'), callback); 
        }
           
      }else{
           sendResponse(400, JSON.stringify('No data found'), callback); 
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