resource "aws_cloudwatch_log_group" "worker_logs" {

 name = "/ecs/imona-dev-worker"

 retention_in_days = 7

}


resource "aws_ecs_task_definition" "worker" {

 family                   = "${var.project_name}-${var.environment}-worker"

 network_mode             = "awsvpc"

 requires_compatibilities = ["FARGATE"]

 cpu    = 256

 memory = 512

 execution_role_arn = var.execution_role_arn

 task_role_arn = var.task_role_arn

 container_definitions=jsonencode([{

 name="worker"

 image="584034201125.dkr.ecr.eu-central-1.amazonaws.com/imona-dev-app:worker-v3"

 essential=true

 secrets=[

 {

  name="MONGO_URI"

  valueFrom=var.mongo_secret

 },

 {

  name="QUEUE_URL"

  valueFrom=var.queue_secret

 }

 ]

 environment=[

 {

  name="REDIS_HOST"

  value=var.redis_host

 }

 ]
logConfiguration={

 logDriver="awslogs"

 options={

  awslogs-group=aws_cloudwatch_log_group.worker_logs.name

  awslogs-region="eu-central-1"

  awslogs-stream-prefix="ecs"

 }

}

 }])

}

resource "aws_ecs_service" "worker" {

 name = "${var.project_name}-${var.environment}-worker"

 cluster = var.cluster_id

 task_definition = aws_ecs_task_definition.worker.arn

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
