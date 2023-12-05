'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

const AWS = require('aws-sdk');


exports.Organizations = (event, context, callback) => {
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
    item.Id = uuidv1();

    item.CreatedBy = userObj.sub;
    item.UpdatedBy = userObj.sub;
    item.CreatedTs = Date.now();
    item.LastUpdatedTs = Date.now();

    databaseManager.saveItem(item).then(response => {


        sendResponse(200, JSON.stringify(response), callback);

    });




}


function getItem(event, callback) {

    const userObj = event.requestContext.authorizer.claims

    if (event.pathParameters) {


        const itemId = event.pathParameters.Id;

        databaseManager.getItem(itemId).then(response => {
            console.log(response);

            if (response) {
                getOrgDetails(response, userObj, callback);
                //   sendResponse(200, JSON.stringify(response), callback);
            } else {
                sendResponse(400, JSON.stringify('No data found'), callback);
            }
        });
    } else {
        databaseManager.getAllItems(userObj.sub).then(response => {


            if (response) {

                sendResponse(200, JSON.stringify(response), callback);
            } else {
                sendResponse(400, JSON.stringify('No data found'), callback);
            }
        });

    }







}

function updateItem(event, callback) {
    const userObj = event.requestContext.authorizer.claims
    const itemId = event.pathParameters.Id;

    databaseManager.getItem(itemId).then(response => {
        console.log(response);

        if (response) {
            if (response.CreatedBy == userObj.sub) {
                update(event, callback)
            } else {
                sendResponse(400, JSON.stringify('YOu are not Auhorized to Update this'), callback);
            }

        } else {
            sendResponse(400, JSON.stringify('No data found'), callback);
        }
    });

}
async function getOrgDetails(Org, userObj, callback) {

    const paramContacts = {
        TableName: 'Contacts',
        FilterExpression: 'OrgId =:OrgId',
        ExpressionAttributeValues: {
            ":OrgId": Org.Id
        }
    }


    const Contacts = await databaseManager.getFilteredItems(paramContacts)

    const paramTasks = {
        TableName: 'Tasks',
        FilterExpression: 'OrgId =:OrgId',
        ExpressionAttributeValues: {
            ":OrgId": Org.Id
        }
    }


    const Tasks = await databaseManager.getFilteredItems(paramTasks)

    const paramMeetings = {
        TableName: 'Meetings',
        FilterExpression: 'contains (OrgIds, :val)',
        ExpressionAttributeValues: {
            ":val": Org.Id
        }
    }
    const Meetings = await databaseManager.getFilteredItems(paramMeetings)


    var AllData = Tasks.concat(Meetings);
    var workStreamIds = []
    for (const obj of AllData) {
        if (obj.WorkStreamId) {
            workStreamIds.push(obj.WorkStreamId)
        }
    }

    var wsObject = arraytoQueryObject(workStreamIds)
    var filterQuery = "Id IN (" + Object.keys(wsObject).toString() + ")";

    var expVal = wsObject;
    var WorkStreams = []
    if (workStreamIds.length) {
        const paramWS = {

            TableName: 'WorkStreams',

            FilterExpression: filterQuery,
            ExpressionAttributeValues: expVal
        }
        const WorkStreams = await databaseManager.getFilteredItems(paramWS)
    }

    Org["Contacts"] = Contacts;
    Org["Tasks"] = Tasks;
    Org["Meetings"] = Meetings,
        Org["WorkStreams"] = WorkStreams

    sendResponse(200, JSON.stringify(Org), callback);


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

        if (response) {
            if (response.CreatedBy == userObj.sub) {
                databaseManager.deleteItem(itemId).then(response => {
                    sendResponse(200, 'Item Deleted', callback);
                });
            } else {
                sendResponse(400, JSON.stringify('YOu are not Auhorized to delete this'), callback);
            }

        } else {
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