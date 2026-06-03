variable "project_name" {}

variable "environment" {}

variable "subnet_ids" {
  type = list(string)
}

variable "vpc_id" {}

variable "ecs_security_group_id" {

 type = string

}