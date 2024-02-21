import csv
import os
import boto3
import pprint

CONCEPTS = 'Concepts'
dynamodb = boto3.resource('dynamodb')
# dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

# dynamodb.Table(CONCEPTS).delete()

# Create table if it doesn't already exist
# Otherwise get the table
if CONCEPTS in ([table.name for table in dynamodb.tables.all()]):
    table = dynamodb.Table(CONCEPTS)
else:
    table = dynamodb.create_table(
        TableName=CONCEPTS,
        AttributeDefinitions=[
            {
                'AttributeName': 'conceptId',
                'AttributeType': 'N'
            }
        ],
        KeySchema=[
            {
                'AttributeName': 'conceptId',
                'KeyType': 'HASH'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        },
    )


dirname = os.path.dirname(__file__)
csv_path = os.path.join(dirname, 'data/sample.csv')
csv.register_dialect('rgc', skipinitialspace=True, strict=True)

concepts = dict()
with open(csv_path) as csvfile:
    reader = csv.DictReader(csvfile, dialect='rgc')

    for row in reader:
        table.put_item(
            Item={
                'conceptId': int(row['conceptId']),
                'displayName': row['displayName'],
                'description': row['description'],
                'parentIds': None if row['parentIds'] == 'null' else set([int(x) for x in row['parentIds'].split(',')]),
                'childIds': None if row['childIds'] == 'null' else set([int(x) for x in row['childIds'].split(',')]),
                'alternateNames': None if row['alternateNames'] == 'null' else set([x for x in row['alternateNames'].split(',')])  
            }
        )

print(table.scan())

