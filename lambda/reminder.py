import json
import boto3


def lambda_handler(event, context):
    email = event['email']
    uid = event['uid']

    reminder_status = event['reminder_status']
    db = boto3.resource('dynamodb')
    user_table = db.Table('User')

    user = user_table.get_item(Key={'email': email})

    if uid == user['Item']['uid']:
        # reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html
        user_table.update_item(
            Key={
                'email': email
            },
            UpdateExpression=f'SET reminder_status = :rs',
            ExpressionAttributeValues={':rs': reminder_status}
        )
    else:
        return {
            'statusCode': 401,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST"
            }
        }

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        }
    }
