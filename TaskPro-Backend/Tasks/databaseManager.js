'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let dynamo = new AWS.DynamoDB.DocumentClient();

const Table_Name = 'Tasks';
const Table_WorkStream = 'WorkStreams'
const Table_Contacts='Contacts'

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveItem = item => {
	const params = {
		TableName: Table_Name,
		Item: item
	};
	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return item;
		});
};

module.exports.getItem = (itemId) => {
	const params = {
		Key: {
			Id : itemId
		},
		TableName:Table_Name 
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};
module.exports.getWorkStream = (itemId) => {
	const params = {
		Key: {
			Id : itemId
		},
		TableName:  Table_WorkStream
	};

	return dynamo
		.get(params)
		.promise()	
};
module.exports.getContact = (itemId) => {
	const params = {
		Key: {
			Id : itemId
		},
		TableName:  Table_Contacts
	};

	return dynamo
		.get(params)
		.promise()	
};

module.exports.getAllItemsAdminUser = () => {
	const params = {

		TableName: Table_Name

            }
	
	return dynamo.scan(params)
		.promise()
		.then(result => {
			return result.Items;
		});
};
module.exports.getAllItems = (UserId) => {
	const params = {

		TableName: Table_Name,

			FilterExpression:'CreatedBy = :CreatedBy',
			ExpressionAttributeValues:{ ":CreatedBy" : UserId }

            }
	
	return dynamo.scan(params)
		.promise()
		.then(result => {
			return result.Items;
		});
};
module.exports.getFilteredTasks = (params) => {

	
	return dynamo.scan(params)
		.promise()
		.then(result => {
			return result.Items;
		});
};
module.exports.updateItem = (Id,updateExpression,ExpressionAttributeNames,ExpressionAttributeValues) => {

   const params = {
     TableName: Table_Name,
     Key: {
      Id: Id,
     },
     UpdateExpression: updateExpression,
     ExpressionAttributeNames: ExpressionAttributeNames,
     ExpressionAttributeValues: ExpressionAttributeValues
   };

   return dynamo.update(params).promise().then(result => {
       return result;
   })
}

module.exports.deleteItem = itemId => {
	const params = {
		Key: {
			Id: itemId
		},
		TableName: Table_Name
	};

	return dynamo.delete(params).promise();
};

