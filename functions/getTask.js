const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const taskId = event.pathParameters.id;

    const result = await dynamodb
      .get({
        TableName: process.env.TASKS_TABLE,
        Key: { id: taskId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Task not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
