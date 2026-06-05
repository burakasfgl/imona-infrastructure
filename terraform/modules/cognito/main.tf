resource "aws_cognito_user_pool" "this" {

 name = "${var.project_name}-${var.environment}-users"

 auto_verified_attributes = [

  "email"

 ]

 username_attributes = [

  "email"

 ]

 password_policy {

  minimum_length = 8

 }

}

resource "aws_cognito_user_pool_client" "this" {

 name = "${var.project_name}-${var.environment}-client"

 user_pool_id = aws_cognito_user_pool.this.id

 generate_secret = false

 explicit_auth_flows = [

 "ALLOW_USER_PASSWORD_AUTH",

 "ALLOW_REFRESH_TOKEN_AUTH",

 "ALLOW_USER_AUTH",

 "ALLOW_USER_SRP_AUTH"

]

}