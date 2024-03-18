import json
import boto3
import uuid
from datetime import datetime, timedelta


def lambda_handler(event, context):
    req = event

    user_uid = req['uid']
    name = req['name']
    days = req['days']

    item_uid = str(uuid.uuid4())

    expire_date = datetime.now().date() + timedelta(days=int(days))

    db = boto3.resource('dynamodb')

    refrigerator_table = db.Table(f'Refrigerator-{user_uid}')

    item = {
        'uid': item_uid,
        'name': name,
        'expire_date': expire_date.isoformat()
    }

    res = refrigerator_table.put_item(
        Item=item
    )

    print(f'Item added: {item}.')
    end_res = {}
    end_res['uid'] = item_uid
    end_res['expire_date'] = expire_date.isoformat()

    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        },
        'body': json.dumps(end_res)
    }
