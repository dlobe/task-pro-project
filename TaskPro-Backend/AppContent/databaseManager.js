'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'AppContent';

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveItem = item => {
	const params = {
		TableName: TABLE_NAME,
		Item: item
	};
	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return item.itemId;
		});
};

module.exports.getItem = itemId => {
	const params = {
		Key: {
			Id: itemId
		},
		TableName: TABLE_NAME
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};

module.exports.getAllItems = () => {
	const params = {

		TableName: TABLE_NAME
	};
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

module.exports.deleteItem = itemId => {
	const params = {
		Key: {
			Id: itemId
		},
		TableName: TABLE_NAME
	};

	return dynamo.delete(params).promise();
};


module.exports.updateItem = (Id,updateExpression,ExpressionAttributeNames,ExpressionAttributeValues) => {
console.log(Id)
  
   const params = {
     TableName: TABLE_NAME,
     Key: {
      Id: Id,
     },
     UpdateExpression: updateExpression,
     ExpressionAttributeNames: ExpressionAttributeNames,
     ExpressionAttributeValues: ExpressionAttributeValues
   };
   console.log(params)

   return dynamo.update(params).promise().then(result => {
       return result;
   })
}


