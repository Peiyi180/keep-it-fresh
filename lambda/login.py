import json
import boto3
import uuid


def lambda_handler(event, context):
    email = event['email']
    name = event['name']

    db = boto3.resource('dynamodb')

    user_table = db.Table('User')

    res = user_table.get_item(Key={
        'email': email
    })

    endpoint_response = {}

    if 'Item' in res:
        uid = res['Item']['uid']

        endpoint_response['status'] = 'current user'
        endpoint_response['reminder_status'] = res['Item']['reminder_status']
    else:
        uid = str(uuid.uuid4())
        user = {
            'email': email,
            'name': name,
            'uid': uid,
            'reminder_status': 'false'
        }
        user_table.put_item(Item=user)

        endpoint_response['status'] = 'new user'
        endpoint_response['reminder_status'] = 'false'

        create_refrigerator(db, uid)

    endpoint_response['uid'] = uid

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        },
        'body': json.dumps(endpoint_response)
    }


def create_refrigerator(db, uid):
    db.create_table(
        AttributeDefinitions=[
            {
                'AttributeName': 'uid',
                'AttributeType': 'S'
            }
        ],
        TableName=f'Refrigerator-{uid}',
        KeySchema=[
            {
                'AttributeName': 'uid',
                'KeyType': 'HASH'
            }
        ],
        BillingMode='PROVISIONED',
        ProvisionedThroughput={
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        },
    )
    print(f'Table Refrigerator-{uid} created.')