variable "aws_region" {
  type = string
}

variable "project" {
  type    = string
  default = "closecount"
}

variable "env" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.10.0.0/16"
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "private_subnet_cidrs" {
  type = list(string)
}

variable "db_name" {
  type    = string
  default = "closecount"
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "docdb_instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "docdb_cluster_size" {
  type    = number
  default = 1
}

variable "api_desired_count" {
  type    = number
  default = 1
}

variable "client_url" {
  type    = string
  default = "http://localhost:3000"
}

variable "jwt_secret_arn" {
  type = string
}

variable "domain_name" {
  type    = string
  default = ""
}

variable "hosted_zone_name" {
  type    = string
  default = ""
}

variable "codestar_connection_arn" {
  type = string
}

variable "repo_owner" {
  type = string
}

variable "repo_name" {
  type = string
}

variable "repo_branch" {
  type = string
}

variable "react_app_api_url" {
  type = string
}

variable "react_app_host" {
  type = string
}
