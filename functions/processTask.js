const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const stepfunctions = new AWS.StepFunctions();

module.exports.handler = async (event) => {
  const records = event.Records;

  for (const record of records) {
    const messageBody = JSON.parse(record.body);
    const taskId = messageBody.taskId;

    // Start step function execution
    await stepfunctions
      .startExecution({
        stateMachineArn: process.env.TASK_PROCESSING_STATE_MACHINE,
        input: JSON.stringify({
          taskId: taskId,
        }),
      })
      .promise();
  }

  return { status: "Success" };
};
