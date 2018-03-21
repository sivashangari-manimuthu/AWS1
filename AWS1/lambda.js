let AWS = require('aws-sdk');
let SL = require('@slappforge/slappforge-sdk');
const sqs = new SL.AWS.SQS(AWS);
const sns = new AWS.SNS();
const s3 = new AWS.S3();
const kinesis = new AWS.Kinesis();
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {


	callback(null, 'Successfully executed');
	ddb.put({
		TableName: 'LeadDetails',
		Item: { 'LeadId': 123, 'LeadName': 'Sivashangari', 'Company': 'aws' }
	}, function (err, data) {
		if (err) {
			//handle error
		} else {
			//your logic goes here

			sns.publish({
				Message: 'testing direct sms from sigma',
				MessageAttributes: {
					'AWS.SNS.SMS.SMSType': {
						DataType: 'String',
						StringValue: 'Promotional'
					},
				},
				PhoneNumber: '9791765670'
			}).promise()
				.then(data => {
					// your code goes here
				})
			
			sqs.receiveMessage({
				QueueUrl: 'https://sqs.us-east-1.amazonaws.com/883364783971/awsqueue',
				AttributeNames: ['All'],
				MaxNumberOfMessages: '1',
				VisibilityTimeout: '30',
				WaitTimeSeconds: '0',
				MessageAttributeNames: ['']
			}, function (receivedMessages) {
				receivedMessages.forEach(message => {
					// your logic to access each message through out the loop. Each message is available under variable message 
					// within this block
				})
			}, function (error) {
				// implement error handling logic here
			});
				.catch(err => {
				// error handling goes here
			});
	kinesis.describeStream({
		StreamName: 'my-stream'
	}).promise()
		.then(data => {
			// your logic goes here
			s3.getBucketLocation({
				'Bucket': "crmbucket"
			}).promise()
				.then(data => {
					console.log(data);           // successful response
					/*
					data = {
						LocationConstraint: "us-west-2"
					}
					*/
				})
				.catch(err => {
					console.log(err, err.stack); // an error occurred
				});
		})
		.catch(err => {
			// error handling goes here
		});
}
	});
}