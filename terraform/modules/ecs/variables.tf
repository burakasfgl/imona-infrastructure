variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "ecs_task_execution_role_arn" {
  type = string
}

variable "ecs_security_group_id" {
  type = string
}

variable "private_app_subnet_id" {
  type = string
}

variable "target_group_arn" {
  type = string
}