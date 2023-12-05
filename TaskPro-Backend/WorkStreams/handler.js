'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

exports.WorkStreams = (event, context, callback) => {
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
        if(!item.OrgId){
           databaseManager.saveItem(item).then(response => {
             

                      sendResponse(200, JSON.stringify(response), callback); 
                   
           });
     
        }else{
            sendResponse(400, JSON.stringify('Missing Required Field OrgId'), callback); 

        }

   
}


function getItem(event, callback) {

    const userObj = event.requestContext.authorizer.claims
    
            if (event.pathParameters) {


                const itemId = event.pathParameters.Id;

		databaseManager.getItem(itemId).then(response => {
			console.log(response);
			
			 if(response){
                getWSDetails(response, userObj, callback);                
             //  sendResponse(200, JSON.stringify(response), callback);
          }else{
               sendResponse(400, JSON.stringify('No data found'), callback); 
          }
		});
    }else{
        databaseManager.getAllItems(userObj.sub).then(response => {
			
			
			 if(response){
               sendResponse(200, JSON.stringify(response), callback); 
                
          }else{
               sendResponse(400, JSON.stringify('No data found'), callback); 
          }
		});

        }


		
           
        
     
    
}
async function getWSDetails(WS, userObj, callback){
    
    const paramMeetings = {
        TableName: 'Meetings',
        FilterExpression: 'WorkStreamId = :WorkStreamId',
        ExpressionAttributeValues: {
            ":WorkStreamId": WS.Id
        }
     }
    const Meetings = await databaseManager.getFilteredItems(paramMeetings)
    var ContactIds = []
    var OrgIds = []
    for (const obj of Meetings) {
         if (obj['ContactIds']) {
             
           ContactIds=  ContactIds.concat(obj['ContactIds'])
           
         }
        if (obj['OrgIds']) {
             
           OrgIds=  OrgIds.concat(obj['OrgIds'])
           
         }
     }

    const paramTasks = {
        TableName: 'Tasks',
        FilterExpression: 'WorkStreamId =:WorkStreamId',
        ExpressionAttributeValues: {
            ":WorkStreamId": WS.Id
        }
    }
    const Tasks = await databaseManager.getFilteredItems(paramTasks)
      //   for (const obj of Tasks) {
    //      if (obj.ContatId) {
    //          ContactIds.push(obj.ContatId)
    //      }
    //  }

     var Contacts=[]
try {

     var contactObject = arraytoQueryObject(ContactIds)
     var filterQuery = "Id IN (" + Object.keys(contactObject).toString() + ")";

     var expVal = contactObject;
     const paramContacts = {

         TableName: 'Contacts',

         FilterExpression: filterQuery,
         ExpressionAttributeValues: expVal
     }
     console.log(paramContacts)

     Contacts = await databaseManager.getFilteredItems(paramContacts)
} catch (e) {
    Contacts=[]
    
}

     var Orgs=[]
try {
     var orgObject = arraytoQueryObject(OrgIds)
     var filterQuery = "Id IN (" + Object.keys(orgObject).toString() + ")";

     var expVal = orgObject;

     const paramOrgs = {

         TableName: 'Organizations',

         FilterExpression: filterQuery,
         ExpressionAttributeValues: expVal
     }
     console.log(paramOrgs)

     Orgs = await databaseManager.getFilteredItems(paramOrgs)
} catch (e) {
    Orgs=[]
    
}

        WS["Contacts"]= Contacts;
        WS["Tasks"]= Tasks;
        WS["Meetings"]= Meetings,
        WS["Organizations"]= Orgs
    
    sendResponse(200, JSON.stringify(WS), callback);

    
    
    
    
} 
function arraytoQueryObject(titleValues) {
    var titleObject = {};
    var index = 0;

    titleValues.forEach(function(value) {
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