import json
import boto3


def lambda_handler(event, context):
    user_uid = event['user_uid']
    item_uid = event['item_uid']

    db = boto3.client('dynamodb')

    # delete from db. Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/client/delete_item.html#delete-item
    db.delete_item(
        TableName=f'Refrigerator-{user_uid}',
        Key={
            'uid': {'S': item_uid}
        }
    )

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        }
    }
