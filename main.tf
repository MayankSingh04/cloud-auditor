# 1. Configure the AWS Provider
provider "aws" {
  region = "ap-south-1"
}

# 2. Create a Virtual Private Cloud (VPC)
# This is our isolated network container.
resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16" # Defines the private IP address range

  tags = {
    Name = "CloudAuditor-VPC"
  }
}

# 3. Create a Public Subnet
# This is a section of our VPC that can access the internet.
resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.main_vpc.id
  cidr_block = "10.0.1.0/24" # A smaller IP range within the VPC

  # This setting makes it a "public" subnet
  map_public_ip_on_launch = true

  tags = {
    Name = "CloudAuditor-PublicSubnet"
  }
}

# 4. Create an Internet Gateway
# This is the "door" from our VPC to the public internet.
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "CloudAuditor-IGW"
  }
}

# 5. Create a Route Table
# These are the "signposts" that direct traffic.
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  # This rule says: "To get to anywhere on the internet (0.0.0.0/0),
  # go through the Internet Gateway."
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "CloudAuditor-PublicRouteTable"
  }
}

# 6. Associate the Route Table with our Public Subnet
# This connects our subnet to the signposts.
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

# 7. Create an IAM Role (Permissions) for our Lambda Function
# This gives our function the permission to "describe" security groups.
resource "aws_iam_role" "lambda_exec_role" {
  name = "CloudAuditor-LambdaRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  # NEW SECTION: Add specific permissions for DynamoDB
  inline_policy {
    name = "AllowDynamoDBWrite"
    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Action   = ["dynamodb:PutItem", "dynamodb:UpdateItem"],
          Effect   = "Allow",
          Resource = aws_dynamodb_table.audit_findings_table.arn
        }
      ]
    })
  }
}

# 8. Attach the AWS-managed policy that allows reading EC2 info
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

# This resource creates a zip file from our Python script.
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "functions/check-security-groups/main.py"
  output_path = "sg_scanner.zip"
}

# 9. Create the Lambda Function
resource "aws_lambda_function" "sg_scanner_lambda" {
  function_name = "CloudAuditor-SecurityGroupScanner"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "main.lambda_handler"
  runtime       = "python3.9"
  timeout       = 30

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  # NEW SECTION: Pass the table name to the Python script
  environment {
    variables = {
      FINDINGS_TABLE_NAME = aws_dynamodb_table.audit_findings_table.name
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_policy]
}
# 10. Create an EventBridge Rule (The Scheduler)
# This rule will trigger our Lambda function on a schedule.
resource "aws_cloudwatch_event_rule" "daily_scanner_schedule" {
  name        = "CloudAuditor-DailyScannerSchedule"
  description = "Triggers the security group scanner once a day"

  # This is a simple cron expression for "run once a day".
  schedule_expression = "rate(1 day)"
}

# 11. Set the Lambda Function as the Target for the Scheduler
# This tells the scheduler WHAT to run.
resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.daily_scanner_schedule.name
  target_id = "TriggerLambda"
  arn       = aws_lambda_function.sg_scanner_lambda.arn
}

# 12. Give EventBridge Permission to Run the Lambda Function
# This is like giving the scheduler the authority to give orders to the inspector.
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sg_scanner_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_scanner_schedule.arn
}
# 13. Create a DynamoDB Table to Store Findings
# This is our serverless database for the audit results.
resource "aws_dynamodb_table" "audit_findings_table" {
  name         = "CloudAuditor-Findings"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "FindingId"

  attribute {
    name = "FindingId"
    type = "S" # S means the attribute is a String
  }

  tags = {
    Name = "CloudAuditor-Findings"
  }
}
# --- API Gateway and Frontend ---

# 14. Create a new Lambda function for our API
data "archive_file" "api_lambda_zip" {
  type        = "zip"
  source_file = "functions/get-findings/main.py"
  output_path = "api_lambda.zip"
}

resource "aws_lambda_function" "api_lambda" {
  function_name = "CloudAuditor-ApiHandler"
  role          = aws_iam_role.lambda_exec_role.arn # We can reuse the same role
  handler       = "main.lambda_handler"
  runtime       = "python3.9"
  timeout       = 10

  filename         = data.archive_file.api_lambda_zip.output_path
  source_code_hash = data.archive_file.api_lambda_zip.output_base64sha256

  environment {
    variables = {
      FINDINGS_TABLE_NAME = aws_dynamodb_table.audit_findings_table.name
    }
  }
}

# 15. Create the API Gateway to give our Lambda a public URL
resource "aws_apigatewayv2_api" "main_api" {
  name          = "CloudAuditor-Api"
  protocol_type = "HTTP"
}

# 16. Create the integration between the API Gateway and the Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.main_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.api_lambda.invoke_arn
}

# 17. Define the route for our API (e.g., /findings)
resource "aws_apigatewayv2_route" "findings_route" {
  api_id    = aws_apigatewayv2_api.main_api.id
  route_key = "GET /findings"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# 18. Create a "stage" to deploy the API
resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.main_api.id
  name        = "$default"
  auto_deploy = true
}

# 19. Give API Gateway permission to invoke our Lambda function
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main_api.execution_arn}/*/*"
}

# 20. Output the public URL of our API
output "api_endpoint_url" {
  value = "${aws_apigatewayv2_stage.api_stage.invoke_url}/findings"
}
# --- User Authentication (AWS Cognito) ---

# 21. Create a Cognito User Pool
# This is the secure directory where your user accounts will be stored.
resource "aws_cognito_user_pool" "user_pool" {
  name = "CloudAuditor-Users"

  # Configure password policies
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # Configure users to sign up with an email address
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  # Automatically verify user emails
  auto_verified_attributes = ["email"]

  tags = {
    Name = "CloudAuditor-UserPool"
  }
}

# 22. Create a Cognito User Pool Client
# This is what allows your React frontend to communicate with the User Pool.
resource "aws_cognito_user_pool_client" "app_client" {
  name         = "CloudAuditor-FrontendClient"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  # This allows the Amplify library to get the necessary tokens
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

# --- Outputs ---

# 23. Output the IDs needed by the frontend
output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.user_pool.id
  description = "The ID of the Cognito User Pool."
}

output "cognito_app_client_id" {
  value       = aws_cognito_user_pool_client.app_client.id
  description = "The ID of the Cognito App Client."
}
