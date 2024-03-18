import json
import boto3


def lambda_handler(event, context):
    uid = event['uid']

    db = boto3.resource('dynamodb')
    refrigerator_table = db.Table(f'Refrigerator-{uid}')
    items = refrigerator_table.scan()['Items']

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST",
            'Content-Type': 'application/json'
        },
        'body': items
    }
