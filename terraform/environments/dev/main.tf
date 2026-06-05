module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr   = "10.0.0.0/16"
  project_name = "imona"
  environment  = "dev"
}

module "security" {
  source = "../../modules/security"

  project_name = "imona"
  environment  = "dev"
  vpc_id       = module.vpc.vpc_id
}

module "alb" {
  source = "../../modules/alb"
  vpc_id = module.vpc.vpc_id
  project_name         = "imona"
  environment          = "dev"
  alb_security_group_id = module.security.alb_security_group_id
  public_subnet_id      = module.vpc.public_subnet_id
  public_subnet_2_id    = module.vpc.public_subnet_2_id
}


module "iam" {
  source = "../../modules/iam"

  project_name = "imona"
  environment  = "dev"
}


module "ecs" {
  source = "../../modules/ecs"

  project_name = "imona"
  environment  = "dev"

  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_security_group_id = module.security.ecs_security_group_id
  private_app_subnet_id = module.vpc.private_app_subnet_id
  target_group_arn = module.alb.target_group_arn
  ecs_task_role_arn =module.iam.ecs_task_role_arn

}


module "ecr" {
  source = "../../modules/ecr"

  project_name = "imona"
  environment  = "dev"
}

module "redis" {

 source = "../../modules/redis"

 project_name = "imona"

 environment = "dev"

 subnet_ids = [

   module.vpc.private_app_subnet_id

 ]

 vpc_id = module.vpc.vpc_id

 ecs_security_group_id = module.security.ecs_security_group_id

}

module "sqs" {

 source = "../../modules/sqs"

 project_name = "imona"

 environment = "dev"

}

module "notification_sqs" {

 source = "../../modules/sqs"

 project_name = "imona-notification"

 environment = "dev"

}

module "worker" {

 source = "../../modules/worker"

 project_name = "imona"

 environment = "dev"

 execution_role_arn = module.iam.ecs_task_execution_role_arn

 task_role_arn = module.iam.ecs_task_role_arn

 mongo_secret = "arn:aws:secretsmanager:eu-central-1:584034201125:secret:imona/dev/mongo-1RWBJ7"

 queue_secret = "arn:aws:secretsmanager:eu-central-1:584034201125:secret:imona/dev/sqs-url-h8LbNe"

 redis_host = module.redis.redis_endpoint

 subnet_id = module.vpc.private_app_subnet_id

 security_group_id = module.security.ecs_security_group_id

 cluster_id = module.ecs.ecs_cluster_id

}

module "auth" {

 source = "../../modules/auth"

 project_name = "imona"

 environment = "dev"

 cluster_id = module.ecs.ecs_cluster_id

 subnet_id = module.vpc.private_app_subnet_id

 security_group_id = module.security.ecs_security_group_id

 execution_role_arn = module.iam.ecs_task_execution_role_arn

 task_role_arn = module.iam.ecs_task_role_arn

 mongo_secret = "arn:aws:secretsmanager:eu-central-1:584034201125:secret:imona/dev/mongo-1RWBJ7"

}

module "notification" {

 source = "../../modules/notification"

 project_name = "imona"

 environment = "dev"

 cluster_id = module.ecs.ecs_cluster_id

 subnet_id = module.vpc.private_app_subnet_id

 security_group_id = module.security.ecs_security_group_id

 execution_role_arn = module.iam.ecs_task_execution_role_arn

 task_role_arn = module.iam.ecs_task_role_arn

 queue_secret = module.sqs.queue_url

}

module "lambda" {

 source = "../../modules/lambda"

 function_name = "imona-dlq-lambda"

 role_arn = "arn:aws:iam::584034201125:role/imona-dlq-lambda-role"

 zip_path = "../../../imona-dlq-lambda/lambda.zip"

 queue_arn = "arn:aws:sqs:eu-central-1:584034201125:imona-dev-dlq"

}

module "cognito" {

 source = "../../modules/cognito"

 project_name = "imona"

 environment = "dev"

}

module "auth_alarm" {

 source="../../modules/monitoring"

 cluster_name="imona-dev-cluster"

 service_name="imona-dev-auth"

}

module "worker_alarm" {

 source = "../../modules/monitoring"

 cluster_name = "imona-dev-cluster"

 service_name = "imona-dev-worker"

}

module "notification_alarm" {

 source = "../../modules/monitoring"

 cluster_name = "imona-dev-cluster"

 service_name = "imona-dev-notification"

}

module "service_alarm" {

 source = "../../modules/monitoring"

 cluster_name = "imona-dev-cluster"

 service_name = "imona-dev-service"

}

module "queue_alarm" {

 source = "../../modules/monitoring"

 cluster_name = ""

 service_name = ""

 queue_name = "imona-dev-events"

}


module "dashboard" {

 source = "../../modules/dashboard"

 cluster_name = "imona-dev-cluster"

 queue_name = "imona-dev-events"

}
