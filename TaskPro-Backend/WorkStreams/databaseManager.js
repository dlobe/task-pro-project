'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let dynamo = new AWS.DynamoDB.DocumentClient();

const Table_Name = 'WorkStreams';

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
		TableName: Table_Name
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
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
module.exports.getFilteredItems = (params) => {
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

