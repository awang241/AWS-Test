import * as fs from 'node:fs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";


//const html = fs.readFileSync('index.html', { encoding: 'utf8' });
const dbClient = new DynamoDBClient({});
const dbDocClient = DynamoDBDocumentClient.from(dbClient);

/**
 * Returns an HTML page containing an interactive Web-based tutorial.
 * Visit the function URL to see it and learn how to build with lambda.
 */
export const handler = async (event) => {
    let body;
    let headers;
    let statusCode;
    let method = event.requestContext.http.method;
    try {
        if (method === "GET") {
            const dbResult = await dbDocClient.send(
                new ScanCommand({
                    TableName: 'test-table'
                })    
            );
            statusCode = 200;
            headers = {
                'Content-Type': 'application/json',
            };
            body = JSON.stringify(dbResult.Items);
        } else {
            statusCode = 405;
            body = `${method} method not supported for this endpoint`;
        }
        
    }
    catch (error) {
        statusCode = 400;
        headers = {
            'Content-Type': 'application/json',
        };
        body = {
            message: error.message
        }
    }
    return {statusCode, body, headers};
};
