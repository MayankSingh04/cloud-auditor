import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('FINDINGS_TABLE_NAME', 'default-table')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Fetches all findings from the DynamoDB table.
    """
    try:
        response = table.scan()
        items = response.get('Items', [])

        # This is to handle CORS for our web app
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(items)
        }
    except Exception as e:
        print(f"Error: {e}")
        return {'statusCode': 500, 'body': json.dumps('Error fetching findings')}