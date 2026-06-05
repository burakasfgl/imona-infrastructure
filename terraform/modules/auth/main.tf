resource "aws_cloudwatch_log_group" "auth_logs" {

 name = "/ecs/imona-dev-auth"

 retention_in_days = 7

}


resource "aws_ecs_task_definition" "auth" {

 family                   = "${var.project_name}-${var.environment}-auth"

 network_mode             = "awsvpc"

 requires_compatibilities = ["FARGATE"]

 cpu    = 256

 memory = 512

 execution_role_arn = var.execution_role_arn

 task_role_arn = var.task_role_arn

 container_definitions=jsonencode([{

 name="auth"

 image="584034201125.dkr.ecr.eu-central-1.amazonaws.com/imona-auth:v1"

 essential=true

 secrets=[

 
    {
    
     name="MONGO_URI"
    
     valueFrom=var.mongo_secret
    
    }
    
     ]
logConfiguration={

 logDriver="awslogs"

 options={

  awslogs-group=aws_cloudwatch_log_group.auth_logs.name

  awslogs-region="eu-central-1"

  awslogs-stream-prefix="ecs"

 }

}

 }])

}

resource "aws_ecs_service" "auth" {

 name = "${var.project_name}-${var.environment}-auth"

 cluster = var.cluster_id

 task_definition = aws_ecs_task_definition.auth.arn

 desired_count = 1

 launch_type = "FARGATE"

 network_configuration {

  assign_public_ip = false

  subnets = [var.subnet_id]

  security_groups = [

   var.security_group_id

  ]

 }

}
