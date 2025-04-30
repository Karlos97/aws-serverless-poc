const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
const stepfunctions = new AWS.StepFunctions();

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const taskId = uuidv4();

    const task = {
      id: taskId,
      title: requestBody.title,
      description: requestBody.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store in DynamoDB
    await dynamodb
      .put({
        TableName: process.env.TASKS_TABLE,
        Item: task,
      })
      .promise();

    // Send message to SQS
    await sqs
      .sendMessage({
        QueueUrl: process.env.TASKS_QUEUE,
        MessageBody: JSON.stringify({ taskId }),
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(task),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
