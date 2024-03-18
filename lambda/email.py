import json
import boto3
from tabulate import tabulate
from datetime import datetime, timedelta


def lambda_handler(event, context):
    # reference: https://docs.aws.amazon.com/ses/latest/dg/send-an-email-using-sdk-programmatically.html
    dynamodb = boto3.resource('dynamodb')
    user_table = dynamodb.Table('User')

    user_list = user_table.scan()

    for user in user_list['Items']:
        email = user['email']
        uid = user['uid']
        user_name = user['name']
        reminder_status = user['reminder_status']

        if reminder_status == 'false':
            continue

        ref_table_name = f"Refrigerator-{uid}"
        ref_table = dynamodb.Table(ref_table_name)

        today = datetime.now().date()
        end_date = (today + timedelta(days=3)).isoformat()
        ref_items = ref_table.scan(
            FilterExpression='expire_date <= :end_date',
            ExpressionAttributeValues={
                ':end_date': end_date
            }
        )

        if len(ref_items['Items']) == 0:
            continue

        sorted_ref_items = sorted(ref_items['Items'], key=lambda x: x['expire_date'])

        data = []
        for item in sorted_ref_items:
            item_date = datetime.strptime(item['expire_date'], '%Y-%m-%d').date()
            days_to_expiry = (item_date - today).days

            if days_to_expiry < 0:
                days_expired = abs(days_to_expiry)
                status = f'Expired ({days_expired} days)'
            else:
                status = f'{days_to_expiry} days'
            data.append([item['name'], status])

            table_ref_items = tabulate(data, headers=['Item', 'Expire In'], tablefmt='html')
            table_ref_items = table_ref_items.replace('<table>', '<table border="1" cellpadding="5">')

            ses = boto3.client('ses')

        greeting = f'Dear {user_name},<br><br>Some of your items in your fridge are expiring soon:<br><br>'
        footer = '<br><br><br><br>Keep it Fresh<br>keep-it-fresh.jpeiyi.com'

        try:
            email_response = ses.send_email(
                Source='keep-it-fresh@jpeiyi.com',
                Destination={
                    'ToAddresses': [
                        email
                    ]
                },
                Message={
                    'Subject': {
                        'Data': 'Reminder From Your Keep it Fresh'
                    },
                    'Body': {
                        'Html': {
                            'Data': greeting + table_ref_items + footer
                        }
                    }
                }
            )
        except Exception as e:
            print(f'catched error {e}')
        print('continue running...')

    return {
        'statusCode': 200,
        'body': json.dumps('Email Sent!'),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST",
            'Content-Type': 'application/json'
        },
    }
