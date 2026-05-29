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

}


module "ecr" {
  source = "../../modules/ecr"

  project_name = "imona"
  environment  = "dev"
}