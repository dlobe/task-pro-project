'use strict';
const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

exports.Meetings = (event, context, callback) => {
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
        if(item.ContactIds&&item.WorkStreamId&&item.OrgIds&&item.TaskIds){
           databaseManager.saveItem(item).then(response => {
             

                      sendResponse(200, JSON.stringify(response), callback); 
                   
           });
        }else{
            sendResponse(400, JSON.stringify('OrgIds,ContactIds,TaskIds and WorkStreamId are Required Fields'), callback); 

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

		TableName: 'Meetings',

			FilterExpression:'CreatedBy = :CreatedBy And WorkStreamId=:WorkStreamId',
			ExpressionAttributeValues:{ 
			    ":CreatedBy" : userObj.sub,
			    ":WorkStreamId":queryParam['WorkStreamId']
			    }

            }
            
             databaseManager.getFilteredMeetings(params).then(response => {
			
			
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
async function addWSName(Meetings,UserObj,callback){
  
  
var arr=[];
   for  (const meeting of Meetings) {
            
 

const workstream =await databaseManager.getWorkStream(meeting.WorkStreamId)
var contactObject=arraytoQueryObject(meeting.ContactIds)
 var filterQuery =  "Id IN (" + Object.keys(contactObject).toString() + ")";
                
                var expVal =  contactObject;
                
    const params = {

		TableName: 'Contacts',

			FilterExpression:filterQuery,
			ExpressionAttributeValues:expVal
            }
        
const contact =await databaseManager.getFilteredData(params)
			   
var tastObject=arraytoQueryObject(meeting.TaskIds)
 var filterQuery =  "Id IN (" + Object.keys(tastObject).toString() + ")";
                
                var expVal =  tastObject;
                
    const paramTasks = {

		TableName: 'Tasks',

			FilterExpression:filterQuery,
			ExpressionAttributeValues:expVal
            }
        
const task =await databaseManager.getFilteredData(paramTasks)	

var orgObject=arraytoQueryObject(meeting.OrgIds)
 var filterQuery =  "Id IN (" + Object.keys(orgObject).toString() + ")";
                
                var expVal =  orgObject;
                
    const paramorgObject = {

		TableName: 'Organizations',

			FilterExpression:filterQuery,
			ExpressionAttributeValues:expVal
            }
   
        
const orgs =await databaseManager.getFilteredData(paramorgObject);

			     meeting['WorkStreamName']=workstream.Item['Name']
			     meeting['Contacts']=contact
			     meeting['Tasks']=await addWSNameForTasks(task)
			     meeting['Organizations']=orgs
			     arr.push(meeting)



			
    }
    sendResponse(200, JSON.stringify(arr), callback); 

}


async function addWSNameForTasks(Tasks){
  
  
var arr=[];
   for  (const task of Tasks) {
            
 

const workstream =await databaseManager.getWorkStream(task.WorkStreamId)
const contact =await databaseManager.getContact(task.ContactId)
			     
			     task['WorkStreamName']=workstream.Item['Name']
			     task['ContactName']=contact.Item['FirstName']+' '+contact.Item['LastName']
			     arr.push(task)



			
    }
  
return arr;
}
function arraytoQueryObject(titleValues) {
    var titleObject = {};
    var index = 0;

    titleValues.forEach(function (value) {
        index++;
        var titleKey = ":key" + index;
        titleObject[titleKey.toString()] = value;
    });
    return titleObject;
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