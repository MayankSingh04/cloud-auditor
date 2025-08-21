import json
import boto3
import os
import uuid # To generate unique IDs for each finding

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
# Get the table name from an environment variable we will set in Terraform
TABLE_NAME = os.environ.get('FINDINGS_TABLE_NAME', 'default-table')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Scans for unrestricted SSH access and saves findings to DynamoDB.
    """
    ec2 = boto3.client('ec2')
    vulnerable_groups = []

    security_groups = ec2.describe_security_groups()['SecurityGroups']

    for group in security_groups:
        for permission in group.get('IpPermissions', []):
            if permission.get('FromPort') == 22 and permission.get('ToPort') == 22:
                for ip_range in permission.get('IpRanges', []):
                    if ip_range.get('CidrIp') == '0.0.0.0/0':
                        finding = {
                            "FindingId": str(uuid.uuid4()), # Generate a unique ID
                            "GroupId": group['GroupId'],
                            "GroupName": group['GroupName'],
                            "Description": "Security group allows unrestricted SSH access."
                        }
                        vulnerable_groups.append(finding)
                        
                        # Save the finding to our DynamoDB table
                        table.put_item(Item=finding)
                        break

    print(f"Found and saved {len(vulnerable_groups)} vulnerable security groups.")
    
    return {
        'statusCode': 200,
        'body': json.dumps(vulnerable_groups)
    }