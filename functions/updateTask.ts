import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

interface TaskUpdate {
  taskId: string;
  status: string;
}

export const handler = async (event: any): Promise<any> => {
  try {
    const taskUpdate = event as TaskUpdate;

    // Update task status in DynamoDB
    await dynamodb
      .update({
        TableName: process.env.TASKS_TABLE!,
        Key: {
          id: taskUpdate.taskId,
        },
        UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": taskUpdate.status,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      taskId: taskUpdate.taskId,
      status: taskUpdate.status,
      success: true,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
